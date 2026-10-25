"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES, CITIES, DISTRICTS, FEATURES, METROS, TYPES } from "@/lib/constants";
import { supabase, uploadImage } from "@/lib/supabase";

const MAX = 15 * 1024 * 1024;
const F = ({ l, children }: { l: string; children: React.ReactNode }) => <div><label className="label">{l}</label>{children}</div>;
const Opt = (a: string[]) => a.map((o) => <option key={o}>{o}</option>);

export default function PostForm() {
  const router = useRouter();
  const [features, setFeatures] = useState<string[]>([]);
  const [photos, setPhotos] = useState<File[]>([]);
  const [pans, setPans] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const pick = (setter: (f: File[]) => void, max: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.some((f) => f.size > MAX)) return setMsg("Hər şəklin ölçüsü maksimum 15 MB ola bilər.");
    if (files.length > max) return setMsg(`Maksimum ${max} şəkil seçə bilərsiniz.`);
    setMsg(null); setter(files);
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (fd.get("website")) return; // spam tələsi
    if (photos.length === 0) return setMsg("Ən azı bir şəkil yükləyin.");
    const phone = String(fd.get("phone")).trim();
    if (phone.replace(/\D/g, "").length < 9) return setMsg("Düzgün telefon nömrəsi daxil edin. Nümunə: 050 123 45 67");
    setBusy(true); setMsg(null);
    try {
      const [photoUrls, panUrls] = await Promise.all([
        Promise.all(photos.map((f) => uploadImage(f, "photos"))),
        Promise.all(pans.map((f) => uploadImage(f, "panoramas"))),
      ]);
      const n = (k: string) => (fd.get(k) ? Number(fd.get(k)) : null);
      const s = (k: string) => (String(fd.get(k) ?? "").trim() || null);
      const type = String(fd.get("property_type")), rooms = n("rooms"), area = n("area");
      const { data, error } = await supabase.from("listings").insert({
        category: fd.get("category"), property_type: type,
        title: s("title") || [rooms && `${rooms} otaqlı`, type, area && `${area} m²`].filter(Boolean).join(", "),
        description: s("description"), city: fd.get("city"), district: s("district"), metro: s("metro"), settlement: s("settlement"), address: s("address"),
        price: n("price"), rooms, area, floor: n("floor"), total_floors: n("total_floors"),
        features, photos: photoUrls, panoramas: panUrls, owner_name: s("owner_name"), phone, whatsapp: s("whatsapp") || phone,
      }).select("id").single();
      if (error) throw error;
      router.push(`/elan/${data.id}`);
    } catch {
      setMsg("Elan dərc edilmədi. Şəkillərin ölçüsünü və internet bağlantısını yoxlayıb yenidən cəhd edin.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 rounded-2xl bg-white p-5 shadow ring-1 ring-slate-200 sm:p-8">
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="grid gap-4 sm:grid-cols-2">
        <F l="Kateqoriya *"><select name="category" required className="input">{Opt(CATEGORIES)}</select></F>
        <F l="Əmlak növü *"><select name="property_type" required className="input">{Opt(TYPES)}</select></F>
        <F l="Şəhər *"><select name="city" required className="input">{Opt(CITIES)}</select></F>
        <F l="Rayon"><select name="district" className="input"><option value="">Seçin</option>{Opt(DISTRICTS)}</select></F>
        <F l="Metro stansiyası"><select name="metro" className="input"><option value="">Seçin</option>{Opt(METROS)}</select></F>
        <F l="Qəsəbə / Massiv"><input name="settlement" className="input" /></F>
        <div className="sm:col-span-2"><F l="Ünvan"><input name="address" className="input" placeholder="Küçə, bina nömrəsi" /></F></div>
        <F l="Qiymət (AZN) *"><input name="price" type="number" min={1} required className="input" /></F>
        <F l="Otaq sayı"><input name="rooms" type="number" min={1} max={20} className="input" /></F>
        <F l="Sahə (m²)"><input name="area" type="number" min={1} step="0.1" className="input" /></F>
        <F l="Mərtəbə"><input name="floor" type="number" min={0} className="input" /></F>
        <F l="Binanın mərtəbə sayı"><input name="total_floors" type="number" min={1} className="input" /></F>
        <F l="Elanın başlığı"><input name="title" maxLength={150} className="input" placeholder="Boş qalsa avtomatik yaradılacaq" /></F>
      </div>
      <fieldset><legend className="label">Əlavə imkanlar</legend>
        <div className="flex flex-wrap gap-2">{FEATURES.map((f) => (
          <label key={f} className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm font-medium ${features.includes(f) ? "border-brand bg-brand text-white" : "border-slate-300"}`}>
            <input type="checkbox" className="sr-only" checked={features.includes(f)} onChange={() => setFeatures(features.includes(f) ? features.filter((x) => x !== f) : [...features, f])} />{f}
          </label>))}</div></fieldset>
      <F l="Ətraflı məlumat"><textarea name="description" rows={5} className="input" placeholder="Əmlak haqqında əlavə məlumat yazın" /></F>
      <div className="grid gap-4 sm:grid-cols-2">
        <F l="Şəkillər * (maks. 20)"><input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={pick(setPhotos, 20)} className="input" /><p className="mt-1 text-xs text-slate-500">{photos.length} şəkil seçilib</p></F>
        <F l="360° panorama şəkilləri (maks. 5)"><input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={pick(setPans, 5)} className="input" /><p className="mt-1 text-xs text-slate-500">{pans.length} panorama seçilib. 2:1 (equirectangular) format tövsiyə olunur.</p></F>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <F l="Adınız"><input name="owner_name" className="input" /></F>
        <F l="Telefon *"><input name="phone" type="tel" required className="input" placeholder="+994 50 123 45 67" /></F>
        <F l="WhatsApp nömrəsi"><input name="whatsapp" type="tel" className="input" placeholder="Boş qalsa telefon istifadə olunur" /></F>
      </div>
      {msg && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{msg}</p>}
      <button disabled={busy} className="btn-cta w-full text-lg disabled:opacity-60">{busy ? "Şəkillər yüklənir, gözləyin…" : "Elanı dərc et"}</button>
    </form>
  );
}
