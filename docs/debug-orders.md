## Debug: Orders Not Showing

### Check These:

1. **Browser Console Logs**
   - Open DevTools (F12)
   - Go to Console tab
   - Refresh dashboard page
   - Look for:
     - `🔄 [Dashboard] Fetching orders...`
     - `📡 [Dashboard] Response status: 200`
     - `✅ [Dashboard] Orders: [...]`

2. **Terminal Logs** (npm run dev)
   - Look for:
     - `🔍 [Orders API] User auth check:`
     - `📦 [Orders API] Found orders:`

3. **Check Supabase Data**
   - Open Supabase Dashboard
   - Go to Table Editor → Order table
   - Verify `userId` matches your logged-in user
   - Copy your User ID from Settings page

### Common Issues:

**Issue 1: Wrong userId**
- Supabase Order.userId ≠ Logged in user.id
- **Fix**: Update userId in Supabase table to match logged in user

**Issue 2: Prisma out of sync**
- Run: `npx prisma generate`

**Issue 3: Database connection**
- Check `.env.local` has correct `DATABASE_URL`

### Quick Test:

**Add a test order via API:**
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "etsyOrderId": "TEST123",
    "customer": "Test Customer",
    "sku": "arvionlove",
    "note": "Test order",
    "status": "PENDING"
  }'
```

Then check if it appears in Dashboard.
