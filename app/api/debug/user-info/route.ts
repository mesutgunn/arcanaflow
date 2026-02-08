import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

// GET /api/debug/user-info - Show current user ID and all orders
export async function GET() {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Not logged in' }, { status: 401 })
        }

        // Get ALL orders in database (for debugging)
        const allOrders = await prisma.order.findMany({
            select: {
                id: true,
                userId: true,
                etsyOrderId: true,
                customer: true,
                status: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        })

        // Get orders for current user
        const userOrders = allOrders.filter(o => o.userId === user.id)

        return NextResponse.json({
            currentUser: {
                id: user.id,
                email: user.email,
            },
            userOrders: {
                count: userOrders.length,
                orders: userOrders,
            },
            allOrders: {
                count: allOrders.length,
                orders: allOrders,
            },
            issue: userOrders.length === 0 && allOrders.length > 0
                ? '❌ Orders exist but userId does not match current user!'
                : allOrders.length === 0
                    ? '⚠️ No orders in database at all'
                    : '✅ Orders found for current user',
        })
    } catch (error: any) {
        console.error('Debug endpoint error:', error)
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        )
    }
}
