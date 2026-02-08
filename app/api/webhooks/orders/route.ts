import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const WEBHOOK_SECRET = process.env.N8N_WEBHOOK_SECRET

export async function POST(request: NextRequest) {
    try {
        // Verify webhook secret
        const authHeader = request.headers.get('authorization')
        const expectedAuth = `Bearer ${WEBHOOK_SECRET}`

        if (!authHeader || authHeader !== expectedAuth) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const body = await request.json()

        const {
            userId,
            etsyOrderId,
            customer,
            sku,
            note,
        } = body

        // Validate required fields
        if (!userId || !etsyOrderId || !customer || !sku) {
            return NextResponse.json(
                {
                    error: 'Missing required fields',
                    received: { userId, etsyOrderId, customer, sku }
                },
                { status: 400 }
            )
        }

        // Create or update order
        const order = await prisma.order.upsert({
            where: {
                userId_etsyOrderId: {
                    userId,
                    etsyOrderId,
                },
            },
            update: {
                customer,
                note: note || '',
                updatedAt: new Date(),
            },
            create: {
                userId,
                etsyOrderId,
                customer,
                sku,
                note: note || '',
                status: 'PENDING',
            },
        })

        return NextResponse.json({
            success: true,
            order: {
                id: order.id,
                etsyOrderId: order.etsyOrderId,
                customer: order.customer,
                status: order.status,
            },
        })
    } catch (error: any) {
        console.error('Webhook error:', error)

        return NextResponse.json(
            {
                error: 'Failed to create order',
                message: error.message
            },
            { status: 500 }
        )
    }
}
