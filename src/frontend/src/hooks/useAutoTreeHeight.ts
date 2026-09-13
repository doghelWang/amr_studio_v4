import { useEffect, useRef, useState } from 'react';

/**
 * [FIX REQ-NF-04] AntD `Tree` virtualizes its rows via `rc-virtual-list` by default, but that
 * virtualization is only reliable when given an explicit numeric `height` — without one, the
 * container's real on-screen height is measured at whatever moment Tree happens to mount, and in
 * a flex/dynamic-height panel that moment can land before the surrounding layout has settled,
 * measuring 0/NaN. When that happens, rc-virtual-list computes row offsets against a bogus
 * viewport, so nodes past the first few end up positioned thousands of pixels off-screen and
 * become unclickable/unscrollable-to by normal mouse/keyboard use (only reachable via
 * `element.scrollIntoView()+click()` from devtools) — exactly the reported symptom.
 *
 * This hook measures the wrapping container with a ResizeObserver (re-measuring whenever the
 * panel is resized or re-laid-out, not just once at mount) and returns a stable, always-current
 * pixel height to pass as `<Tree height={h}>`, so the virtual list's viewport math is always based
 * on the container's real size. Per REQ-NF-04's fix direction, this keeps virtualization enabled
 * (required at 30+ node scale) rather than disabling it.
 */
export function useAutoTreeHeight<T extends HTMLElement = HTMLDivElement>(fallback = 320) {
  const containerRef = useRef<T | null>(null);
  const [height, setHeight] = useState<number>(fallback);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;

    const measure = () => {
      const h = el.clientHeight;
      if (h && h > 0) setHeight(h);
    };

    measure();
    const observer = new ResizeObserver(() => measure());
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { containerRef, height };
}
