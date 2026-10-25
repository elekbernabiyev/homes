import Link from "next/link";
export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-ink text-white shadow">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="text-2xl font-extrabold tracking-tight">Evler<span className="text-cta">.</span></Link>
        <nav className="flex items-center gap-5 text-sm font-semibold">
          <Link href="/?category=Satış" className="hidden hover:text-cta sm:inline">Satış</Link>
          <Link href="/?category=Kirayə" className="hidden hover:text-cta sm:inline">Kirayə</Link>
          <Link href="/elan-ver" className="btn-cta !py-2">+ Elan ver</Link>
        </nav>
      </div>
    </header>
  );
}
