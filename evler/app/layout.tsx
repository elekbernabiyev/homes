import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const manrope = Manrope({ subsets: ["latin", "latin-ext"], variable: "--font-manrope" });
export const metadata: Metadata = {
  title: "Evler – Daşınmaz əmlak elanları",
  description: "Satış və kirayə mənzillər, evlər, torpaq və obyektlər. Qeydiyyatsız elan verin, 360° virtual tur ilə baxın.",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="az">
      <body className={manrope.variable + " font-sans"}>
        <Header />
        <main className="mx-auto max-w-7xl px-4 pb-16">{children}</main>
        <footer className="border-t bg-white py-8 text-center text-sm text-slate-500">© {new Date().getFullYear()} Evler. Bütün hüquqlar qorunur.</footer>
      </body>
    </html>
  );
}
