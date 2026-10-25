import { supabase } from "./supabase";
import { Filters, Listing } from "./constants";

export async function fetchListings(f: Filters): Promise<Listing[]> {
  let q = supabase.from("listings").select("*").order("created_at", { ascending: false }).limit(60);
  const eq = (col: string, v: string) => { if (v) q = q.eq(col, v); };
  const num = (v: string) => (v === "" ? null : Number(v));
  eq("category", f.category); eq("property_type", f.type); eq("city", f.city); eq("district", f.district); eq("metro", f.metro);
  if (f.settlement.trim()) q = q.ilike("settlement", `%${f.settlement.trim()}%`);
  const ranges: [string, string, string][] = [["price", f.priceMin, f.priceMax], ["area", f.areaMin, f.areaMax], ["floor", f.floorMin, f.floorMax], ["total_floors", f.totalMin, f.totalMax]];
  for (const [col, lo, hi] of ranges) {
    if (num(lo) !== null) q = q.gte(col, num(lo)!);
    if (num(hi) !== null) q = q.lte(col, num(hi)!);
  }
  if (f.rooms) q = f.rooms === "5" ? q.gte("rooms", 5) : q.eq("rooms", Number(f.rooms));
  if (f.features.length) q = q.contains("features", f.features);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Listing[];
}
