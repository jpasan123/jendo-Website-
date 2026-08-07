'use client';

import { useLayoutEffect, useRef, type RefObject } from 'react';

type LazyAutoplayVideoProps = {
  src: string;
  poster?: string;
  className?: string;
  playThreshold?: number;
  preloadMargin?: string;
  /** Observe a parent section for visibility (more reliable on scroll) */
  observeRef?: RefObject<Element | null>;
};

export function LazyAutoplayVideo({
  src,
  poster,
  className = '',
  playThreshold = 0.15,
  preloadMargin = '500px 0px',
  observeRef,
}: LazyAutoplayVideoProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    if (!root || !video) return;

    const ensureLoaded = () => {
      if (video.readyState >= HTMLMediaElement.HAVE_METADATA) return;
      video.preload = 'auto';
      video.load();
    };

    const play = () => {
      video.muted = true;
      video.defaultMuted = true;

      const run = () => {
        void video.play().catch(() => {});
      };

      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        run();
        return;
      }

      ensureLoaded();
      video.addEventListener('canplay', run, { once: true });
    };

    const target = observeRef?.current ?? root;

    const preloadObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) ensureLoaded();
      },
      { threshold: 0, rootMargin: preloadMargin },
    );

    const playObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) play();
        else video.pause();
      },
      { threshold: playThreshold, rootMargin: '0px' },
    );

    preloadObserver.observe(target);
    playObserver.observe(target);

    // Handle refresh / restored scroll position when section is already on screen.
    const raf = requestAnimationFrame(() => {
      const rect = target.getBoundingClientRect();
      const visible = rect.top < window.innerHeight * 0.85 && rect.bottom > window.innerHeight * 0.15;
      if (visible) {
        ensureLoaded();
        play();
      }
    });

    return () => {
      cancelAnimationFrame(raf);
      preloadObserver.disconnect();
      playObserver.disconnect();
    };
  }, [src, playThreshold, preloadMargin, observeRef]);

  return (
    <div ref={rootRef} className="w-full">
      <video
        ref={videoRef}
        className={className}
        src={src}
        poster={poster}
        playsInline
        muted
        defaultMuted
        loop
        preload="metadata"
        disablePictureInPicture
        controlsList="nodownload noremoteplayback"
        onContextMenu={(e) => e.preventDefault()}
      />
    </div>
  );
}
