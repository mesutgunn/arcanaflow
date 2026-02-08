import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Simple test endpoint to debug Supabase connection
export async function GET() {
    try {
        const supabase = await createClient()

        // Test 1: Check auth
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({
                error: 'Unauthorized',
                authError: authError?.message,
                step: 'auth_check'
            }, { status: 401 })
        }

        // Test 2: Check if we can query Order table
        const { data: orders, error: ordersError } = await supabase
            .from('orders')
            .select('*')
            .limit(10)

        // Test 3: Try lowercase table name if uppercase fails
        let ordersLower = null
        let ordersLowerError = null

        if (ordersError) {
            const result = await supabase
                .from('order')
                .select('*')
                .limit(10)
            ordersLower = result.data
            ordersLowerError = result.error
        }

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email
            },
            upperCaseTable: {
                success: !ordersError,
                error: ordersError?.message,
                count: orders?.length || 0,
                data: orders || []
            },
            lowerCaseTable: {
                success: !ordersLowerError,
                error: ordersLowerError?.message,
                count: ordersLower?.length || 0,
                data: ordersLower || []
            }
        })
    } catch (error: any) {
        return NextResponse.json({
            error: error.message,
            stack: error.stack
        }, { status: 500 })
    }
}
