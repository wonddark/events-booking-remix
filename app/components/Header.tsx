import Button from "~/components/Button";
import { Link, useNavigate } from "@remix-run/react";

function Header() {
  const navigate = useNavigate();

  const goLogin = () => {
    navigate("/login");
  };

  const goRegister = () => {
    navigate("/register");
  };

  return (
    <header className="px-5 py-3 border-b border-b-gray-200">
      <div className="max-w-screen-xl mx-auto flex items-center flex-wrap md:flex-nowrap justify-between md:justify-start">
        <Link to="/" className="grow-0 order-1">
          EB
        </Link>
        <div className="grow md:pl-5 md:pr-20 order-last md:order-2 w-full mt-3 md:mt-0">
          <input
            type="search"
            className="w-full h-8 rounded-3xl text-xs bg-gray-100 focus:bg-gray-50 border-gray-200 focus:border-gray-50 focus:ring-gray-300"
            placeholder="Search exciting events"
          />
        </div>
        <div className="flex gap-x-2 grow-0 order-2 md:order-last">
          <Button label="Login" type="button" onClick={goLogin} />
          <Button
            label="Create event"
            type="button"
            style="primary"
            onClick={goRegister}
          />
        </div>
      </div>
    </header>
  );
}

export default Header;
