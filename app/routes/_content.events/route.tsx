import { Outlet } from "@remix-run/react";

export default function Events() {
  return (
    <div className="px-5">
      <Outlet />
    </div>
  );
}
