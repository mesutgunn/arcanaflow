## 🔑 Adım 3: API Credentials Toplama

Supabase dashboard'da (arcanaproject projesinde) şu adımları takip edin:

---

### **1. Project URL ve API Keys**

**Sol menüden:**
1. **Settings** (dişli ikonu ⚙️)
2. **API** sekmesi

**Bu sayfada göreceksiniz:**

#### a) Project URL
```
https://xxxxxxxxxxx.supabase.co
```
→ **Kopyalayın** (Copy butonu var)

#### b) Project API keys

**anon public** (hemen görünür):
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
→ **Kopyalayın**

**service_role** (Show butonu var, gizli):
- "Reveal" veya "Show" butonuna basın
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
→ **Kopyalayın**

---

### **2. Database Connection String**

**Sol menüden:**
1. **Settings** (dişli ikonu ⚙️)
2. **Database** sekmesi

**Connection String** bölümünde:
- **URI** seçin (Tab'lardan)

Göreceksiniz:
```
postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

**ÖNEMLİ**: `[YOUR-PASSWORD]` yazan yere **kaydettiğiniz database şifresini** yazın!

**Örnek:**
```
postgresql://postgres.abc123:ArcanaFlow2024!Secure#Pass@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

→ **Şifreyi ekleyip kopyalayın**

---

### **3. Encryption Key Oluşturma** (Local)

Terminal'de şu komutu çalıştırın:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Çıkan 64 karakterlik string'i **kopyalayın**.

---

## ✅ Hazır mısınız?

Topladığınız credentials'lar:
- [ ] Project URL
- [ ] anon public key
- [ ] service_role key  
- [ ] Database URL (şifre eklenmiş)
- [ ] Encryption key (generate ettiniz)

**Hepsi hazırsa**: "Credentials'ları aldım" deyin, `.env.local` dosyasını oluşturacağız!
