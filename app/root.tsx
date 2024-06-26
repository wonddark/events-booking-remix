import { cssBundleHref } from "@remix-run/css-bundle";
import { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  isRouteErrorResponse,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigation,
  useRouteError,
} from "@remix-run/react";
import stylesheet from "~/styles/app.css";
import { useEffect } from "react";
import ServerError from "~/components/ServerError";
import NotFoundError from "~/components/NotFoundError";
import { ConfigProvider } from "antd";

// noinspection JSUnusedGlobalSymbols
export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: stylesheet },
];

// noinspection JSUnusedGlobalSymbols
export const meta: MetaFunction = () => {
  return [
    { title: "EventsBooking" },
    { name: "description", content: "Find, post and share exciting events" },
  ];
};

// noinspection JSUnusedGlobalSymbols
export default function App() {
  const navigation = useNavigation();
  useEffect(() => {
    if (localStorage) {
      if (
        localStorage.getItem("color-theme") === "dark" ||
        (!("color-theme" in localStorage) &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      ) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
        <Meta />
        <Links />
        <title></title>
      </head>
      <body className="text-gray-600 text-[14px]">
        {navigation.state === "loading" && (
          <div className="fixed top-0 right-0 left-0 bottom-0 z-50 backdrop-blur-lg flex justify-center items-center bg-transparent">
            <div className="p-48 text-primary-500">
              <div className="lds-ripple bg-[#ffffff0a]">
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          </div>
        )}
        <ConfigProvider
          theme={{
            token: {
              fontFamily: [
                "Montserrat",
                "ui-sans-serif",
                "system-ui",
                "-apple-system",
                "system-ui",
                "Segoe UI",
                "Roboto",
                "Helvetica Neue",
                "Arial",
                "Noto Sans",
                "sans-serif",
                "Apple Color Emoji",
                "Segoe UI Emoji",
                "Segoe UI Symbol",
                "Noto Color Emoji",
              ].join(","),
              fontSize: 14,
              colorPrimary: "#0d9488",
            },
          }}
        >
          <Outlet />
        </ConfigProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

// noinspection JSUnusedGlobalSymbols
export function ErrorBoundary() {
  const error = useRouteError();

  const renderError = () => {
    if (isRouteErrorResponse(error)) {
      switch (error.status) {
        case 404:
          return <NotFoundError />;
        default:
          return "Not handled error";
      }
    }
    return <ServerError />;
  };

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
        <title>Oops!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div className="w-full mt-5" />
        {renderError()}
        <Scripts />
      </body>
    </html>
  );
}
