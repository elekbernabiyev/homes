export const CATEGORIES = ["Satış", "Kirayə"];
export const TYPES = ["Yeni tikili", "Köhnə tikili", "Həyət evi / Villa", "Torpaq sahəsi", "Obyekt", "Qaraj / Ofis"];
export const CITIES = ["Bakı", "Sumqayıt", "Xırdalan", "Gəncə", "Mingəçevir", "Şəki", "Lənkəran", "Şirvan", "Naxçıvan"];
export const DISTRICTS = ["Nəsimi", "Nərimanov", "Yasamal", "Xətai", "Səbail", "Binəqədi", "Nizami", "Sabunçu", "Suraxanı", "Xəzər", "Qaradağ", "Pirallahı", "Abşeron"];
export const METROS = ["28 May", "İçərişəhər", "Sahil", "Gənclik", "Nizami", "Elmlər Akademiyası", "İnşaatçılar", "20 Yanvar", "Memar Əcəmi", "Nəsimi", "Azadlıq prospekti", "Dərnəgül", "Xətai", "Nərimanov", "Bakmil", "Ulduz", "Koroğlu", "Qara Qarayev", "Neftçilər", "Xalqlar Dostluğu", "Əhmədli", "Həzi Aslanov", "Avtovağzal", "Cəfər Cabbarlı"];
export const FEATURES = ["Sənədli (Kupçalı)", "İpotekaya yararlı", "Yeni təmirli", "Əşyalı", "Qaraj", "Lift", "Kombi", "İsti döşəmə", "Su/Qaz/Işıq daimi"];

export type Listing = {
  id: string; created_at: string; category: string; property_type: string; title: string; description: string | null;
  city: string; district: string | null; metro: string | null; settlement: string | null; address: string | null;
  price: number; rooms: number | null; area: number | null; floor: number | null; total_floors: number | null;
  features: string[]; photos: string[]; panoramas: string[]; owner_name: string | null; phone: string; whatsapp: string | null;
};
export type Filters = {
  category: string; type: string; city: string; district: string; metro: string; settlement: string;
  priceMin: string; priceMax: string; rooms: string; areaMin: string; areaMax: string;
  floorMin: string; floorMax: string; totalMin: string; totalMax: string; features: string[];
};
export const EMPTY_FILTERS: Filters = {
  category: "", type: "", city: "", district: "", metro: "", settlement: "", priceMin: "", priceMax: "", rooms: "",
  areaMin: "", areaMax: "", floorMin: "", floorMax: "", totalMin: "", totalMax: "", features: [],
};
export const fmtPrice = (n: number) => new Intl.NumberFormat("az-AZ").format(n) + " ₼";
export const waLink = (p: string, t = "") => `https://wa.me/${p.replace(/\D/g, "")}${t ? `?text=${encodeURIComponent(t)}` : ""}`;
