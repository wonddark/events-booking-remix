import { MetaFunction } from "@remix-run/node";
import Button from "~/components/Button";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [{ title: "Login" }];
};

function Login() {
  return (
    <div className="w-[500px] p-9 rounded-xl bg-white shadow-lg">
      <p className="text-center text-2xl">Authenticate yourself</p>
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
        <div className="flex flex-col w-[80%] mt-7">
          <Button label="Login" type="submit" style="primary" />
          <p className="text-center mt-4">
            <Link to="/register">Register</Link> if you don&apos;t have an
            account yet
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;
