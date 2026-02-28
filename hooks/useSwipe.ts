import { useEffect, useRef, type RefObject } from "react";

interface UseSwipeOptions {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  threshold?: number;
}

export function useSwipe(
  ref: RefObject<HTMLElement | null>,
  { onSwipeLeft, onSwipeRight, threshold = 50 }: UseSwipeOptions
) {
  const startX = useRef(0);
  const dragging = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("button, a, input, select, textarea")) return;
      dragging.current = true;
      startX.current = e.clientX;
      el.setPointerCapture(e.pointerId);
      el.style.cursor = "grabbing";
    };

    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      // Prevent vertical scroll while swiping horizontally
      const dx = Math.abs(e.clientX - startX.current);
      if (dx > 10) e.preventDefault();
    };

    const onUp = (e: PointerEvent) => {
      if (!dragging.current) return;
      dragging.current = false;
      el.style.cursor = "grab";
      const delta = e.clientX - startX.current;
      if (delta < -threshold) onSwipeLeft();
      else if (delta > threshold) onSwipeRight();
    };

    el.style.cursor = "grab";
    el.style.touchAction = "pan-y";
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);

    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.style.cursor = "";
      el.style.touchAction = "";
    };
  }, [ref, onSwipeLeft, onSwipeRight, threshold]);
}
