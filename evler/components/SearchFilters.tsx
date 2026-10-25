"use client";
import { useState } from "react";
import { CATEGORIES, CITIES, DISTRICTS, EMPTY_FILTERS, FEATURES, Filters, METROS, TYPES } from "@/lib/constants";

const Sel = ({ label, value, onChange, options, ph }: { label: string; value: string; onChange: (v: string) => void; options: string[]; ph: string }) => (
  <div><label className="label">{label}</label>
    <select className="input" value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">{ph}</option>{options.map((o) => <option key={o}>{o}</option>)}
    </select></div>
);
const Range = ({ label, a, b, onA, onB }: { label: string; a: string; b: string; onA: (v: string) => void; onB: (v: string) => void }) => (
  <div><label className="label">{label}</label>
    <div className="flex gap-2">
      <input className="input" type="number" min={0} placeholder="Min" value={a} onChange={(e) => onA(e.target.value)} />
      <input className="input" type="number" min={0} placeholder="Maks" value={b} onChange={(e) => onB(e.target.value)} />
    </div></div>
);

export default function SearchFilters({ value, onChange }: { value: Filters; onChange: (f: Filters) => void }) {
  const [open, setOpen] = useState(false);
  const set = (k: keyof Filters) => (v: string) => onChange({ ...value, [k]: v });
  const toggleFeature = (f: string) =>
    onChange({ ...value, features: value.features.includes(f) ? value.features.filter((x) => x !== f) : [...value.features, f] });

  return (
    <section className="-mt-6 rounded-2xl bg-white p-4 shadow-lg ring-1 ring-slate-200" aria-label="Axtarış">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <Sel label="Kateqoriya" value={value.category} onChange={set("category")} options={CATEGORIES} ph="Hamısı" />
        <Sel label="Əmlak növü" value={value.type} onChange={set("type")} options={TYPES} ph="Hamısı" />
        <Sel label="Şəhər" value={value.city} onChange={set("city")} options={CITIES} ph="Hamısı" />
        <div className="col-span-2 md:col-span-1"><Range label="Qiymət (AZN)" a={value.priceMin} b={value.priceMax} onA={set("priceMin")} onB={set("priceMax")} /></div>
        <button type="button" onClick={() => setOpen(!open)} aria-expanded={open}
          className="col-span-2 mt-5 rounded-lg border-2 border-brand px-4 py-2 text-sm font-bold text-brand hover:bg-brand hover:text-white md:col-span-1">
          {open ? "Ətraflı axtarışı bağla ▲" : "Ətraflı axtarış ▼"}
        </button>
      </div>

      <div className={`grid transition-all duration-300 ${open ? "mt-4 grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <div className="grid grid-cols-2 gap-3 border-t pt-4 md:grid-cols-4">
            <Sel label="Rayon" value={value.district} onChange={set("district")} options={DISTRICTS} ph="Hamısı" />
            <Sel label="Metro stansiyası" value={value.metro} onChange={set("metro")} options={METROS} ph="Hamısı" />
            <div><label className="label">Qəsəbə / Massiv</label>
              <input className="input" placeholder="Məs: Əhmədli" value={value.settlement} onChange={(e) => set("settlement")(e.target.value)} /></div>
            <Sel label="Otaq sayı" value={value.rooms} onChange={set("rooms")} options={["1", "2", "3", "4", "5"]} ph="Hamısı" />
            <Range label="Sahə (m²)" a={value.areaMin} b={value.areaMax} onA={set("areaMin")} onB={set("areaMax")} />
            <Range label="Mərtəbə" a={value.floorMin} b={value.floorMax} onA={set("floorMin")} onB={set("floorMax")} />
            <Range label="Binanın mərtəbə sayı" a={value.totalMin} b={value.totalMax} onA={set("totalMin")} onB={set("totalMax")} />
          </div>
          <fieldset className="mt-4">
            <legend className="label">Əlavə imkanlar</legend>
            <div className="flex flex-wrap gap-2">
              {FEATURES.map((f) => (
                <label key={f} className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm font-medium ${value.features.includes(f) ? "border-brand bg-brand text-white" : "border-slate-300 bg-white"}`}>
                  <input type="checkbox" className="sr-only" checked={value.features.includes(f)} onChange={() => toggleFeature(f)} />{f}
                </label>
              ))}
            </div>
          </fieldset>
          <button type="button" onClick={() => onChange(EMPTY_FILTERS)} className="mt-4 text-sm font-semibold text-cta underline">Filtrləri sıfırla</button>
        </div>
      </div>
    </section>
  );
}
