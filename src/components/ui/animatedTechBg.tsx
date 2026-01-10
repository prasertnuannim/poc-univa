/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
const OEE = 0.82; // 72%
function getOeeTheme(value: number) {
  if (value < 60) {
    return {
      stroke: "rgba(239,68,68,.95)", // red
      glow: "rgba(239,68,68,.45)",
      text: "text-red-600",
      label: "CRITICAL",
    };
  }

  if (value < 75) {
    return {
      stroke: "rgba(234,179,8,.95)", // yellow
      glow: "rgba(234,179,8,.45)",
      text: "text-yellow-600",
      label: "WARNING",
    };
  }

  return {
    stroke: "rgba(16,185,129,.95)", // green
    glow: "rgba(16,185,129,.45)",
    text: "text-emerald-600",
    label: "GOOD",
  };
}
function useCountUp(target: number, trigger: number) {
  const targetPct = Math.round(target * 100);
  const [value, setValue] = useState(1);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    setValue(1);

    const from = 1;
    const to = targetPct;
    const duration = 900;
    const start = performance.now();

    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setValue(Math.floor(from + (to - from) * p));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [trigger, targetPct]);

  return value;
}
const circumference = (r: number) => 2 * Math.PI * r;

function OeeDonut({ value }: { value: number }) {
  const r = 90;
  const c = circumference(r);
  const theme = getOeeTheme(value);

  return (
    <div className="relative w-[360px] h-[360px]">
      <svg viewBox="0 0 200 200" className="absolute inset-0">
        {/* track */}
        <circle
          cx="100"
          cy="100"
          r={r}
          stroke="rgba(148,163,184,.25)"
          strokeWidth="18"
          fill="none"
        />

        {/* progress */}
        <motion.circle
          cx="100"
          cy="100"
          r={r}
          stroke={theme.stroke}
          strokeWidth="18"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - value / 100)}
          transform="rotate(-90 100 100)"
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </svg>

      {/* center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[11px] tracking-[0.35em] text-slate-500">
          OEE · {theme.label}
        </span>
        <span className={`text-6xl font-semibold tabular-nums ${theme.text}`}>
          {value}%
        </span>
      </div>
    </div>
  );
}
export function AnimatedTechBg({ success = false }: { success?: boolean }) {
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    if (success) setTrigger((t) => t + 1);
  }, [success]);

  const oeeNumber = useCountUp(OEE, trigger);
  const theme = getOeeTheme(oeeNumber);

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* soft bg */}
      <div className="absolute inset-0 bg-linear-to-br from-gray-100 via-gray-200 to-gray-500" />
      <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]" />

      {/* HERO DONUT */}
      <div
        className="absolute"
        style={{
          left: "50%",
          top: "32%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {/* glow */}
        <motion.div
          className="absolute inset-0 -z-10"
          animate={{
            opacity: success ? [0.6, 0.9, 0.6] : [0.25, 0.4, 0.25],
            scale: success ? [1.05, 1.1, 1.05] : [1, 1.03, 1],
          }}
          transition={{
            duration: success ? 5 : 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            width: 420,
            height: 420,
            borderRadius: 9999,
            background: `radial-gradient(circle, ${theme.glow} 0%, rgba(255,255,255,0) 70%)`,
            filter: "blur(6px)",
          }}
        />
        <motion.div
          animate={success ? { scale: 1.04, opacity: 0.95 } : { opacity: 0.45 }}
          transition={{ duration: 0.6 }}
        >
          <OeeDonut value={oeeNumber} />
        </motion.div>
      </div>
    </div>
  );
}
