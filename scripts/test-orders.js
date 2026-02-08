// Test script to check order fetching
// Run with: node scripts/test-orders.js

const fetch = require('node-fetch');

async function testOrders() {
    console.log('Testing /api/orders endpoint...\n');

    try {
        const response = await fetch('http://localhost:3000/api/orders');
        console.log('Status:', response.status);
        console.log('Headers:', response.headers.raw());

        const data = await response.json();
        console.log('\nResponse data:');
        console.log(JSON.stringify(data, null, 2));

        if (Array.isArray(data)) {
            console.log(`\n✅ Found ${data.length} orders`);
        } else {
            console.log('\n❌ Response is not an array');
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testOrders();
