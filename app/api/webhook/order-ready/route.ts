import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST /api/webhook/order-ready - Webhook callback when order is ready
export async function POST(request: Request) {
    try {
        const body = await request.json()

        console.log('📥 [Webhook] Order ready callback:', body)

        const { order_id, status, ...otherData } = body

        if (!order_id) {
            return NextResponse.json({ error: 'order_id required' }, { status: 400 })
        }

        // Use service role to bypass RLS for webhook
        const supabase = await createClient()

        // Update order status to READY
        const { data: order, error: updateError } = await supabase
            .from('orders')
            .update({
                status: 'READY',
                updated_at: new Date().toISOString()
            })
            .eq('id', order_id)
            .select()
            .single()

        if (updateError) {
            console.error('❌ [Webhook] Failed to update order:', updateError)
            return NextResponse.json(
                { error: 'Failed to update order', details: updateError },
                { status: 500 }
            )
        }

        console.log('✅ [Webhook] Order marked as READY:', {
            orderId: order_id,
            customer: order?.customer
        })

        return NextResponse.json({
            success: true,
            message: 'Order marked as ready',
            order_id,
            order
        })

    } catch (error: any) {
        console.error('❌ [Webhook] Error:', error)
        return NextResponse.json(
            { error: error.message || 'Webhook processing failed' },
            { status: 500 }
        )
    }
}

// GET endpoint for testing
export async function GET() {
    return NextResponse.json({
        message: 'Webhook endpoint is active',
        endpoint: '/api/webhook/order-ready',
        method: 'POST',
        expected_payload: {
            order_id: 'uuid',
            status: 'READY',
            // ... other fields
        }
    })
}
