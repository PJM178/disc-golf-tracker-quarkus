import { useEffect, useRef } from "react";

interface UseInfiniteScrollOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  enabled?: boolean;
  onIntersect: () => void; 
}

const useInfiniteScroll = <T extends HTMLElement>({
  root = null,
  rootMargin = "100px",
  threshold = 1.0,
  enabled = false,
  onIntersect,
}: UseInfiniteScrollOptions) => {
  const observerRef = useRef<T | null>(null);
  
  useEffect(() => {
    if (!enabled) return;
    const target = observerRef.current;
    console.log(target);
    console.log(root);
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          console.log(entry);
          onIntersect();
        }
      },
      { root, rootMargin, threshold }
    );

    observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [root, rootMargin, threshold, enabled, onIntersect]);

  return { observerRef };
};

export default useInfiniteScroll;