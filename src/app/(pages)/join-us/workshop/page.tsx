import type { Metadata } from "next";
import JoinFormContent from "@/src/components/JoinForm/JoinFormContent";

const TITLE = "Join Partiva as a Workshop Owner | Partiva";
const DESCRIPTION = "Tell us about your workshop and our team will review your application and reach out to complete your onboarding to the Partiva network.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/join-us/workshop" },
  openGraph: { title: TITLE, description: DESCRIPTION },
};

export default function JoinAsWorkshopPage() {
  return <JoinFormContent kind="WORKSHOP" />;
}
