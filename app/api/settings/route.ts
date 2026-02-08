import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { encrypt, decrypt } from '@/lib/encryption'

// GET /api/settings - Fetch user's shop settings
export async function GET() {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const shopSettings = await prisma.shopSettings.findUnique({
            where: { userId: user.id },
        })

        return NextResponse.json({ shopSettings })
    } catch (error) {
        console.error('Error fetching settings:', error)
        return NextResponse.json(
            { error: 'Failed to fetch settings' },
            { status: 500 }
        )
    }
}

// POST /api/settings - Create or update shop settings
export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { etsyShopId, etsyKeystring, etsySharedSecret } = body

        if (!etsyShopId || !etsyKeystring || !etsySharedSecret) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            )
        }

        // Encrypt sensitive data
        const encryptedKeystring = encrypt(etsyKeystring)
        const encryptedSecret = encrypt(etsySharedSecret)

        // Upsert shop settings
        const shopSettings = await prisma.shopSettings.upsert({
            where: { userId: user.id },
            update: {
                etsyShopId,
                etsyKeystring: encryptedKeystring,
                etsySharedSecret: encryptedSecret,
            },
            create: {
                userId: user.id,
                etsyShopId,
                etsyKeystring: encryptedKeystring,
                etsySharedSecret: encryptedSecret,
            },
        })

        // Also create/update user in database if doesn't exist
        await prisma.user.upsert({
            where: { id: user.id },
            update: { email: user.email! },
            create: {
                id: user.id,
                email: user.email!,
            },
        })

        return NextResponse.json({ success: true, shopSettings: { id: shopSettings.id, etsyShopId: shopSettings.etsyShopId } })
    } catch (error) {
        console.error('Error saving settings:', error)
        return NextResponse.json(
            { error: 'Failed to save settings' },
            { status: 500 }
        )
    }
}
