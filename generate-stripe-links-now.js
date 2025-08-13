const fs = require('fs');

// Check if Stripe secret key is available
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY environment variable is not set');
  console.log('Please set it with: export STRIPE_SECRET_KEY="your_stripe_secret_key"');
  console.log('You can get your Stripe secret key from: https://dashboard.stripe.com/apikeys');
  process.exit(1);
}

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  maxNetworkRetries: 3,
  timeout: 30000
});

console.log('🔑 Stripe secret key is set');
console.log('Key starts with:', process.env.STRIPE_SECRET_KEY.substring(0, 7) + '...');

// Load packages
const packages = JSON.parse(fs.readFileSync('./js/packages.json', 'utf8'));
console.log(`📦 Loaded ${packages.length} packages`);

async function generateAllStripeLinks() {
  console.log('\n🚀 Starting Stripe link generation...\n');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const pkg of packages) {
    try {
      console.log(`\n--- Processing: ${pkg.name} ---`);
      console.log(`Price: ${pkg.price}`);
      
      // Skip if already has a Stripe link
      if (pkg.stripeLink && pkg.stripeLink.trim() !== '') {
        console.log(`✅ Already has Stripe link: ${pkg.stripeLink}`);
        successCount++;
        continue;
      }
      
      // Parse price to cents
      const priceStr = pkg.price.replace('£', '').replace(',', '');
      const priceInCents = parseInt(priceStr) * 100;
      console.log(`💰 Price in cents: ${priceInCents}`);
      
      // Create Stripe payment link
      const paymentLink = await stripe.paymentLinks.create({
        line_items: [
          {
            price_data: {
              currency: 'gbp',
              product_data: {
                name: pkg.name,
                description: pkg.shortDescription,
              },
              unit_amount: priceInCents,
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
      
      // Update package with Stripe link
      pkg.stripeLink = paymentLink.url;
      console.log(`✅ Generated: ${paymentLink.url}`);
      successCount++;
      
    } catch (error) {
      console.error(`❌ Error for ${pkg.name}:`);
      console.error(`   Type: ${error.type}`);
      console.error(`   Message: ${error.message}`);
      console.error(`   Code: ${error.code}`);
      errorCount++;
    }
  }
  
  // Save updated packages
  try {
    fs.writeFileSync('./js/packages.json', JSON.stringify(packages, null, 2));
    console.log(`\n🎉 SUCCESS! Updated packages.json`);
    console.log(`📊 Summary: ${successCount} successful, ${errorCount} errors`);
    
    if (successCount > 0) {
      console.log('\n✅ Your website should now work! Buy buttons will go to Stripe.');
    }
    
  } catch (error) {
    console.error('❌ Error saving packages.json:', error.message);
  }
}

generateAllStripeLinks();
