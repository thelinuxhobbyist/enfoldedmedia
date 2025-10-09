// Cloudflare Pages Function for creating Stripe checkout sessions
export async function onRequest(context) {
  try {
    // Get the origin for CORS
    const origin = context.request.headers.get('Origin') || '*';
    
    // CORS Headers
    const headers = {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Credentials': 'true',
    };

    // Handle OPTIONS request for CORS
    if (context.request.method === 'OPTIONS') {
      return new Response(null, { headers });
    }

    // Only allow POST requests
    if (context.request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }

    // Get the package ID from the request body
    const { packageId } = await context.request.json();
    if (!packageId) {
      throw new Error('Package ID is required');
    }

    // Initialize Stripe with the secret key from environment variable
    const stripe = require('stripe')(context.env.STRIPE_SECRET_KEY);

    // Define package prices (in real implementation, these would come from a database)
    const packagePrices = {
      'event-poster': { price: 4999, name: 'Event Poster Creator' },  // $49.99
      'global-pack': { price: 29999, name: 'Startup Brand Pack' },    // $299.99
      'quick-amendments': { price: 2999, name: 'Quick Amendments Pack' } // $29.99
    };

    const packageInfo = packagePrices[packageId];
    if (!packageInfo) {
      throw new Error(`Invalid package ID: ${packageId}`);
    }

    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: packageInfo.name,
          },
          unit_amount: packageInfo.price, // Amount in cents
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${context.env.BASE_URL}/thank-you.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${context.env.BASE_URL}/details.html?id=${packageId}`,
    });

    // Return the session ID
    return new Response(JSON.stringify({ id: session.id }), {
      headers: { ...headers, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Checkout session creation failed:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...headers, 'Content-Type': 'application/json' }
    });
  }
}
