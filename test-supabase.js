require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('Testing Supabase connection...')
console.log('URL:', supabaseUrl)
console.log('Key:', supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'Missing')

const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
    try {
        // Test query
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .limit(5)

        if (error) {
            console.error('❌ Supabase Error:', error)
        } else {
            console.log('✅ Success! Found orders:', data?.length || 0)
            if (data && data.length > 0) {
                console.log('First order:', data[0])
            }
        }
    } catch (err) {
        console.error('❌ Exception:', err.message)
    }
}

test()
