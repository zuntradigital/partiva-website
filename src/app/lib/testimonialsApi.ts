// Fetches testimonials from the admin backend's public API. Mirrors
// contactApi.ts/pagesApi.ts so this data can be fetched server-side and
// passed down as a prop (kept live via LiveContentSync's router.refresh())
// instead of the section re-fetching it itself.
const BACKEND_URL = process.env.BACKEND_API_URL || "http://localhost:5000";

export interface BackendTestimonial {
  id: number;
  quoteAr: string;
  quoteEn: string | null;
  nameAr: string;
  nameEn: string | null;
  roleAr: string;
  roleEn: string | null;
  rating: number;
  imageSrc: string | null;
}

interface ApiSuccess<T> {
  success: true;
  data: T;
}

export async function fetchTestimonials(): Promise<BackendTestimonial[]> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/testimonials`, { cache: "no-store" });
    const json = (await response.json().catch(() => null)) as ApiSuccess<BackendTestimonial[]> | null;
    if (!response.ok || !json?.success) return [];
    return json.data;
  } catch {
    return [];
  }
}
