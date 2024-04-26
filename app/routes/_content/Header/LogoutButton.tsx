import { useFetcher } from "@remix-run/react";
import { action } from "~/routes/_auth.logout/route";
import { Button } from "antd";

function LogoutButton() {
  //
  const logout = useFetcher<typeof action>();
  //
  return (
    <logout.Form method="post" action="/logout">
      <Button htmlType="submit">Logout</Button>
    </logout.Form>
  );
}

export default LogoutButton;
