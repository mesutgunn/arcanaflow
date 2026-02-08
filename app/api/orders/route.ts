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
            .from('orders')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (ordersError) {
            console.error('❌ [Orders API] Supabase error:', ordersError)
            return NextResponse.json(
                { error: 'Failed to fetch orders' },
                { status: 500 }
            )
        }

        console.log('📦 [Orders API] Raw Supabase data:', {
            count: orders?.length || 0,
            userId: user.id,
            firstOrder: orders?.[0] || null
        })

        // Map snake_case to camelCase for frontend TypeScript compatibility
        const mappedOrders = orders?.map(order => ({
            id: order.id,
            userId: order.user_id,
            etsyOrderId: order.etsy_order_id,
            sku: order.product_name || order.sku, // Try both column names
            customer: order.customer_name || order.customer,
            note: order.personalization_note || order.note,
            status: order.status,
            createdAt: order.created_at,
            updatedAt: order.updated_at
        })) || []

        console.log('📦 [Orders API] Mapped orders:', {
            count: mappedOrders.length,
            firstMapped: mappedOrders[0] || null
        })

        return NextResponse.json(mappedOrders)
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
            .from('orders')
            .insert({
                user_id: user.id,
                etsy_order_id: etsyOrderId,
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
