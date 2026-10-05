"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export type SliderImage = {
  src: string;
  alt: string;
  fit?: "cover" | "contain";
  position?: string;
};

type ImageSliderProps = {
  images: SliderImage[];
  intervalMs?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

/** Auto-sliding cross-fade gallery. Fills its parent, which must be `relative` and sized. */
export default function ImageSlider({
  images,
  intervalMs = 4000,
  sizes = "100vw",
  priority = false,
  className = "",
}: ImageSliderProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (images.length < 2 || paused) return;
    const id = setInterval(() => setActive((i) => (i + 1) % images.length), intervalMs);
    return () => clearInterval(id);
  }, [images.length, intervalMs, paused]);

  return (
    <div
      className={`absolute inset-0 ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {images.map((img, i) => (
        <Image
          key={img.src}
          src={img.src}
          alt={img.alt}
          fill
          sizes={sizes}
          quality={90}
          priority={priority && i === 0}
          className={`transition-opacity duration-700 ${
            img.fit === "cover" ? "object-cover" : "object-contain"
          } ${i === active ? "opacity-100" : "opacity-0"}`}
          style={img.position ? { objectPosition: img.position } : undefined}
          aria-hidden={i !== active}
        />
      ))}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-10">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              aria-label={`Show image ${i + 1}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActive(i);
              }}
              className={`h-2 rounded-full transition-all ${
                i === active ? "w-6 bg-[#893A9F]" : "w-2 bg-[#893A9F]/30"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
