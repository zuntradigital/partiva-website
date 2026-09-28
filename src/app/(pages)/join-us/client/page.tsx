import type { Metadata } from "next";
import JoinFormContent from "@/src/components/JoinForm/JoinFormContent";

const TITLE = "Join Partiva as a Client | Partiva";
const DESCRIPTION = "Tell us about yourself and our team will review your application and reach out to complete your onboarding to the Partiva network.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/join-us/client" },
  openGraph: { title: TITLE, description: DESCRIPTION },
};

export default function JoinAsClientPage() {
  return <JoinFormContent kind="CLIENT" />;
}
