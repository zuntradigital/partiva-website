"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Dashboard-managed content that's server-rendered (root layout's contact
// info/nav/logo, FAQ, Articles) is always fetched fresh (no caching) but
// only re-runs on navigation. This re-triggers that same fetch when the
// Website tab regains focus, so a Dashboard edit shows up on an
// already-open tab without a manual reload. router.refresh() re-renders
// Server Components with fresh data only -- it never remounts client
// components, so in-progress form input elsewhere on the page is untouched.
export default function LiveContentSync() {
  const router = useRouter();

  useEffect(() => {
    function sync() {
      if (document.visibilityState === "visible") router.refresh();
    }
    window.addEventListener("focus", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      window.removeEventListener("focus", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [router]);

  return null;
}
