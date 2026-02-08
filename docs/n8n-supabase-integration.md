# n8n Supabase Direct Integration Guide

## Overview

n8n will write order data **directly** to Supabase Orders table, no webhook needed.

## Flow

```
Etsy Email → Gmail → n8n Parse → Supabase Insert → Order Created ✅
                                                ↓
                                      Dashboard Refresh Shows Order
```

---

## n8n Workflow Setup

### 1. Add Supabase Credentials in n8n

**Go to**: n8n → Credentials → Add Credential → Supabase

**Fill in:**
```
Host: https://ijqppwjnitbkankfqmtj.supabase.co
Service Role Secret: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqcXBwd2puaXRia2Fua2ZxbXRqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDU1NDAyMywiZXhwIjoyMDg2MTMwMDIzfQ.qZbcMjSlWAF_12TWyu73x3NYsez1JkvU8KbfewZoXIE
```

**Save** as `ArcanaFlow Supabase`

---

### 2. Workflow Nodes

```
┌─────────────────┐
│  Email Trigger  │  ← Gmail IMAP or Webhook
│  (IMAP/Webhook) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Parse Email    │  ← Extract order data
│   (Code Node)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Supabase Insert │  ← Write to Orders table
│      Node       │
└─────────────────┘
```

---

### 3. Email Trigger Node

**Type**: Email Trigger (IMAP) or Webhook

**IMAP Configuration:**
```
Host: imap.gmail.com
Port: 993
User: your-etsy-email@gmail.com
Password: [Gmail App Password]
Mailbox: INBOX
Filter: FROM "transaction@etsy.com" SUBJECT "You sold"
```

**Alternative**: Use EmailWebhook.com service

---

### 4. Parse Email Node (Code)

**Type**: Code (JavaScript)

**Code:**

```javascript
// Get email HTML content
const emailHtml = $input.item.json.html || $input.item.json.body;

// Parse Etsy order email
// Adjust regex based on your email format
const orderIdMatch = emailHtml.match(/Order #(\d+)/);
const buyerMatch = emailHtml.match(/Buyer:?\s*([^<\n]+)/);
const itemMatch = emailHtml.match(/Item:?\s*([^<\n]+)/);
const skuMatch = emailHtml.match(/SKU:?\s*(\w+)/);
const noteMatch = emailHtml.match(/Personalization[:\s]+(.+?)(?=<\/|$)/s);

// Extract data
const etsyOrderId = orderIdMatch?.[1] || Date.now().toString();
const customer = buyerMatch?.[1]?.trim() || 'Unknown Customer';
const sku = skuMatch?.[1]?.trim() || 'arvionlove';
const note = noteMatch?.[1]?.trim() || '';

// Return parsed data
return {
  etsyOrderId,
  customer,
  sku,
  note,
  status: 'PENDING',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
```

---

### 5. Supabase Insert Node

**Type**: Supabase → Insert

**Configuration:**
```
Credentials: ArcanaFlow Supabase
Operation: Insert
Table: Order
Rows:
```

**Row Data (JSON):**
```json
{
  "userId": "YOUR_USER_ID_FROM_SETTINGS",
  "etsyOrderId": "{{ $json.etsyOrderId }}",
  "customer": "{{ $json.customer }}",
  "sku": "{{ $json.sku }}",
  "note": "{{ $json.note }}",
  "status": "PENDING",
  "createdAt": "{{ $json.createdAt }}",
  "updatedAt": "{{ $json.updatedAt }}"
}
```

**Important**: Replace `YOUR_USER_ID_FROM_SETTINGS` with your actual User ID from Settings page!

---

### 6. Error Handling (Optional)

Add **Error Trigger** node connected to Supabase Insert:

**Type**: Error Trigger

**Then**: Send notification (email/slack) about failed order

---

## Testing

### Test Email Parsing

1. Forward a real Etsy "You sold..." email to your n8n trigger
2. Check n8n execution log
3. Verify parsed data is correct

### Test Supabase Insert

1. Manually trigger workflow
2. Check Supabase → Table Editor → Order table
3. Verify new row appears with correct data

### Test ArcanaFlow Dashboard

1. Open https://arcanaflow.vercel.app/dashboard
2. Click "Check Orders" button
3. New order should appear in dashboard

---

## Order Table Schema

```sql
Table: Order
Columns:
- id (uuid, PK, auto)
- userId (uuid, FK → User.id)
- etsyOrderId (text)
- customer (text)
- sku (text)
- note (text)
- status (text) → 'PENDING', 'PROCESSING', 'READY', 'SENT'
- createdAt (timestamp)
- updatedAt (timestamp)

Unique Constraint: (userId, etsyOrderId)
```

---

## Common Issues

**Issue**: `userId not found`  
**Fix**: Make sure you copied User ID from Settings page

**Issue**: `Duplicate key error`  
**Fix**: Order with same etsyOrderId already exists. n8n should handle duplicates with upsert.

**Issue**: Email not triggering  
**Fix**: Check Gmail filter, IMAP credentials, or email webhook configuration

**Issue**: Parsing fails  
**Fix**: Email format changed. Update regex in Code node.

---

## Production Checklist

- [ ] Supabase credentials added in n8n
- [ ] User ID copied from Settings
- [ ] Email trigger configured
- [ ] Parse logic tested with real email
- [ ] Supabase Insert working
- [ ] Error handling added
- [ ] Dashboard shows new orders

---

## Next: AI Reading Workflow

After orders are created, you can trigger AI reading generation using the **AI Reading Webhook** shown in Settings page.
