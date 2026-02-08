import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

// POST /api/debug/fix-userid - Update all orders to current user
export async function POST() {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Not logged in' }, { status: 401 })
        }

        // Update ALL orders to current user ID
        const result = await prisma.order.updateMany({
            data: {
                userId: user.id,
            },
        })

        return NextResponse.json({
            success: true,
            message: `Updated ${result.count} orders to userId: ${user.id}`,
            updatedCount: result.count,
            userId: user.id,
        })
    } catch (error: any) {
        console.error('Fix userId error:', error)
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        )
    }
}
