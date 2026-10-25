import Link from "next/link";
export default function NotFound() {
  return <div className="py-24 text-center"><h1 className="text-2xl font-extrabold">Elan tapılmadı</h1><p className="mt-2 text-slate-600">Elan silinib və ya link səhvdir.</p><Link href="/" className="btn-cta mt-6">Ana səhifəyə qayıt</Link></div>;
}
