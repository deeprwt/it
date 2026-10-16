import { notFound } from "next/navigation";

/** Unknown /admin/* URLs render the dashboard 404 inside the shell. */
export default function MissingAdminPage() {
  notFound();
}
