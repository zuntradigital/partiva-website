import Image from "next/image";

/** Small brand mark stamped on every article cover image. Reuses the site's existing logo asset. */
export default function CoverWatermark({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/images/logo.png"
      alt=""
      width={160}
      height={107}
      aria-hidden="true"
      className={`pointer-events-none select-none object-contain opacity-80 drop-shadow-[0_1px_4px_rgba(0,0,0,0.45)] ${className}`}
    />
  );
}
