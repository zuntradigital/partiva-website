import type { Metadata } from "next";
import HelpContent from "./HelpContent";

const TITLE = "Help center | Partiva";
const DESCRIPTION =
  "Your quick guide to Partiva's key answers and tools — and if you need more help, our support team is ready.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/help" },
  openGraph: { title: TITLE, description: DESCRIPTION },
};

export default function HelpPage() {
  return <HelpContent />;
}
