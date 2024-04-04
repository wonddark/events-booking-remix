import { MetaFunction } from "@remix-run/node";
import Button from "~/components/Button";
import { Link } from "@remix-run/react";
import HorizontalLogo from "~/routes/_auth/HorizontalLogo";

export const meta: MetaFunction = () => {
  return [{ title: "Login" }];
};

function Login() {
  return (
    <div className="w-[90%] max-w-[500px] p-2.5 py-5 md:p-9 rounded-xl bg-white shadow-lg">
      <div className="flex justify-center mb-14">
        <HorizontalLogo />
      </div>
      <p className="text-center md:text-left text-xl font-bold text-primary-900">
        Authenticate yourself
      </p>
      <form className="flex flex-col items-center mt-5 gap-3">
        <div className="w-full">
          <label htmlFor="email" className="text-primary-950">
            Email
          </label>
          <input
            type="email"
            className="rounded-lg py-1.5 px-3.5 w-full"
            placeholder="user@email.com"
            id="email"
          />
        </div>
        <div className="w-full">
          <label htmlFor="password" className="text-primary-950">
            Password
          </label>
          <input
            type="password"
            className="rounded-lg py-1.5 px-3.5 w-full"
            placeholder="Password"
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
