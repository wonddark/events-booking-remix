import { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import Button from "~/components/Button";

export const meta: MetaFunction = () => {
  return [{ title: "Register" }];
};

function Register() {
  return (
    <div className="w-[500px] p-9 rounded-xl bg-white shadow-lg">
      <p className="text-center text-2xl">Create account</p>
      <form className="flex flex-col items-center mt-11 gap-3">
        <input
          type="email"
          className="rounded-3xl py-3 px-5 w-full"
          placeholder="user@email.com"
        />
        <input
          type="password"
          className="rounded-3xl py-3 px-5 w-full"
          placeholder="Password"
        />
        <input
          type="password"
          className="rounded-3xl py-3 px-5 w-full"
          placeholder="Confirm password"
        />
        <label htmlFor="accept-tac" className="w-full">
          <input type="checkbox" id="accept-tac" /> You with agree our terms and
          conditions
        </label>
        <div className="flex flex-col w-[80%] mt-7">
          <Button label="Register" type="submit" style="primary" />
          <p className="text-center mt-4">
            <Link to="/login">Login</Link> if you already have an account
          </p>
        </div>
      </form>
    </div>
  );
}

export default Register;
