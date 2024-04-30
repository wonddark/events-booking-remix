import { UIMatch } from "@remix-run/react";
import BreadcrumbsLink from "~/components/BreadcrumbsLink";
import BreadcrumbsPlain from "~/components/BreadcrumbsPlain";

// noinspection JSUnusedGlobalSymbols
export const handle = {
  breadcrumbs: (match: UIMatch, currentPath: boolean) => {
    const name = "Categories";
    if (currentPath) {
      return <BreadcrumbsPlain key={match.id} name={name} />;
    } else {
      return (
        <BreadcrumbsLink key={match.id} name={name} uri={match.pathname} />
      );
    }
  },
};
