import type { Metadata } from "next";
import RegisterContent from "./RegisterContent";

const TITLE = "Register your business | Partiva";
const DESCRIPTION =
  "Register your business with Partiva. Enter your details and our team will review your request before your account is activated.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/register" },
  openGraph: { title: TITLE, description: DESCRIPTION },
};

export default function RegisterPage() {
  return <RegisterContent />;
}
