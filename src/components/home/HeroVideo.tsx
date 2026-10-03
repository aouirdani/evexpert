"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";

/**
 * Vidéo décorative du Hero, en boucle, avec un bouton pause / lecture.
 *
 * Chargement : un `<video autoplay>` télécharge son fichier dès le chargement, même masqué en CSS
 * (mesuré : 648 Ko sur mobile émulé). La source n'est donc attribuée qu'une fois la page chargée, à
 * partir de 1024 px (là où le Hero affiche la voiture à droite) et sans `prefers-reduced-motion`.
 * Avant cela, ou si la lecture échoue, la vidéo reste transparente et la photo du Hero (LCP) reste
 * seule visible ; le bouton n'apparaît que quand la vidéo joue réellement. Rien ne change sur mobile
 * ni en mouvement réduit : ni vidéo, ni bouton.
 *
 * WCAG 2.2.2 (pause, arrêt, masquage) : un mouvement qui démarre seul et dure plus de 5 secondes doit
 * pouvoir être arrêté. La boucle est donc toujours accompagnée d'un bouton natif, atteignable au
 * clavier, dont le libellé visible est aussi le nom accessible (WCAG 2.5.3).
 */
export function HeroVideo({
  src,
  videoClassName,
  maskStyle,
}: {
  src: string;
  /** Classes de la balise <video>. */
  videoClassName?: string;
  /** Fondu technique des bords (même masque que la photo), appliqué à la vidéo seule, pas au bouton. */
  maskStyle?: CSSProperties;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (!window.matchMedia("(min-width: 1024px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Une fois la lecture réellement lancée : fondu vers la vidéo (voir `.hero-media` dans globals.css).
    const onPlaying = () => {
      video.setAttribute("data-playing", "");
      setStarted(true);
    };
    video.addEventListener("playing", onPlaying, { once: true });
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);

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
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, [src]);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) void video.play().catch(() => undefined);
    else video.pause();
  };

  return (
    <>
      <div className="hero-video absolute inset-0 hidden lg:block" style={maskStyle}>
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
          className={videoClassName}
        />
      </div>
      {started && (
        <button
          type="button"
          onClick={toggle}
          className="hero-video-control pointer-events-auto absolute bottom-3 right-3 z-20 hidden min-h-11 items-center gap-2 rounded-md border border-line-ink bg-ink-raised px-3.5 text-sm font-semibold text-paper transition-colors hover:border-paper lg:inline-flex"
        >
          {playing ? <Pause className="h-4 w-4" aria-hidden /> : <Play className="h-4 w-4" aria-hidden />}
          {playing ? "Mettre en pause l'animation" : "Lire l'animation"}
        </button>
      )}
    </>
  );
}
