import { isRouteErrorResponse, Outlet, useRouteError } from "@remix-run/react";
import AccessDeniedError from "~/components/AccessDeniedError";
import NotFoundError from "~/components/NotFoundError";
import ServerError from "~/components/ServerError";
import { ErrorResponse } from "@remix-run/node";

export default function Events() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    switch (error.status) {
      case 403:
        return <AccessDeniedError />;
      case 404:
        return <NotFoundError />;
      case 500:
        return <ServerError />;
      default:
        return <></>;
    }
  }

  return (
    <section className="">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600">
            {(error as ErrorResponse).status}
          </h1>
          <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl">
            {(error as ErrorResponse).data}
          </p>
          <p className="mb-4 text-xl text-gray-900">
            We are facing some problems in house but we are already working on
            solve them
          </p>
          <a
            href="/"
            className="inline-flex text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center my-4"
          >
            Back to Homepage
          </a>
        </div>
      </div>
    </section>
  );
}
