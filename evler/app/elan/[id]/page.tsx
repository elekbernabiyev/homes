import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Listing, fmtPrice, waLink } from "@/lib/constants";
import { supabase } from "@/lib/supabase";
import Gallery from "@/components/Gallery";
import Panorama from "@/components/Panorama";

export const dynamic = "force-dynamic";
async function get(id: string) {
  const { data } = await supabase.from("listings").select("*").eq("id", id).maybeSingle();
  return data as Listing | null;
}
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const l = await get(params.id);
  return { title: l ? `${l.title} – Evler` : "Elan tapılmadı – Evler", openGraph: { images: l?.photos[0] ? [l.photos[0]] : [] } };
}
export default async function Page({ params }: { params: { id: string } }) {
  const l = await get(params.id);
  if (!l) notFound();
  const rows: [string, string | number | null][] = [
    ["Kateqoriya", l.category], ["Əmlak növü", l.property_type], ["Şəhər", l.city], ["Rayon", l.district], ["Metro", l.metro],
    ["Qəsəbə", l.settlement], ["Ünvan", l.address], ["Otaq sayı", l.rooms], ["Sahə", l.area ? `${l.area} m²` : null],
    ["Mərtəbə", l.floor], ["Binanın mərtəbə sayı", l.total_floors], ["Elan tarixi", new Date(l.created_at).toLocaleDateString("az-AZ")],
  ];
  const wa = waLink(l.whatsapp || l.phone, `Salam, Evler-dəki "${l.title}" elanı ilə maraqlanıram.`);
  return (
    <div className="grid gap-6 py-6 lg:grid-cols-[1fr_340px]">
      <div className="space-y-6">
        <Gallery photos={l.photos} alt={l.title} />
        <section className="rounded-xl bg-white p-5 ring-1 ring-slate-200">
          <h1 className="text-2xl font-extrabold">{l.title}</h1>
          <table className="mt-4 w-full text-sm"><tbody>
            {rows.filter(([, v]) => v !== null && v !== "").map(([k, v]) => (
              <tr key={k} className="border-b last:border-0"><td className="w-1/2 py-2 text-slate-500">{k}</td><td className="py-2 font-semibold">{v}</td></tr>))}
          </tbody></table>
          {l.features.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{l.features.map((f) => <span key={f} className="rounded-full bg-mist px-3 py-1 text-sm font-semibold text-brand">✓ {f}</span>)}</div>}
          {l.description && <p className="mt-5 whitespace-pre-line leading-relaxed text-slate-700">{l.description}</p>}
        </section>
        {l.panoramas.length > 0 && <Panorama urls={l.panoramas} />}
        <section className="rounded-xl bg-white p-5 ring-1 ring-slate-200">
          <h2 className="mb-3 text-xl font-extrabold">Xəritədə yeri</h2>
          <div className="flex h-56 items-center justify-center rounded-lg bg-slate-100 p-4 text-center text-slate-500">
            Xəritə tezliklə əlavə olunacaq<br />{[l.address, l.settlement, l.district, l.city].filter(Boolean).join(", ")}
          </div>
        </section>
      </div>
      <aside className="h-fit space-y-3 rounded-xl bg-white p-5 ring-1 ring-slate-200 lg:sticky lg:top-20">
        <div className="text-3xl font-extrabold">{fmtPrice(l.price)}{l.category === "Kirayə" && <span className="text-base font-medium text-slate-500"> / ay</span>}</div>
        {l.owner_name && <div className="text-slate-600">{l.owner_name}</div>}
        <a href={`tel:${l.phone}`} className="btn-cta w-full">📞 {l.phone}</a>
        <a href={wa} target="_blank" rel="noopener noreferrer" className="flex w-full items-center justify-center rounded-lg bg-green-600 px-5 py-2.5 font-bold text-white hover:bg-green-700">WhatsApp ilə yaz</a>
      </aside>
    </div>
  );
}
