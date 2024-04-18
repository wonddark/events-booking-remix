import Button from "~/components/Button";
import { useFetcher } from "@remix-run/react";
import { action } from "~/routes/_auth.logout/route";

function LogoutButton() {
  //
  const logout = useFetcher<typeof action>();
  //
  return (
    <logout.Form method="post" action="/logout">
      <Button label="Logout" type="submit" />
    </logout.Form>
  );
}

export default LogoutButton;
