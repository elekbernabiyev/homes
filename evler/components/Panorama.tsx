"use client";
import { useEffect, useRef, useState } from "react";
declare global { interface Window { pannellum: any } }
const V = "2.5.6";
function load() {
  return new Promise<void>((res) => {
    if (window.pannellum) return res();
    if (!document.getElementById("pnl-css")) {
      const l = document.createElement("link"); l.id = "pnl-css"; l.rel = "stylesheet";
      l.href = `https://cdn.jsdelivr.net/npm/pannellum@${V}/build/pannellum.css`; document.head.appendChild(l);
    }
    const s = document.createElement("script"); s.src = `https://cdn.jsdelivr.net/npm/pannellum@${V}/build/pannellum.js`;
    s.onload = () => res(); document.body.appendChild(s);
  });
}
export default function Panorama({ urls }: { urls: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  useEffect(() => {
    let dead = false; let v: any;
    load().then(() => {
      if (dead || !ref.current) return;
      v = window.pannellum.viewer(ref.current, { type: "equirectangular", panorama: urls[i], autoLoad: true, showControls: true, compass: false, hfov: 100 });
    });
    return () => { dead = true; v?.destroy(); };
  }, [i, urls]);
  return (
    <section className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
      <h2 className="mb-3 text-xl font-extrabold">360° virtual tur</h2>
      <div ref={ref} className="h-[320px] w-full overflow-hidden rounded-lg bg-slate-900 sm:h-[480px]" />
      {urls.length > 1 && <div className="mt-3 flex gap-2">{urls.map((_, k) => (
        <button key={k} onClick={() => setI(k)} className={`rounded-lg px-3 py-1.5 text-sm font-bold ${k === i ? "bg-cta text-white" : "bg-mist"}`}>Otaq {k + 1}</button>))}</div>}
      <p className="mt-2 text-xs text-slate-500">Şəkli sürüşdürərək ətrafa baxın, təkərlə yaxınlaşdırın.</p>
    </section>
  );
}
