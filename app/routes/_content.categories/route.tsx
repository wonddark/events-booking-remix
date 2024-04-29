import { ActionFunctionArgs } from "@remix-run/node";
import createDBClient from "~/utils/supabase/server";
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

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const query = formData.get("category_name") ?? "";
  const dbClient = createDBClient({ request });

  return dbClient
    .from("categories")
    .select()
    .ilike("name", `%${query}%`)
    .limit(15);
}
