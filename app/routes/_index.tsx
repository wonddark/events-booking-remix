import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div>
      <h1>Hello to EventsBooking</h1>
      <ul>
        <li>
          <Link to="/events">Events</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/register">Register</Link>
        </li>
      </ul>
    </div>
  );
}
