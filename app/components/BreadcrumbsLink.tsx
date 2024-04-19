import { Link } from "@remix-run/react";

function BreadcrumbsLink({
  uri,
  name,
}: Readonly<{ uri: string; name: string }>) {
  return (
    <>
      <Link
        to={uri}
        className="text-primary-700 underline underline-offset-2 hover:brightness-125"
      >
        {name}
      </Link>
      <span className="mx-0.5 text-primary-600">/</span>
    </>
  );
}

export default BreadcrumbsLink;
