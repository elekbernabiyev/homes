import Link from "next/link";
import { Listing, fmtPrice } from "@/lib/constants";

export default function ListingCard({ l }: { l: Listing }) {
  const where = [l.metro && `m. ${l.metro}`, l.district, l.city].filter(Boolean).join(", ");
  const days = Math.floor((Date.now() - new Date(l.created_at).getTime()) / 864e5);
  return (
    <Link href={`/elan/${l.id}`} className="group overflow-hidden rounded-xl bg-white ring-1 ring-slate-200 transition hover:shadow-xl">
      <div className="relative aspect-[4/3] bg-slate-200">
        {l.photos[0] && <img src={l.photos[0]} alt={l.title} loading="lazy" className="h-full w-full object-cover" />}
        <span className="absolute left-2 top-2 rounded bg-ink/90 px-2 py-1 text-xs font-bold text-white">{l.category}</span>
        {l.panoramas.length > 0 && <span className="absolute right-2 top-2 rounded bg-cta px-2 py-1 text-xs font-bold text-white">360°</span>}
      </div>
      <div className="p-3">
        <div className="text-xl font-extrabold">{fmtPrice(l.price)}{l.category === "Kirayə" && <span className="text-sm font-medium text-slate-500"> / ay</span>}</div>
        <div className="mt-1 text-sm text-slate-600">
          {[l.rooms && `${l.rooms} otaqlı`, l.area && `${l.area} m²`, l.floor != null && l.total_floors && `${l.floor}/${l.total_floors} mərtəbə`].filter(Boolean).join(" • ")}
        </div>
        <div className="mt-1 truncate text-sm text-slate-500">{where}</div>
        <div className="mt-2 text-xs text-slate-400">{days === 0 ? "Bu gün" : `${days} gün əvvəl`}</div>
      </div>
    </Link>
  );
}
