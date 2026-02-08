## 🎯 Etsy Developer App Registration Guide

### Step 1: Register as Developer

1. Go to https://www.etsy.com/developers/register
2. Sign in with your Etsy account
3. Accept developer terms and conditions

### Step 2: Create New App

Click **"Create a New App"** and fill in:

**App Information:**
```
App Name: ArcanaFlow
App Description: Multi-tenant SaaS platform for tarot reading shops
Tell us about your app: Automated order management and fulfillment for Etsy sellers
```

**OAuth Settings:**
```
Callback URL: https://arcanaflow-p39a9l9bz-mesuts-projects-5e875827.vercel.app/api/etsy/callback
```

**Permissions (Scopes):**
- ✅ Read transactions (transactions_r)
- ✅ Read shops (shops_r)  
- ✅ Read listings (listings_r)

### Step 3: Get Credentials

After creating the app, you'll see:

**Keystring** (Client ID):
```
Example: abc123def456
```
→ Copy this!

**Shared Secret** (Client Secret):
```
Example: xyz789uvw012
```
→ Copy this!

### Step 4: Save Credentials

Keep these in a safe place. You'll need them for:
- Local `.env.local` file
- Vercel environment variables

---

**Next Steps:**

Once you have both credentials, we'll:
1. Add them to environment variables
2. Update database schema
3. Implement OAuth flow
4. Test connection

---

**Ready?** Share your Keystring and Shared Secret when you have them!
