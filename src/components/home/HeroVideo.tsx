"use client";

import { useEffect, useRef } from "react";

/**
 * Vidéo décorative du Hero. Un `<video autoplay>` télécharge son fichier dès le chargement, même
 * masqué en CSS (mesuré : 648 Ko sur mobile émulé) : la source n'est donc attribuée qu'une fois la
 * page chargée, à partir de 1024 px (là où le Hero affiche la voiture à droite) et sans
 * `prefers-reduced-motion`. Avant cela, ou si la lecture échoue, la vidéo reste transparente et la
 * photo du Hero (LCP) reste seule visible.
 */
export function HeroVideo({ src, className }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (!window.matchMedia("(min-width: 1024px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Une fois la lecture réellement lancée : fondu vers la vidéo (voir `.hero-media` dans globals.css).
    const onPlaying = () => video.setAttribute("data-playing", "");
    video.addEventListener("playing", onPlaying, { once: true });

    const start = () => {
      video.src = src;
      video.play().catch(() => {
        // Lecture refusée (économie de données, politique d'autoplay) : on garde la photo.
      });
    };
    let timer: number | undefined;
    const later = () => {
      timer = window.setTimeout(start, 300);
    };

    if (document.readyState === "complete") later();
    else window.addEventListener("load", later, { once: true });
    return () => {
      window.removeEventListener("load", later);
      window.clearTimeout(timer);
      video.removeEventListener("playing", onPlaying);
    };
  }, [src]);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
      disablePictureInPicture
      disableRemotePlayback
      className={className}
    />
  );
}
