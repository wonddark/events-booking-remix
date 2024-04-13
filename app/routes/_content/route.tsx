import { Outlet, useLoaderData } from "@remix-run/react";
import Header from "~/components/Header";
import { LoaderFunctionArgs } from "@remix-run/node";

export const loader = ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("query");

  return { query };
};

function ContentLayout() {
  const { query } = useLoaderData<typeof loader>();
  return (
    <>
      <Header query={query} />
      <div className="w-full mt-5" />
      <div className="max-w-screen-2xl mx-auto px-2.5 lg:px-5">
        <Outlet />
      </div>
    </>
  );
}

export default ContentLayout;
