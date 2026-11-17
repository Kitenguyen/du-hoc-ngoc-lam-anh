"use client";

import { useEffect } from "react";

const TARGETS = ".block .head, .reveal, .course, .why, .teacher, .tile, .step, .dh-card, .testi, .unis > div";

/** Hiện dần các khối khi cuộn tới. Không có JS hoặc người dùng tắt chuyển động thì nội dung hiện bình thường. */
export function ScrollReveal() {
  useEffect(() => {
    const root = document.querySelector(".pg-home");
    if (!root || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const items = root.querySelectorAll<HTMLElement>(TARGETS);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.1 },
    );
    items.forEach((el) => {
      const sibs = el.parentElement ? Array.from(el.parentElement.children) : [];
      el.style.setProperty("--d", `${Math.min(Math.max(sibs.indexOf(el), 0), 6) * 80}ms`);
      io.observe(el);
    });
    root.classList.add("js-reveal");
    return () => io.disconnect();
  }, []);
  return null;
}
