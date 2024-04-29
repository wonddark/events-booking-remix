import { LoaderFunctionArgs } from "@remix-run/node";
import createDBClient from "~/utils/supabase/server";
import { UIMatch, useLoaderData } from "@remix-run/react";
import NotFoundError from "~/components/NotFoundError";
import { faFolderTree } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EventsGrid from "~/components/EventsGrid";
import BreadcrumbsPlain from "~/components/BreadcrumbsPlain";
import BreadcrumbsLink from "~/components/BreadcrumbsLink";

// noinspection JSUnusedGlobalSymbols
export const handle = {
  breadcrumbs: (match: UIMatch, currentPath: boolean) => {
    const name = (match.data as { data: { name: string } })?.data?.name;
    if (currentPath) {
      return <BreadcrumbsPlain key={match.id} name={name} />;
    } else {
      return (
        <BreadcrumbsLink key={match.id} name={name} uri={match.pathname} />
      );
    }
  },
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const dbClient = createDBClient({ request });

  return dbClient
    .from("categories")
    .select()
    .eq("id", `${params.category_id}`)
    .maybeSingle();
}

function CategoryPage() {
  const { data } = useLoaderData<typeof loader>();

  return (
    <section>
      {data ? (
        <>
          <h2 className="text-2xl font-bold mb-3">
            <FontAwesomeIcon icon={faFolderTree} className="mr-2" />
            {data.name}
          </h2>
          <EventsGrid categoryId={data.id} />
        </>
      ) : (
        <NotFoundError />
      )}
    </section>
  );
}

export default CategoryPage;
