import { LoginForm } from "@/components/admin/auth/LoginForm";

export const metadata = { title: "Sign in" };

function safeNext(value) {
  const next = Array.isArray(value) ? value[0] : value;
  return typeof next === "string" && next.startsWith("/admin") && !next.startsWith("//") && !next.startsWith("/admin/login")
    ? next
    : "/admin";
}

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  const error = Array.isArray(params?.error) ? params.error[0] : params?.error;
  return <LoginForm next={safeNext(params?.next)} initialError={error === "link" ? "link" : undefined} />;
}
