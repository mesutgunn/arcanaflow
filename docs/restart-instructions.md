## 🔄 Dev Server Restart Instructions

### Problem

Environment variables updated (`.env.local`) but dev server needs restart to load them.

### What Changed

✅ **Environment Variables Added:**
```env
ETSY_CLIENT_ID=yp58jpfdc3c3tqfjnfjn2a9x
ETSY_CLIENT_SECRET=2w4zf3rj29
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

✅ **Database Schema Updated:**
- OAuth token fields in `ShopSettings` model
- Unique compound index on `Order` model

### Steps to Complete

**1. Restart Dev Server:**
```bash
# Stop current dev server
Ctrl + C

# Start again
npm run dev
```

**2. Run Database Migration:**

Open **new terminal window**:
```bash
npx prisma migrate dev --name add_etsy_oauth_tokens
```

**3. Generate Prisma Client:**
```bash
npx prisma generate
```

### Expected Output

Migration should show:
```
✔ Generated Prisma Client
Your database is now in sync with your schema.
```

### Next Steps

After migration completes:
- OAuth auth routes
- Token refresh logic
- Order sync implementation
- Settings page update

---

**Ready?** Complete the steps above and report back!
