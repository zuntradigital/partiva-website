import type { Metadata } from "next";
import PrivacyContent from "./PrivacyContent";

const TITLE = "Privacy Policy | Partiva";
const DESCRIPTION = "This page explains what information Partiva collects through this website, and how it is used.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/privacy" },
  openGraph: { title: TITLE, description: DESCRIPTION },
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
