import { Link, Outlet } from "@remix-run/react";
import Button from "~/components/Button";

function Auth() {
  return (
    <div className="bg-[url('/images/pablo-heimplatz-ZODcBkEohk8-unsplash.jpg')] w-screen h-screen bg-cover">
      <div className="w-full h-full flex flex-col items-center">
        <header className="px-5 py-3 backdrop-blur-3xl w-full text-white">
          <div className="max-w-screen-xl mx-auto flex items-center flex-wrap md:flex-nowrap justify-between">
            <Link to="/">EB</Link>
            <nav>
              <ul>
                <li>
                  <Button label="Events" type="button" />
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <div className="w-full flex-1 flex flex-col justify-center items-center backdrop-blur-lg">
          <div className="w-fit">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
