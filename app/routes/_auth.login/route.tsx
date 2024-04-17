import { ActionFunction, MetaFunction } from "@remix-run/node";
import Button from "~/components/Button";
import { Link, useActionData, useNavigate } from "@remix-run/react";
import HorizontalLogo from "~/routes/_auth/HorizontalLogo";
import createDBClient from "~/utils/supabase/server";
import { useEffect } from "react";

// noinspection JSUnusedGlobalSymbols
export const meta: MetaFunction = () => {
  return [{ title: "Login" }];
};

export const action: ActionFunction = async ({ request }) => {
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
    const { data, error } = await dbClient.auth.signInWithPassword({
      email,
      password,
    });

    return { email, password, error, session: data?.session };
  }

  throw new Response(body, { status: 400 });
};

function Login() {
  const response = useActionData<typeof action>();
  const navigate = useNavigate();
  const wrongCredentials = Boolean(response?.error);

  useEffect(
    () => {
      if (window && response?.session) {
        localStorage.setItem("session", JSON.stringify(response.session));
        navigate("/events");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [response]
  );

  return (
    <div className="w-[90%] max-w-[400px] p-2.5 py-5 md:p-9 rounded-xl bg-white shadow-lg">
      <div className="flex justify-center mb-14">
        <HorizontalLogo />
      </div>
      <p className="text-center md:text-left text-xl font-bold text-primary-900">
        Authenticate yourself
      </p>
      <form className="flex flex-col items-center mt-5 gap-3" method="POST">
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
            defaultValue={response?.email}
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
            defaultValue={response?.password}
          />
        </div>
        <div className="flex flex-col w-[80%] mt-7">
          <Button label="Login" type="submit" style="primary" />
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
