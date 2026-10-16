"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const GLYPHS = ["{", "}", "<", ">", "/", ";", "=", "0", "1", "*", "#", "λ", "()", "[]", "=>", "&&", "</>", "::", "$", "✳"];

/**
 * Signature Snowdox background: code glyphs drifting down like snow.
 * Depth-layered (size/speed/opacity), sways, and is pushed away by the
 * cursor. Pauses off-screen / in hidden tabs; static for reduced motion.
 */
export function CodeSnow({ className, density = 1, interactive = true }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const styles = getComputedStyle(document.documentElement);
    const fontFamily = styles.getPropertyValue("--font-mono").trim() || "ui-monospace, monospace";
    const brand = styles.getPropertyValue("--brand").trim() || "188 100% 52%";
    const brand2 = styles.getPropertyValue("--brand-2").trim() || "258 92% 67%";

    let width = 0;
    let height = 0;
    let particles = [];
    let raf = 0;
    let visible = true;
    let t = 0;
    const mouse = { x: -9999, y: -9999, active: false };

    const make = (randomY = true) => {
      const z = Math.random() ** 1.6 * 0.85 + 0.15; // more far-away flakes than near ones
      const roll = Math.random();
      return {
        x: Math.random() * width,
        y: randomY ? Math.random() * height : -30,
        z,
        vx: 0,
        vy: 0,
        glyph: GLYPHS[(Math.random() * GLYPHS.length) | 0],
        size: 8 + z * 15,
        speed: 0.18 + z * 0.75,
        phase: Math.random() * Math.PI * 2,
        sway: 0.25 + Math.random() * 0.6,
        color: roll < 0.2 ? brand : roll < 0.28 ? brand2 : "210 25% 97%",
        alpha: 0.08 + z * 0.45,
      };
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.min(160, Math.round(((width * height) / 11000) * density));
      if (particles.length > target) particles = particles.slice(0, target);
      while (particles.length < target) particles.push(make(true));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      if (mouse.active) {
        const glow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 220);
        glow.addColorStop(0, `hsl(${brand} / 0.10)`);
        glow.addColorStop(1, "transparent");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, width, height);
      }

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (const p of particles) {
        ctx.font = `${p.z > 0.7 ? 600 : 400} ${p.size}px ${fontFamily}`;
        ctx.fillStyle = `hsl(${p.color} / ${p.alpha})`;
        ctx.fillText(p.glyph, p.x, p.y);
      }
    };

    const step = () => {
      t += 0.012;
      for (const p of particles) {
        if (interactive && mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 130 && dist > 0.01) {
            const force = ((130 - dist) / 130) * 1.6 * p.z;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }
        p.vx *= 0.92;
        p.vy *= 0.92;
        p.x += Math.sin(t * p.sway * 2 + p.phase) * 0.35 * p.z + p.vx;
        p.y += p.speed + p.vy;

        if (p.y > height + 30 || p.x < -40 || p.x > width + 40) {
          Object.assign(p, make(false));
        }
      }
      draw();
      if (visible) raf = requestAnimationFrame(step);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      if (reduce) {
        draw();
        return;
      }
      if (visible && !document.hidden) raf = requestAnimationFrame(step);
    };

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = mouse.x >= 0 && mouse.y >= 0 && mouse.x <= rect.width && mouse.y <= rect.height;
    };
    const onLeave = () => {
      mouse.active = false;
    };
    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else start();
    };

    resize();
    start();

    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) draw();
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else cancelAnimationFrame(raf);
    });
    io.observe(canvas);

    if (interactive) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerleave", onLeave);
    }
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [density, interactive]);

  return <canvas ref={canvasRef} aria-hidden="true" className={cn("pointer-events-none absolute inset-0 h-full w-full", className)} />;
}
