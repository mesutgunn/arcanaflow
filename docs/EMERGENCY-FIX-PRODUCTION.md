# 🚨 ACİL: Production Sipariş Sorunu Çözümü

## ⚡ HIZLI ÇÖZÜM (2 dakika)

### Adım 1: Durumu Kontrol Et
Production'da giriş yaptığınız halde, bu linke tıklayın:
```
https://arcanaflow.vercel.app/api/debug/user-info
```

**Ne göreceksiniz:**
- `currentUser.id` → Sizin gerçek User ID'niz
- `userOrders.count` → 0 (sizin için sipariş yok)
- `allOrders.count` → 1+ (sistemde sipariş var ama başkasına ait)
- `issue` → ❌ Orders exist but userId does not match

### Adım 2: TEK TIK DÜZELTME
Giriş yaptığınız halde, bu linke tıklayın:
```
https://arcanaflow.vercel.app/api/debug/fix-userid
```

**Ne yapacak:**
✅ Supabase'deki TÜM siparişleri sizin User ID'nize update edecek

**Response:**
```json
{
  "success": true,
  "message": "Updated 1 orders to userId: xxx-xxx-xxx",
  "updatedCount": 1
}
```

### Adım 3: Dashboard'ı Yenile
```
https://arcanaflow.vercel.app/dashboard
```

"Check Orders" butonuna basın → Siparişler görünecek! 🎉

---

## 🔧 n8n İçin Kalıcı Çözüm

### Settings'ten User ID'nizi Kopyalayın:
```
https://arcanaflow.vercel.app/settings
```

En üstte **"Your User ID"** bölümü var → Kopyala

### n8n Supabase Insert Node'unda Kullanın:

**Row Data:**
```json
{
  "userId": "BURAYA_KOPYALADIĞINIZ_USER_ID",
  "etsyOrderId": "{{ $json.etsyOrderId }}",
  "customer": "{{ $json.customer }}",
  "sku": "{{ $json.sku }}",
  "note": "{{ $json.note }}",
  "status": "PENDING"
}
```

**ÖNEMLI:** `userId` alanını **sabit değer** olarak kendi ID'nize set edin!

---

## ✅ Test

1. Yukarıdaki fix-userid endpoint'ini çağırın
2. Dashboard'ı yenileyin
3. Sipariş görünmeli!
4. n8n'de userId'yi düzeltin
5. Test order ekleyin
6. Yeni order da görünmeli!
