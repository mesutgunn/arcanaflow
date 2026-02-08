import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const WEBHOOK_URL = 'https://mw1dkob9.rpcld.com/webhook-test/f3169de2-e670-4c40-8bd5-515395558199'

// POST /api/orders/[id]/process - Process order and send to webhook
export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const orderId = params.id

        // Get order details
        const { data: order, error: fetchError } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .eq('user_id', user.id)
            .single()

        if (fetchError || !order) {
            console.error('❌ [Process Order] Order not found:', fetchError)
            return NextResponse.json({ error: 'Order not found' }, { status: 404 })
        }

        console.log('🔄 [Process Order] Processing order:', {
            orderId,
            customer: order.customer,
            sku: order.sku
        })

        // Update status to PROCESSING
        const { error: updateError } = await supabase
            .from('orders')
            .update({ status: 'PROCESSING' })
            .eq('id', orderId)

        if (updateError) {
            console.error('❌ [Process Order] Failed to update status:', updateError)
            return NextResponse.json({ error: 'Failed to update status' }, { status: 500 })
        }

        // Send to webhook
        try {
            const webhookPayload = {
                order_id: order.id,
                etsy_order_id: order.etsy_order_id,
                customer: order.customer,
                sku: order.sku,
                note: order.note,
                status: 'PROCESSING',
                user_id: user.id,
                callback_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://arcanaflow.vercel.app'}/api/webhook/order-ready`
            }

            console.log('📤 [Process Order] Sending to webhook:', WEBHOOK_URL)

            const webhookResponse = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(webhookPayload),
            })

            const webhookData = await webhookResponse.text()

            console.log('✅ [Process Order] Webhook response:', {
                status: webhookResponse.status,
                data: webhookData
            })

            return NextResponse.json({
                success: true,
                message: 'Order sent to processing',
                order_id: orderId,
                webhook_status: webhookResponse.status
            })

        } catch (webhookError: any) {
            console.error('❌ [Process Order] Webhook error:', webhookError)

            // Still return success since status was updated
            return NextResponse.json({
                success: true,
                message: 'Order status updated but webhook failed',
                order_id: orderId,
                webhook_error: webhookError.message
            })
        }

    } catch (error: any) {
        console.error('❌ [Process Order] Error:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to process order' },
            { status: 500 }
        )
    }
}
