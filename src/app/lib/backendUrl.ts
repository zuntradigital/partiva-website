// Single source of truth for the backend origin used by every SERVER-side
// call (root layout, middleware, pagesApi/contactApi/mediaApi/... and the
// media-URL resolver).
//
// Why this exists: each of those files used to read only BACKEND_API_URL and
// silently fall back to http://localhost:5000. Client components read
// NEXT_PUBLIC_API_URL / NEXT_PUBLIC_BACKEND_API_URL (inlined at BUILD time),
// so a deployment that set only the NEXT_PUBLIC_* pair worked in the browser
// but made every server-side fetch (Navbar link visibility, Footer contact
// info, Media-Library logos) hit localhost and fail -- and every one of those
// callers swallows the failure into an empty fallback, so it looked like
// "content missing". Reading the same variables in the same order everywhere
// removes that mismatch; the explicit runtime BACKEND_API_URL still wins.
const LOCAL_DEFAULT = "http://localhost:5000";

export const BACKEND_URL = (
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  LOCAL_DEFAULT
).replace(/\/+$/, "");

// A production server that is pointed at localhost can never work. Say so
// loudly in the server log instead of failing silently into empty content.
if (process.env.NODE_ENV === "production" && BACKEND_URL === LOCAL_DEFAULT && process.env.NEXT_PHASE !== "phase-production-build") {
  console.error(
    "[partiva-website] BACKEND_API_URL (or NEXT_PUBLIC_BACKEND_API_URL) is not set -- server-side content requests are going to http://localhost:5000 and will fail in production.",
  );
}
