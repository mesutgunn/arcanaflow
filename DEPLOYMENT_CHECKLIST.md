# ArcanaFlow Production Deployment Checklist

## Pre-Deployment Checklist ✅

- [x] Mock mode kaldırıldı
- [x] Middleware restore edildi
- [x] Homepage redirect düzeltildi
- [x] Environment template güncellendi
- [x] Deployment guide hazırlandı

## Deployment Steps

### 1. Supabase Setup (~5 dakika)

- [ ] [supabase.com](https://supabase.com)'da hesap oluştur
- [ ] Yeni proje oluştur:
  - Name: `ArcanaFlow`
  - Region: `Europe West (Frankfurt)`
  - Database Password: `[güçlü şifre - kaydet!]`
- [ ] API credentials kopyala (Settings → API):
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Database URL kopyala (Settings → Database):
  - `DATABASE_URL`

### 2. Local Setup (~10 dakika)

- [ ] `.env.local` dosyası oluştur (`.env.local.example`'dan kopyala)
- [ ] Supabase credentials ekle
- [ ] Encryption key generate et:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- [ ] Database migration çalıştır:
  ```bash
  npx prisma migrate dev --name init
  npx prisma generate
  ```
- [ ] Local test:
  ```bash
  npm run dev
  ```
  - `/login` sayfası açılmalı
  - Register yapabilmeli
  - Settings'e redirect olmalı

### 3. Git Setup

- [ ] GitHub'da yeni repo oluştur: `arcanaflow`
- [ ] Local repo initialize:
  ```bash
  git init
  git add .
  git commit -m "Production ready - Multi-tenant SaaS"
  git remote add origin https://github.com/[username]/arcanaflow.git
  git branch -M main
  git push -u origin main
  ```

### 4. Vercel Deployment (~5 dakika)

- [ ] [vercel.com](https://vercel.com)'da hesap oluştur (GitHub ile)
- [ ] New Project → GitHub repo seç: `arcanaflow`
- [ ] Environment Variables ekle (Settings):
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `DATABASE_URL`
  - `ENCRYPTION_KEY`
  - Hepsini Production + Preview + Development için işaretle!
- [ ] Deploy!

### 5. Post-Deployment Configuration

- [ ] Vercel deployment URL'i kopyala: `https://arcanaflow-xxx.vercel.app`
- [ ] Supabase'de redirect URL ekle:
  - Authentication → URL Configuration
  - Site URL: `https://arcanaflow-xxx.vercel.app`
  - Redirect URLs: `https://arcanaflow-xxx.vercel.app/auth/callback`

### 6. Google OAuth (Opsiyonel)

- [ ] Supabase: Authentication → Providers → Google (enable)
- [ ] [Google Cloud Console](https://console.cloud.google.com):
  - Yeni proje oluştur
  - OAuth 2.0 Client ID oluştur
  - Authorized redirect URI: `https://[project-ref].supabase.co/auth/v1/callback`
  - Authorized JavaScript origins: `https://arcanaflow-xxx.vercel.app`
- [ ] Client ID ve Secret'ı Supabase'e yapıştır

### 7. Verification (~5 dakika)

- [ ] Production URL'i aç
- [ ] Register ile yeni kullanıcı oluştur
- [ ] Email verification geldi mi?
- [ ] Settings'de Etsy credentials kaydet
- [ ] Dashboard'a redirect oldu mu?
- [ ] Supabase SQL Editor'de kontrol et:
  ```sql
  -- Kullanıcı oluştu mu?
  SELECT * FROM "User";
  
  -- Şifreler encrypted mi?
  SELECT "etsyKeystring", "etsySharedSecret" FROM "ShopSettings";
  -- Gibberish görmelisiniz
  ```
- [ ] Logout → Login tekrar çalışıyor mu?
- [ ] İkinci bir kullanıcı oluştur → Data izolasyonu var mı?

## Post-Deployment

### Monitoring Setup

- [ ] Vercel Analytics aktif et
- [ ] Sentry error tracking (opsiyonel)
- [ ] Supabase logs kontrol et

### Next: Etsy Integration

Deployment sonrası gerçek entegrasyonlara başlayabilirsiniz:

1. **Etsy API**: Gerçek sipariş çekme
2. **n8n Workflows**: AI reading generation
3. **PDF Generation**: Tarot reading raporları
4. **Email Notifications**: Sipariş bildirimleri

---

## Yardım

Sorun yaşarsanız:

1. **Build hatası**: `npm run build` local'de çalışıyor mu?
2. **Database hatası**: `DATABASE_URL` doğru mu? Password'de özel karakter varsa URL encode et
3. **401 Unauthorized**: Environment variables Vercel'de doğru mu? Redeploy dene
4. **Google OAuth**: Redirect URL'ler hem Supabase hem Google Console'da doğru mu?

Detaylı troubleshooting: `deployment_guide.md`
