// Fetches FAQ entries from the admin backend's public API. Always called
// from Server Components (never the browser), so this is not subject to CORS
// and the backend URL is never exposed to client-side code.
const BACKEND_URL = process.env.BACKEND_API_URL || "http://localhost:5000";

export interface BackendFaqItem {
  id: number;
  categoryAr: string;
  categoryEn: string | null;
  questionAr: string;
  questionEn: string | null;
  answerAr: string;
  answerEn: string | null;
  displayOrder: number;
}

interface ApiSuccess<T> {
  success: true;
  data: T;
}

export async function fetchFaqItems(): Promise<BackendFaqItem[]> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/faq`, { cache: "no-store" });
    const json = (await response.json().catch(() => null)) as ApiSuccess<BackendFaqItem[]> | null;
    if (!response.ok || !json?.success) return [];
    return json.data;
  } catch {
    return [];
  }
}
