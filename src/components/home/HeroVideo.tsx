"use client";

import { useEffect, useRef } from "react";

/** Durée maximale de mouvement automatique (seuil de WCAG 2.2.2). */
const MAX_PLAY_SECONDS = 5;

/**
 * Vidéo décorative du Hero. Un `<video autoplay>` télécharge son fichier dès le chargement, même
 * masqué en CSS (mesuré : 648 Ko sur mobile émulé) : la source n'est donc attribuée qu'une fois la
 * page chargée, à partir de 1024 px (là où le Hero affiche la voiture à droite) et sans
 * `prefers-reduced-motion`. Avant cela, ou si la lecture échoue, la vidéo reste transparente et la
 * photo du Hero (LCP) reste seule visible.
 *
 * WCAG 2.2.2 (pause, arrêt, masquage) : un mouvement qui démarre seul et dure plus de 5 secondes doit
 * pouvoir être arrêté. La vidéo ne joue donc qu'une fois, sans boucle, et s'arrête d'elle-même après
 * 5 secondes sur son image courante : aucun mouvement automatique ne dépasse cette limite, sans bouton.
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

    const stopAfterLimit = () => {
      if (video.currentTime >= MAX_PLAY_SECONDS - 0.2) {
        video.pause();
        video.removeEventListener("timeupdate", stopAfterLimit);
      }
    };
    video.addEventListener("timeupdate", stopAfterLimit);

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
      video.removeEventListener("timeupdate", stopAfterLimit);
    };
  }, [src]);

  return (
    <video
      ref={ref}
      muted
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
