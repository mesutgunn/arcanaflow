// Quick test to check API response
async function testAPI() {
    try {
        const response = await fetch('http://localhost:3000/api/orders');
        const data = await response.json();
        console.log('API Response:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

testAPI();
