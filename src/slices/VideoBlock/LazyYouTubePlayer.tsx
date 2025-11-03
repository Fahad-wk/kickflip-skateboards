"use client";

import { KeyTextField } from "@prismicio/client";
import { useEffect, useRef, useState } from "react";

type VideoProps = {
  youTubeID: KeyTextField;
};

export function LazyYouTubePlayer({ youTubeID }: VideoProps) {
  const videoId =
    typeof youTubeID === "string" && youTubeID.trim().length > 0
      ? youTubeID
      : undefined;

  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // ✅ Hooks always run — not conditionally
  useEffect(() => {
    const element = containerRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect(); // ✅ Avoid unnecessary calls
        }
      },
      {
        threshold: 0.01,
        rootMargin: "1200px",
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const embedUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&start=26`
    : null;

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden"
    >
      {/* ✅ Conditional rendering — NOT conditional hook */}
      {isInView && embedUrl && (
        <iframe
          src={embedUrl}
          title="Kickflip Skateboards Video"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="pointer-events-none absolute left-1/2 top-1/2 h-[140%] w-[140%] -translate-x-1/2 -translate-y-1/2 scale-125 object-cover"
          style={{ border: "none" }}
        />
      )}
    </div>
  );
}
