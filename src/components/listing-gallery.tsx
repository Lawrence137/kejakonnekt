"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, House, Images, X } from "lucide-react";

type Img = { url: string; thumbUrl: string | null };

const tile =
  "relative overflow-hidden rounded-2xl bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring";
const cover = "h-full w-full object-cover transition duration-300 hover:scale-105";

export function ListingGallery({
  images,
  title,
}: {
  images: Img[];
  title: string;
}) {
  const [open, setOpen] = useState<number | null>(null);
  const [active, setActive] = useState(0);
  const scroller = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(null), []);
  const n = images.length;

  if (n === 0) {
    return (
      <div className="flex aspect-[16/9] items-center justify-center rounded-2xl bg-gradient-to-br from-secondary to-accent text-primary/30">
        <House className="size-20" />
      </div>
    );
  }

  const alt = (i: number) => `${title} - photo ${i + 1}`;

  return (
    <>
      {/* Phones: swipeable carousel */}
      <div className="relative sm:hidden">
        <div
          ref={scroller}
          onScroll={(e) => {
            const el = e.currentTarget;
            setActive(Math.round(el.scrollLeft / el.clientWidth));
          }}
          className="flex snap-x snap-mandatory overflow-x-auto rounded-2xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((img, i) => (
            <button
              key={img.url}
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`Open photo ${i + 1} of ${n}`}
              className="aspect-[4/3] w-full shrink-0 snap-center bg-secondary"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={alt(i)}
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
                draggable={false}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
        {n > 1 && (
          <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white">
            {Math.min(active + 1, n)} / {n}
          </span>
        )}
      </div>

      {/* Larger screens: grid */}
      <div className="hidden sm:block">
        {n === 1 && (
          <button
            type="button"
            onClick={() => setOpen(0)}
            className={`${tile} aspect-[16/9] w-full`}
            aria-label="Open photo"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images[0].url} alt={alt(0)} className={cover} />
          </button>
        )}

        {n === 2 && (
          <div className="grid grid-cols-2 gap-2">
            {images.map((img, i) => (
              <button
                key={img.url}
                type="button"
                onClick={() => setOpen(i)}
                className={`${tile} aspect-[4/3]`}
                aria-label={`Open photo ${i + 1}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={alt(i)} className={cover} />
              </button>
            ))}
          </div>
        )}

        {n >= 3 && (
          <div className="grid aspect-[16/9] grid-cols-3 grid-rows-2 gap-2">
            <button
              type="button"
              onClick={() => setOpen(0)}
              className={`${tile} col-span-2 row-span-2`}
              aria-label="Open photo 1"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={images[0].url} alt={alt(0)} className={cover} />
              <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
                <Images className="size-4" /> {n} photos
              </span>
            </button>

            {[1, 2].map((i) => (
              <button
                key={images[i].url}
                type="button"
                onClick={() => setOpen(i)}
                className={tile}
                aria-label={`Open photo ${i + 1}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={images[i].thumbUrl ?? images[i].url}
                  alt={alt(i)}
                  className={cover}
                />
                {i === 2 && n > 3 && (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-lg font-semibold text-white">
                    +{n - 3} more
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {open !== null && (
        <Lightbox images={images} title={title} start={open} onClose={close} />
      )}
    </>
  );
}

function Lightbox({
  images,
  title,
  start,
  onClose,
}: {
  images: Img[];
  title: string;
  start: number;
  onClose: () => void;
}) {
  const n = images.length;
  const [i, setI] = useState(start);
  const touchX = useRef<number | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  const go = useCallback((d: number) => setI((c) => (c + d + n) % n), [n]);

  // Keyboard controls and page scroll lock
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [go, onClose]);

  useEffect(() => {
    closeBtn.current?.focus();
  }, []);

  // Preload the next and previous photos so swiping feels instant
  useEffect(() => {
    for (const d of [1, -1]) {
      const img = new Image();
      img.src = images[(i + d + n) % n].url;
    }
  }, [i, images, n]);

  // Keep the active thumbnail in view
  useEffect(() => {
    document
      .getElementById(`lb-thumb-${i}`)
      ?.scrollIntoView({ inline: "center", block: "nearest" });
  }, [i]);

  const stop = (e: React.SyntheticEvent) => e.stopPropagation();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} photos`}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex flex-col bg-black/95 text-white"
    >
      <div className="flex items-center justify-between p-4" onClick={stop}>
        <span className="text-sm">
          {i + 1} / {n}
        </span>
        <button
          ref={closeBtn}
          type="button"
          onClick={onClose}
          aria-label="Close photos"
          className="rounded-full bg-white/10 p-2 hover:bg-white/20"
        >
          <X className="size-5" />
        </button>
      </div>

      <div
        className="relative flex flex-1 touch-pan-y items-center justify-center px-2"
        onTouchStart={(e) => {
          touchX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          touchX.current = null;
          if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={images[i].url}
          src={images[i].url}
          alt={`${title} - photo ${i + 1}`}
          onClick={stop}
          draggable={false}
          className="max-h-[calc(100dvh-11rem)] max-w-full object-contain"
        />
        {n > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={(e) => {
                stop(e);
                go(-1);
              }}
              className="absolute left-2 rounded-full bg-white/10 p-3 hover:bg-white/20"
            >
              <ChevronLeft className="size-6" />
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={(e) => {
                stop(e);
                go(1);
              }}
              className="absolute right-2 rounded-full bg-white/10 p-3 hover:bg-white/20"
            >
              <ChevronRight className="size-6" />
            </button>
          </>
        )}
      </div>

      {n > 1 && (
        <div className="flex gap-2 overflow-x-auto p-4" onClick={stop}>
          {images.map((img, idx) => (
            <button
              key={img.url}
              id={`lb-thumb-${idx}`}
              type="button"
              onClick={() => setI(idx)}
              aria-label={`Show photo ${idx + 1}`}
              className={`h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                idx === i ? "border-white" : "border-transparent opacity-60"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.thumbUrl ?? img.url}
                alt=""
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}