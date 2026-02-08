import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Get n8n webhook URL from environment
        const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL

        if (!n8nWebhookUrl) {
            return NextResponse.json(
                { error: 'n8n webhook not configured yet' },
                { status: 503 }
            )
        }

        // Trigger n8n email check workflow
        const response = await fetch(n8nWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: user.id,
                action: 'check_orders',
                timestamp: new Date().toISOString(),
            }),
        })

        if (!response.ok) {
            throw new Error('n8n webhook failed')
        }

        return NextResponse.json({
            success: true,
            message: 'Email check triggered',
        })
    } catch (error: any) {
        console.error('Manual check error:', error)
        return NextResponse.json(
            { error: 'Failed to trigger email check' },
            { status: 500 }
        )
    }
}
