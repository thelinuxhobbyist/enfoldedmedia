const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function testStripeConnection() {
  console.log('Testing Stripe connection...');
  
  try {
    // Test 1: Check if we can access the account
    const account = await stripe.accounts.retrieve();
    console.log('✅ Stripe account access successful');
    console.log('Account ID:', account.id);
    console.log('Account type:', account.type);
    
    // Test 2: Try to create a simple payment link
    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: 'Test Product',
              description: 'Test payment link',
            },
            unit_amount: 1000, // £10.00
          },
          quantity: 1,
        },
      ],
      after_completion: {
        type: 'redirect',
        redirect: {
          url: 'https://enfoldedmedia.com/thank-you',
        },
      },
    });
    
    console.log('✅ Payment link creation successful');
    console.log('Test payment link:', paymentLink.url);
    
    // Test 3: Check if we can list existing payment links
    const paymentLinks = await stripe.paymentLinks.list({ limit: 5 });
    console.log('✅ Payment links listing successful');
    console.log('Found', paymentLinks.data.length, 'existing payment links');
    
  } catch (error) {
    console.error('❌ Stripe API error:', error.message);
    console.error('Error type:', error.type);
    console.error('Error code:', error.code);
    
    if (error.type === 'StripeAuthenticationError') {
      console.error('🔑 Authentication failed - check your API key');
    } else if (error.type === 'StripePermissionError') {
      console.error('🚫 Permission denied - check your account permissions');
    } else if (error.type === 'StripeInvalidRequestError') {
      console.error('📝 Invalid request - check the API parameters');
    }
  }
}

testStripeConnection();
