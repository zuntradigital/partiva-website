import type { Metadata } from "next";
import LoginContent from "./LoginContent";

const TITLE = "Log in | Partiva";
const DESCRIPTION = "Sign in to your Partiva account to manage your business.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/login" },
  openGraph: { title: TITLE, description: DESCRIPTION },
};

export default function LoginPage() {
  return <LoginContent />;
}
