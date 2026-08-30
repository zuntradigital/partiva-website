import type { Metadata } from "next";
import ContactContent from "./ContactContent";

const TITLE = "Contact us | Partiva";
const DESCRIPTION =
  "Have a question about the platform, pricing, or partnering with us? Fill out the form or reach us directly and our team will respond as soon as possible.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/contact" },
  openGraph: { title: TITLE, description: DESCRIPTION },
};

export default function ContactPage() {
  return <ContactContent />;
}
