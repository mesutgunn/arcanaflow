# n8n Email Parsing Workflow for Etsy Orders

This workflow parses Etsy order notification emails and creates orders in ArcanaFlow.

## Setup Instructions

### 1. n8n Installation

**Option A: Docker (Recommended for local)**
```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

Access at: http://localhost:5678

**Option B: n8n Cloud ($20/month)**
- Go to https://n8n.cloud
- Sign up for account
- Instant setup, no installation

### 2. Import Workflow

1. Open n8n interface
2. Click "+" → "Import from File" or "Import from URL"
3. Use the workflow JSON below

### 3. Configure Credentials

**In n8n Credentials:**
- Name: ArcanaFlow Webhook Secret
- Type: Header Auth
- Header Name: `Authorization`
- Header Value: `Bearer bf7fa5d75f174d3f8a250a2abf7028da0ffd69df0e04ab31d0237e2ece334f0a`

### 4. Workflow Configuration

**Email Trigger Options:**

**Option A: IMAP (Gmail)**
- Node: Email Trigger (IMAP)
- Server: imap.gmail.com
- Port: 993
- Email: your-etsy-notification-email@gmail.com
- Password: Your Gmail App Password
- Filter: FROM "transaction@etsy.com" SUBJECT "You sold"

**Option B: Webhook Email Service**
- Use service like EmailWebhook.com
- Get dedicated email address
- Configure to POST to n8n webhook

### 5. Gmail Filter Setup

If using IMAP trigger:
1. Gmail → Settings → Filters
2. Create filter:
   ```
   From: transaction@etsy.com
   Subject: contains "You sold"
   ```
3. Mark as read (optional)
4. Apply label: "Etsy Orders"

### 6. Test

Send test POST to n8n webhook:
```bash
curl -X POST http://localhost:5678/webhook-test/etsy-order \
  -H "Content-Type: application/json" \
  -d '{
    "html": "<div>Order #123456</div><div>Buyer: John Doe</div>"
  }'
```

---

## Workflow JSON

```json
{
  "name": "Etsy Email to ArcanaFlow",
  "nodes": [
    {
      "parameters": {
        "path": "etsy-order",
        "options": {}
      },
      "name": "Webhook Trigger",
      "type": "n8n-nodes-base.webhook",
      "position": [250, 300]
    },
    {
      "parameters": {
        "jsCode": "// Extract email body\nconst emailHtml = $input.item.json.html || $input.item.json.body;\n\n// Parse order details (adjust regex based on actual email format)\nconst orderIdMatch = emailHtml.match(/Order #(\\d+)/);\nconst buyerMatch = emailHtml.match(/Buyer:?\\s*([^<]+)/);\nconst skuMatch = emailHtml.match(/SKU:?\\s*(\\w+)/);\nconst noteMatch = emailHtml.match(/Personalization:?\\s*([^<]+)/s);\n\nreturn {\n  etsyOrderId: orderIdMatch?.[1] || Date.now().toString(),\n  customer: buyerMatch?.[1]?.trim() || 'Unknown Customer',\n  sku: skuMatch?.[1] || 'arvionlove',\n  note: noteMatch?.[1]?.trim() || ''\n};"
      },
      "name": "Parse Email",
      "type": "n8n-nodes-base.code",
      "position": [450, 300]
    },
    {
      "parameters": {
        "url": "https://arcanaflow.vercel.app/api/webhooks/orders",
        "authentication": "predefinedCredentialType",
        "nodeCredentialType": "httpHeaderAuth",
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={\n  \"userId\": \"{{ $env.USER_ID }}\",\n  \"etsyOrderId\": \"{{ $json.etsyOrderId }}\",\n  \"customer\": \"{{ $json.customer }}\",\n  \"sku\": \"{{ $json.sku }}\",\n  \"note\": \"{{ $json.note }}\"\n}",
        "options": {}
      },
      "name": "Create Order in ArcanaFlow",
      "type": "n8n-nodes-base.httpRequest",
      "position": [650, 300],
      "credentials": {
        "httpHeaderAuth": {
          "name": "ArcanaFlow Webhook Secret"
        }
      }
    }
  ],
  "connections": {
    "Webhook Trigger": {
      "main": [
        [
          {
            "node": "Parse Email",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Parse Email": {
      "main": [
        [
          {
            "node": "Create Order in ArcanaFlow",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

---

## Environment Variables

**Set in n8n:**
```
USER_ID=your-supabase-user-id
```

To get your user ID:
1. Login to ArcanaFlow
2. Open browser console
3. Run: `document.cookie`
4. Find Supabase session token
5. Decode JWT to get user ID

---

## Troubleshooting

**Email not triggering:**
- Check Gmail filter is active
- Verify IMAP credentials
- Check n8n execution log

**Order not created:**
- Check webhook secret matches
- Verify userId is correct
- Check ArcanaFlow logs (Vercel dashboard)

**Parsing errors:**
- Email format may have changed
- Update regex patterns in Parse Email node
- Test with actual Etsy email HTML

---

## Next Steps

After n8n is working:
1. Add email notification when order created
2. Trigger AI reading generation
3. PDF generation workflow
4. Complete automation pipeline
