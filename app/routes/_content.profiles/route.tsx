import { Outlet, UIMatch } from "@remix-run/react";
import BreadcrumbsLink from "~/components/BreadcrumbsLink";

// noinspection JSUnusedGlobalSymbols
export const handle = {
  breadcrumbs: (match: UIMatch) => {
    return <BreadcrumbsLink key={match.id} name="Home" uri="/events" />;
  },
};

function Profiles() {
  return <Outlet />;
}

export default Profiles;
