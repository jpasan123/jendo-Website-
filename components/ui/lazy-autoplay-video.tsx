'use client';

import { useEffect, useRef } from 'react';

type LazyAutoplayVideoProps = {
  src: string;
  poster?: string;
  className?: string;
  /** When the section enters view — start playback */
  playThreshold?: number;
  /** Start buffering this far before the section is visible */
  preloadMargin?: string;
};

export function LazyAutoplayVideo({
  src,
  poster,
  className = '',
  playThreshold = 0.25,
  preloadMargin = '480px 0px',
}: LazyAutoplayVideoProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const video = videoRef.current;
    if (!wrap || !video) return;

    let loading = false;

    const startLoad = () => {
      if (loading || video.readyState > 0) return;
      loading = true;
      video.preload = 'auto';
      video.load();
    };

    const playWhenReady = () => {
      if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
        void video.play().catch(() => {});
        return;
      }
      const onReady = () => {
        video.removeEventListener('canplay', onReady);
        void video.play().catch(() => {});
      };
      video.addEventListener('canplay', onReady);
    };

    const preloadObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) startLoad();
      },
      { threshold: 0, rootMargin: preloadMargin },
    );

    const playObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startLoad();
          playWhenReady();
        } else {
          video.pause();
        }
      },
      { threshold: playThreshold, rootMargin: '0px' },
    );

    preloadObserver.observe(wrap);
    playObserver.observe(wrap);

    return () => {
      preloadObserver.disconnect();
      playObserver.disconnect();
    };
  }, [playThreshold, preloadMargin, src]);

  return (
    <div ref={wrapRef} className="contents">
      <video
        ref={videoRef}
        className={className}
        src={src}
        poster={poster}
        playsInline
        muted
        loop
        preload="none"
        disablePictureInPicture
        controlsList="nodownload noremoteplayback"
        onContextMenu={(e) => e.preventDefault()}
      />
    </div>
  );
}
