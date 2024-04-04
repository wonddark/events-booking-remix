import { Link } from "@remix-run/react";

function HorizontalLogo() {
  return (
    <Link to="/" className="text-xl flex items-center hover:brightness-110">
      <span className="text-lg text-amber-50 rounded-full w-9 h-9 bg-amber-700 inline-flex justify-center items-center">
        EB
      </span>
      <span className="text-amber-600 ml-2.5 underline underline-offset-4">
        Events Booking
      </span>
    </Link>
  );
}

export default HorizontalLogo;
