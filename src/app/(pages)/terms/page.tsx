import type { Metadata } from "next";
import TermsContent from "./TermsContent";

const TITLE = "Terms & Conditions | Partiva";
const DESCRIPTION = "This page explains the terms of using the Partiva website and service.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/terms" },
  openGraph: { title: TITLE, description: DESCRIPTION },
};

export default function TermsPage() {
  return <TermsContent />;
}
