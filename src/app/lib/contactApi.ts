// Fetches contact info from the admin backend's public API. Called from a
// Server Component (the root layout), so this is not subject to CORS and
// the backend URL is never exposed to client-side code.
import { BACKEND_URL } from "@/src/app/lib/backendUrl";

export interface ContactSocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface BackendContactInfo {
  whatsappNumber: string | null;
  whatsappLink: string | null;
  websiteUrl: string | null;
  email: string | null;
  addressAr: string | null;
  addressEn: string | null;
  locationAr: string | null;
  locationEn: string | null;
  social: ContactSocialLink[];
}

const EMPTY_CONTACT: BackendContactInfo = {
  whatsappNumber: null, whatsappLink: null, websiteUrl: null, email: null,
  addressAr: null, addressEn: null, locationAr: null, locationEn: null, social: [],
};

interface ApiSuccess<T> {
  success: true;
  data: T;
}

export async function fetchContactInfo(): Promise<BackendContactInfo> {
  try {
    // Short revalidation window instead of no-store (mirrors pagesApi.ts) --
    // this is fetched on every request from the root layout; caching it
    // briefly cuts redundant backend calls while still picking up Dashboard
    // contact-info changes within half a minute.
    const response = await fetch(`${BACKEND_URL}/api/contact`, { next: { revalidate: 30 } });
    const json = (await response.json().catch(() => null)) as ApiSuccess<BackendContactInfo> | null;
    if (!response.ok || !json?.success) return EMPTY_CONTACT;
    return json.data;
  } catch {
    return EMPTY_CONTACT;
  }
}
