// Using native fetch

async function run() {
  try {
    const email = `testuser_1773568786542@example.com`
    console.log('Sending exact frontend payload structure to verify CORS and JSON responses...')
    
    // Test the specific email we know is in the DB
    const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:5173'
      },
      body: JSON.stringify({ email })
    })

    const text = await res.text()
    console.log('Status:', res.status)
    try {
        console.log('Response JSON body:', JSON.parse(text))
    } catch {
        console.log('Response RAW body:', text)
    }
  } catch (err) {
    console.error('Error in script:', err)
  }
}

run()
