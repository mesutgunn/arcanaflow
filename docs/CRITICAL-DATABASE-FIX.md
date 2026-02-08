# 🚨 ACİL: Production Database Bağlantı Hatası

## Sorun
```
Can't reach database server at db.ijqppwjnitbkankfqmtj.supabase.co:5432
```

**Neden:** Vercel'de `DATABASE_URL` environment variable eksik!

---

## ⚡ HIZLI ÇÖZÜM (1 dakika)

### 1. Vercel Dashboard'a Git
```
https://vercel.com/mesutgunn/arcanaflow/settings/environment-variables
```

### 2. Şu Environment Variable'ı Ekle

**Name:**
```
DATABASE_URL
```

**Value:**
```
postgresql://postgres.ijqppwjnitbkankfqmtj:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**⚠️ ÖNEMLİ:** `[YOUR-PASSWORD]` yerine Supabase database şifrenizi yazın!

**Environment:** 
- ✅ Production
- ✅ Preview  
- ✅ Development

### 3. Redeploy

Vercel dashboard'da:
- Deployments tab'ına git
- En son deployment'ın sağındaki `...` → **Redeploy**

VEYA yeni push yapın:
```bash
git commit --allow-empty -m "Trigger redeploy"
git push origin main
```

---

## 📝 Supabase Database Şifrenizi Bulun

### Eğer Hatırlamıyorsanız:

1. **Supabase Dashboard** → Project Settings → Database
2. **Reset Database Password**
3. Yeni şifre oluşturun
4. Connection String'i kopyalayın
5. Vercel'e ekleyin

### Connection String Format:
```
postgresql://postgres.ijqppwjnitbkankfqmtj:HERE_IS_PASSWORD@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

---

## ✅ Doğrulama

Environment variable ekledikten ve redeploy ettikten sonra:

```
https://arcanaflow.vercel.app/api/debug/user-info
```

Artık çalışmalı!

---

## 🔍 Alternatif: Direct Connection

Pooler yerine direct connection da kullanabilirsiniz:

```
postgresql://postgres.ijqppwjnitbkankfqmtj:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
```

Port: 5432 (direct) veya 6543 (pooler - önerilen)
