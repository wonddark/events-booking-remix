import { Link } from "@remix-run/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";

function LoginButton() {
  return (
    <Link
      to="/login"
      className="flex items-center justify-start gap-2 h-8"
      role="button"
    >
      <FontAwesomeIcon icon={faArrowRightToBracket} />
      <span>Login</span>
    </Link>
  );
}

export default LoginButton;
