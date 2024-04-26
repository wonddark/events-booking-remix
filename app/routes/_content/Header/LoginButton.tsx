import { useNavigate } from "@remix-run/react";
import { Button } from "antd";

function LoginButton() {
  //
  const navigate = useNavigate();
  const goLogin = () => {
    navigate("/login");
  };
  //
  return <Button onClick={goLogin}>Login</Button>;
}

export default LoginButton;
