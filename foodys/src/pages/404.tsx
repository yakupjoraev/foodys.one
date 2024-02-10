import Link from "next/link";

export default function NotFound() {
  return (
    <div className="not-found">
      <div className="not-found__inner">
        <div className="not-found__sum">404</div>
        <p className="not-found__text">Page no found</p>

        <Link className="not-found__link" href="/">GO TO HOME PAGE</Link>
      </div>

    </div>
  );
}
