import {
  ActionFunction,
  json,
  LoaderFunctionArgs,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import { Link, useFetcher } from "@remix-run/react";
import HorizontalLogo from "~/routes/_auth/HorizontalLogo";
import createDBClient from "~/utils/supabase/server";
import { commitSession } from "~/sessions";
import { getSessionFromCookie } from "~/utils/session";
import { FormEventHandler } from "react";
import { Button } from "antd";

// noinspection JSUnusedGlobalSymbols
export const meta: MetaFunction = () => {
  return [{ title: "Login" }];
};

// noinspection JSUnusedGlobalSymbols
export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSessionFromCookie(request);

  if (session.has("user_id")) {
    return redirect("/events");
  }

  const data = { error: session.get("error") };

  return json(data, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export const action: ActionFunction = async ({ request }) => {
  const session = await getSessionFromCookie(request);
  const redirectUri = new URL(request.url).searchParams.get("redirect_uri");

  const body = await request.formData();
  const email = body.get("email");
  const password = body.get("password");

  const dbClient = createDBClient({ request });

  if (
    email &&
    typeof email === "string" &&
    password &&
    typeof password === "string"
  ) {
    const { data } = await dbClient.auth.signInWithPassword({
      email,
      password,
    });

    if (data.user === null) {
      session.flash("error", "Wrong credentials");

      return redirect("/login", {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    }

    session.set("user_id", data.session.user.id);
    session.set("access_token", data.session.access_token);
    session.set("refresh_token", data.session.refresh_token);

    return redirect(redirectUri ?? "/events", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  throw new Response(body, { status: 400 });
};

function Login() {
  const response = useFetcher<typeof action>();
  const wrongCredentials = Boolean(response.data?.error);
  const loginIn = response.state === "submitting";

  const sendCredentials: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    response.submit(event.currentTarget);
  };

  return (
    <div className="w-[90%] max-w-[400px] p-2.5 py-5 md:p-9 rounded-xl bg-white shadow-lg">
      <div className="flex justify-center mb-14">
        <HorizontalLogo />
      </div>
      <p className="text-center md:text-left text-xl font-bold text-primary-900">
        Authenticate yourself
      </p>
      <form
        className="flex flex-col items-center mt-5 gap-3"
        method="POST"
        onSubmit={sendCredentials}
      >
        {wrongCredentials && (
          <div
            className="flex items-center p-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 w-full"
            role="alert"
          >
            <svg
              className="flex-shrink-0 inline w-4 h-4 me-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <span className="sr-only">Info</span>
            <div>
              <span className="font-medium">Wrong credentials!</span>
            </div>
          </div>
        )}
        <div className="w-full">
          <label htmlFor="email" className="text-primary-950">
            Email
          </label>
          <input
            type="email"
            className={`rounded-lg py-1.5 px-3.5 w-full${
              wrongCredentials ? " border-red-400" : ""
            }`}
            placeholder="user@email.com"
            id="email"
            name="email"
            defaultValue={response.data?.email ?? ""}
          />
        </div>
        <div className="w-full">
          <label htmlFor="password" className="text-primary-950">
            Password
          </label>
          <input
            type="password"
            className={`rounded-lg py-1.5 px-3.5 w-full${
              wrongCredentials ? " border-red-400" : ""
            }`}
            placeholder="Password"
            name="password"
            defaultValue={response.data?.password ?? ""}
          />
        </div>
        <div className="flex flex-col w-[80%] mt-7">
          <Button htmlType="submit" type="primary" loading={loginIn}>
            Login
          </Button>
          <p className="text-center mt-4">
            <Link
              to="/register"
              className="text-primary-700 hover:brightness-125"
            >
              Register
            </Link>{" "}
            if you don&apos;t have an account yet
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;
