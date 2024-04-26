import {
  ActionFunctionArgs,
  LoaderFunction,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import { Link, useFetcher, useNavigate } from "@remix-run/react";
import HorizontalLogo from "~/routes/_auth/HorizontalLogo";
import createDBClient from "~/utils/supabase/server";
import { getSessionFromCookie } from "~/utils/session";
import { commitSession } from "~/sessions";
import { FormEventHandler, useEffect } from "react";
import { Button } from "antd";

// noinspection JSUnusedGlobalSymbols
export const meta: MetaFunction = () => {
  return [{ title: "Register" }];
};

// noinspection JSUnusedGlobalSymbols
export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSessionFromCookie(request);

  if (session.has("user_id")) {
    return redirect("/events", {
      headers: { "Set-cookie": await commitSession(session) },
    });
  }

  return new Response(null, {
    status: 200,
    headers: { "Set-cookie": await commitSession(session) },
  });
};

// noinspection JSUnusedGlobalSymbols
export const action = async ({ request }: ActionFunctionArgs) => {
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
    const { data, error } = await dbClient.auth.signUp({
      email: email,
      password: password,
    });
    return { data, error };
  }

  return { data: null, error: null };
};

function Register() {
  const register = useFetcher<typeof action>();
  const navigate = useNavigate();
  const loading = register.state === "submitting";

  const sendData: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    register.submit(event.currentTarget);
  };

  useEffect(() => {
    if (register.data?.data?.user) {
      navigate("/login");
    }
  }, [register.data]);

  return (
    <div className="w-[90%] max-w-[400px] p-2.5 py-5 md:p-9 rounded-xl bg-white shadow-lg">
      <div className="flex justify-center mb-14">
        <HorizontalLogo />
      </div>
      <p className="text-center md:text-left text-xl font-bold text-primary-900">
        Create account
      </p>
      <form
        className="flex flex-col items-center mt-5 gap-3"
        method="POST"
        onSubmit={sendData}
      >
        <div className="w-full">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="rounded-lg py-1.5 px-3.5 w-full"
            placeholder="user@email.com"
            id="email"
            name="email"
          />
        </div>
        <div className="w-full">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="rounded-lg py-1.5 px-3.5 w-full"
            placeholder="Password"
            id="password"
            name="password"
          />
        </div>
        <div className="w-full">
          <label htmlFor="confirm">Confirm password</label>
          <input
            type="password"
            className="rounded-lg py-1.5 px-3.5 w-full"
            placeholder="Confirm password"
            id="confirm"
          />
        </div>
        <label htmlFor="accept-tac" className="w-full">
          <input type="checkbox" id="accept-tac" /> You with agree our terms and
          conditions
        </label>
        <div className="flex flex-col w-[80%] mt-7">
          <Button htmlType="submit" type="primary" loading={loading}>
            Register
          </Button>
          <p className="text-center mt-4">
            <Link to="/login" className="text-primary-700 hover:brightness-125">
              Login
            </Link>{" "}
            if you already have an account
          </p>
        </div>
      </form>
    </div>
  );
}

export default Register;
