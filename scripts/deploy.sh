#!/bin/bash

# ArcanaFlow Production Deployment Script
# Bu script deployment sürecini otomatikleştirir

set -e  # Hata olursa dur

echo "🚀 ArcanaFlow Production Deployment"
echo "===================================="
echo ""

# Renk kodları
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Environment Check
echo -e "${YELLOW}Step 1: Environment Variables Kontrolü${NC}"
if [ ! -f .env.local ]; then
    echo -e "${RED}❌ .env.local dosyası bulunamadı!${NC}"
    echo "Lütfen önce .env.local dosyasını oluşturun ve Supabase credentials'ları ekleyin."
    exit 1
fi

# Check for required env vars
required_vars=("NEXT_PUBLIC_SUPABASE_URL" "NEXT_PUBLIC_SUPABASE_ANON_KEY" "DATABASE_URL" "ENCRYPTION_KEY")
for var in "${required_vars[@]}"; do
    if ! grep -q "^$var=" .env.local; then
        echo -e "${RED}❌ $var bulunamadı!${NC}"
        exit 1
    fi
done

echo -e "${GREEN}✅ Environment variables OK${NC}"
echo ""

# Step 2: Dependencies
echo -e "${YELLOW}Step 2: Dependencies Kontrolü${NC}"
npm install
echo -e "${GREEN}✅ Dependencies yüklendi${NC}"
echo ""

# Step 3: Prisma
echo -e "${YELLOW}Step 3: Database Migration${NC}"
echo "Prisma Client generate ediliyor..."
npx prisma generate

echo "Database migration çalıştırılıyor..."
npx prisma migrate deploy

echo -e "${GREEN}✅ Database hazır${NC}"
echo ""

# Step 4: Build Test
echo -e "${YELLOW}Step 4: Production Build Test${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build başarılı!${NC}"
else
    echo -e "${RED}❌ Build başarısız!${NC}"
    exit 1
fi
echo ""

# Step 5: Git Push
echo -e "${YELLOW}Step 5: Git Push${NC}"
read -p "Git commit message: " commit_message

git add .
git commit -m "$commit_message" || echo "No changes to commit"
git push origin main

echo -e "${GREEN}✅ Code pushed to GitHub${NC}"
echo ""

# Step 6: Summary
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}🎉 Deployment Hazır!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo "Sonraki adımlar:"
echo "1. Vercel'e git: https://vercel.com"
echo "2. GitHub repo'yu import et"
echo "3. Environment variables ekle (.env.local'daki değerler)"
echo "4. Deploy butonuna bas!"
echo ""
echo "Deployment guide: deployment_guide.md"
