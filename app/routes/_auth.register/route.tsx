import { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import Button from "~/components/Button";
import HorizontalLogo from "~/routes/_auth/HorizontalLogo";
import createDBClient from "~/utils/supabase/server";

// noinspection JSUnusedGlobalSymbols
export const meta: MetaFunction = () => {
  return [{ title: "Register" }];
};

// noinspection JSUnusedGlobalSymbols
export const action = async ({ request }: ActionFunctionArgs) => {
  const body = await request.formData();
  const email = body.get("email");
  const password = body.get("password");

  const dbClient = await createDBClient({ request });

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
  return (
    <div className="w-[90%] max-w-[400px] p-2.5 py-5 md:p-9 rounded-xl bg-white shadow-lg">
      <div className="flex justify-center mb-14">
        <HorizontalLogo />
      </div>
      <p className="text-center md:text-left text-xl font-bold text-primary-900">
        Create account
      </p>
      <form className="flex flex-col items-center mt-5 gap-3" method="POST">
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
          <Button label="Register" type="submit" style="primary" />
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
