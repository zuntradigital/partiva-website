import type { Metadata } from "next";
import SupportContent from "./SupportContent";

const TITLE = "Technical support | Partiva";
const DESCRIPTION = "Choose the best way to reach our support team, or browse the Help Center for quick answers.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/support" },
  openGraph: { title: TITLE, description: DESCRIPTION },
};

export default function SupportPage() {
  return <SupportContent />;
}
