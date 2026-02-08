import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/orders - Fetch user's orders using Supabase client
export async function GET() {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        console.log('🔍 [Orders API] User auth check:', {
            userId: user?.id,
            email: user?.email,
            authError: authError?.message
        })

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Use Supabase client instead of Prisma to avoid connection issues
        const { data: orders, error: ordersError } = await supabase
            .from('Order')
            .select('*')
            .eq('userId', user.id)
            .order('createdAt', { ascending: false })

        if (ordersError) {
            console.error('❌ [Orders API] Supabase error:', ordersError)
            return NextResponse.json(
                { error: 'Failed to fetch orders' },
                { status: 500 }
            )
        }

        console.log('📦 [Orders API] Found orders:', {
            count: orders?.length || 0,
            userId: user.id,
            orders: orders?.map(o => ({
                id: o.id,
                etsyOrderId: o.etsyOrderId,
                customer: o.customer,
                status: o.status
            })) || []
        })

        return NextResponse.json(orders || [])
    } catch (error: any) {
        console.error('❌ [Orders API] Error fetching orders:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to fetch orders' },
            { status: 500 }
        )
    }
}

// POST /api/orders - Create new order using Supabase client
export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { etsyOrderId, customer, sku, note, status = 'PENDING' } = body

        // Use Supabase client instead of Prisma
        const { data: order, error: insertError } = await supabase
            .from('Order')
            .insert({
                userId: user.id,
                etsyOrderId,
                customer,
                sku,
                note,
                status,
            })
            .select()
            .single()

        if (insertError) {
            console.error('❌ [Orders API] Insert error:', insertError)
            return NextResponse.json(
                { error: insertError.message },
                { status: 500 }
            )
        }

        return NextResponse.json(order)
    } catch (error: any) {
        console.error('❌ [Orders API] Error creating order:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to create order' },
            { status: 500 }
        )
    }
}
