import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

function OnPageLoading() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <FontAwesomeIcon
        icon={faSpinner}
        spinPulse
        className="max-w-xs w-7/12 h-auto ms-auto me-auto text-primary-500"
      />
    </div>
  );
}

export default OnPageLoading;
