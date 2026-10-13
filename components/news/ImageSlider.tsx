"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export type SliderImage = {
  src: string;
  alt: string;
  /** "blur" shows the whole picture (contain) over a blurred copy of itself, ideal for portrait images. */
  fit?: "cover" | "contain" | "blur";
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
  intervalMs = 6500,
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
        <div
          key={img.src}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={i !== active}
        >
          {img.fit === "blur" && (
            <Image
              src={img.src}
              alt=""
              fill
              sizes="(max-width:768px) 50vw, 400px"
              quality={40}
              className="object-cover scale-125 blur-2xl opacity-70"
              aria-hidden
            />
          )}
          <Image
            src={img.src}
            alt={img.alt}
            fill
            sizes={sizes}
            quality={90}
            priority={priority && i === 0}
            className={img.fit === "cover" ? "object-cover" : "object-contain"}
            style={img.position ? { objectPosition: img.position } : undefined}
          />
        </div>
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
                i === active ? "w-6 bg-[#893A9F] ring-1 ring-white/70" : "w-2 bg-[#893A9F]/40 ring-1 ring-white/60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
