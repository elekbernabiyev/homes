"use client";
import { useEffect, useState } from "react";
import SearchFilters from "@/components/SearchFilters";
import ListingCard from "@/components/ListingCard";
import { EMPTY_FILTERS, Filters, Listing } from "@/lib/constants";
import { fetchListings } from "@/lib/query";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [items, setItems] = useState<Listing[]>([]);
  const [state, setState] = useState<"loading" | "ok" | "error">("loading");

  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get("category");
    if (c) setFilters((f) => ({ ...f, category: c }));
  }, []);

  useEffect(() => {
    let alive = true;
    const load = () => fetchListings(filters).then((d) => { if (alive) { setItems(d); setState("ok"); } }).catch(() => alive && setState("error"));
    const t = setTimeout(load, 300);
    const ch = supabase.channel("listings-live").on("postgres_changes", { event: "INSERT", schema: "public", table: "listings" }, load).subscribe();
    return () => { alive = false; clearTimeout(t); supabase.removeChannel(ch); };
  }, [filters]);

  return (
    <>
      <div className="-mx-4 bg-gradient-to-br from-ink to-brand px-4 pb-14 pt-12 text-white">
        <h1 className="mx-auto max-w-7xl text-3xl font-extrabold leading-tight sm:text-5xl">Ev axtarırsınız?<br />Evler-də tapın.</h1>
        <p className="mx-auto mt-3 max-w-7xl text-lg text-white/80">Qeydiyyatsız elan verin, 360° virtual turla evə getmədən baxın.</p>
      </div>
      <SearchFilters value={filters} onChange={setFilters} />
      <h2 className="mb-4 mt-8 text-xl font-extrabold">{state === "ok" ? `${items.length} elan tapıldı` : "Elanlar"}</h2>
      {state === "loading" && <p className="py-16 text-center text-slate-500">Elanlar yüklənir…</p>}
      {state === "error" && <p className="rounded-lg bg-red-50 p-4 text-red-700">Elanları yükləmək mümkün olmadı. İnternet bağlantısını və Supabase açarlarını yoxlayıb yenidən cəhd edin.</p>}
      {state === "ok" && items.length === 0 && <p className="rounded-xl bg-white p-10 text-center text-slate-600">Bu filtrlərə uyğun elan yoxdur. Filtrləri dəyişin və ya ilk elanı siz verin.</p>}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">{items.map((l) => <ListingCard key={l.id} l={l} />)}</div>
    </>
  );
}
