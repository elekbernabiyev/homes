import PostForm from "@/components/PostForm";
export const metadata = { title: "Elan ver – Evler" };
export default function Page() {
  return (
    <div className="mx-auto max-w-3xl py-8">
      <h1 className="text-3xl font-extrabold">Yeni elan</h1>
      <p className="mb-6 mt-1 text-slate-600">Qeydiyyat tələb olunmur. Formu doldurun, elan dərhal yayımlanacaq.</p>
      <PostForm />
    </div>
  );
}
