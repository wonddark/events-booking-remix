import { Outlet } from "@remix-run/react";
import Header from "~/components/Header";

function ContentLayout() {
  return (
    <>
      <Header />
      <div className="w-full mt-5" />
      <Outlet />
    </>
  );
}

export default ContentLayout;
