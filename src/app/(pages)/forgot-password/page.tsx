import type { Metadata } from "next";
import ForgotPasswordContent from "./ForgotPasswordContent";

const TITLE = "Forgot your password? | Partiva";
const DESCRIPTION =
  "Enter the email address linked to your account and we'll send you a link to reset your password.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/forgot-password" },
  openGraph: { title: TITLE, description: DESCRIPTION },
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordContent />;
}
