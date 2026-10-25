# Evler – Daşınmaz əmlak portalı
Next.js 14 · TypeScript · Tailwind · Supabase · Pannellum

## Quraşdırma
1. https://supabase.com → **New project** yaradın.
2. **SQL Editor → New query**: `supabase/schema.sql` faylının məzmununu yapışdırıb **Run** edin.
3. **Project Settings → API**: `Project URL` və `anon public` açarını kopyalayın.
4. `.env.example` faylını `.env.local` adı ilə kopyalayıb dəyərləri yazın.
5. `npm install && npm run dev` → http://localhost:3000
6. Vercel: repo-nu import edin, **Environment Variables** bölməsinə eyni iki dəyişəni əlavə edib Deploy edin.

## Qeydlər
- Qeydiyyat yoxdur, ona görə anonim INSERT açıqdır. Spam üçün rate limit / Cloudflare Turnstile əlavə edin.
- Silmə/redaktə siyasəti yoxdur; elanları Supabase **Table Editor**-dən idarə edin.
- Xəritə hələlik yer tutucudur.
