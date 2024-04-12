import { Outlet } from "@remix-run/react";
import Header from "~/components/Header";

function ContentLayout() {
  return (
    <>
      <Header />
      <div className="w-full mt-5" />
      <div className="max-w-screen-2xl mx-auto px-2.5 lg:px-5">
        <Outlet />
      </div>
    </>
  );
}

export default ContentLayout;
