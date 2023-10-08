import Link from "next/link";

export default function NotFound() {
  return (
    <p>
      Not found <br />
      <Link href="/">Go home</Link>
    </p>
  );
}
