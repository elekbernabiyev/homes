"use client";
import { useState } from "react";
export default function Gallery({ photos, alt }: { photos: string[]; alt: string }) {
  const [i, setI] = useState(0);
  if (!photos.length) return null;
  return (
    <div>
      <div className="aspect-[16/10] overflow-hidden rounded-xl bg-slate-200"><img src={photos[i]} alt={alt} className="h-full w-full object-cover" /></div>
      <div className="mt-2 flex gap-2 overflow-x-auto">{photos.map((p, k) => (
        <button key={p} onClick={() => setI(k)} aria-label={`Şəkil ${k + 1}`} className={`h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 ${k === i ? "border-cta" : "border-transparent"}`}>
          <img src={p} alt="" className="h-full w-full object-cover" /></button>))}</div>
    </div>
  );
}
