import { Outlet } from "@remix-run/react";

function Auth() {
  return (
    <div className="bg-[url('/images/pablo-heimplatz-ZODcBkEohk8-unsplash.jpg')] w-screen h-screen bg-cover">
      <div className="w-full h-full flex flex-col justify-center items-center backdrop-blur-md gap-12">
        <Outlet />
      </div>
    </div>
  );
}

export default Auth;
