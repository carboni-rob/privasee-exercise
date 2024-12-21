import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import RecordForm from "@/components/RecordForm";

export default function Index() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  if (user) {
    return <RecordForm />;
  }

  return <Link href="/api/auth/login">Login</Link>;
}
