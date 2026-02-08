# Quick Fix: Orders Not Showing

## Problem
Orders exist in Supabase but don't appear in Dashboard because **userId doesn't match**.

## Solution

### Step 1: Check Current User ID

Open this URL in browser (while logged in):
```
http://localhost:3000/api/debug/user-info
```

This will show:
- Your current user ID
- Orders for your user (should be 0)
- All orders in database (should show the order you see in Supabase)

### Step 2: Fix User ID

Open this URL in browser (while logged in):
```
http://localhost:3000/api/debug/fix-userid
```

This will:
- Update ALL orders in database to your current user ID
- Return success message

### Step 3: Refresh Dashboard

Go to dashboard and click "Check Orders" button.

---

## Alternative: Manual Fix in Supabase

1. Go to **Settings** page → Copy your User ID
2. Open **Supabase Dashboard** → Table Editor → Order table
3. Click on the order row
4. Update `userId` field to your copied User ID
5. Save
6. Refresh Dashboard

---

## For Production (n8n)

When n8n inserts orders, make sure to use YOUR User ID:

**Your User ID:** (Get from Settings page)

In n8n Supabase Insert node, set:
```json
{
  "userId": "YOUR_ACTUAL_USER_ID_FROM_SETTINGS"
}
```
