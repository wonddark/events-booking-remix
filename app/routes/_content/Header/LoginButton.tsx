import { useNavigate } from "@remix-run/react";
import { Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";

function LoginButton() {
  //
  const navigate = useNavigate();
  const goLogin = () => {
    navigate("/login");
  };
  //
  return (
    <Button
      onClick={goLogin}
      icon={<FontAwesomeIcon icon={faArrowRightToBracket} />}
    >
      Login
    </Button>
  );
}

export default LoginButton;
