import Button from "~/components/Button";
import { useNavigate } from "@remix-run/react";

function LoginButton() {
  //
  const navigate = useNavigate();
  const goLogin = () => {
    navigate("/login");
  };
  //
  return <Button label="Login" type="button" onClick={goLogin} />;
}

export default LoginButton;
