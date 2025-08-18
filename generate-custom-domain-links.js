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

// Custom domain configuration
// const CUSTOM_DOMAIN = 'pay.enfoldedmedia.com'; // Uncomment this line to use the custom domain in the future
const CUSTOM_DOMAIN = 'buy.stripe.com'; // Default Stripe domain

// Load packages
const packages = JSON.parse(fs.readFileSync('./js/packages.json', 'utf8'));
console.log(`📦 Loaded ${packages.length} packages`);

async function generateCustomDomainStripeLinks() {
  console.log('\n🚀 Starting Stripe link generation with custom domain...');
  console.log(`🌐 Using custom domain: ${CUSTOM_DOMAIN}\n`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const pkg of packages) {
    try {
      console.log(`\n--- Processing: ${pkg.name} ---`);
      console.log(`Price: ${pkg.price}`);
      
      // Parse price to cents
      const priceStr = pkg.price.replace('£', '').replace('/month', '').replace(',', '');
      const priceInCents = Math.round(parseFloat(priceStr) * 100);
      console.log(`💰 Price in cents: ${priceInCents}`);
      
      // Create Stripe payment link with custom domain
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
        // Set custom domain
        custom_text: {
          submit: {
            message: `Complete your purchase for ${pkg.name}`
          }
        },
        // Note: The custom domain needs to be configured in your Stripe dashboard
        // This will generate links that can be used with your custom domain
      });
      
      // Replace the domain in the generated URL with the default Stripe domain
      let customUrl = paymentLink.url;
      // if (customUrl.includes('buy.stripe.com')) { // Uncomment this block to switch back to custom domain
      //   customUrl = customUrl.replace('buy.stripe.com', CUSTOM_DOMAIN);
      // }

      // Update package with default Stripe domain link
      pkg.stripeLink = customUrl;
      console.log(`✅ Generated default domain link: ${customUrl}`);
      successCount++;
      
    } catch (error) {
      console.error(`❌ Error for ${pkg.name}:`);
      console.error(`   Type: ${error.type}`);
      console.error(`   Message: ${error.message}`);
      console.error(`   Code: ${error.code}`);
      if (error.response) {
        console.error(`   Response: ${JSON.stringify(error.response.data, null, 2)}`);
      }
      errorCount++;
    }
  }
  
  // Save updated packages
  try {
    // Create backup of current packages.json
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    fs.writeFileSync(`./js/packages.json.backup-${timestamp}`, JSON.stringify(packages, null, 2));
    console.log(`\n💾 Created backup: packages.json.backup-${timestamp}`);
    
    // Save updated packages
    fs.writeFileSync('./js/packages.json', JSON.stringify(packages, null, 2));
    console.log(`\n🎉 SUCCESS! Updated packages.json with custom domain links`);
    console.log(`📊 Summary: ${successCount} successful, ${errorCount} errors`);
    console.log(`🌐 All links now use custom domain: ${CUSTOM_DOMAIN}`);
    
    if (successCount > 0) {
      console.log('\n✅ Your website should now use custom domain links!');
      console.log('⚠️  Make sure your custom domain is properly configured in Stripe Dashboard:');
      console.log('   1. Go to https://dashboard.stripe.com/settings/branding');
      console.log('   2. Configure your custom domain under "Custom branding"');
      console.log('   3. Add CNAME record: pay.enfoldedmedia.com -> hosted-checkout.stripecdn.com');
    }
    
  } catch (error) {
    console.error('❌ Error saving packages.json:', error.message);
  }
}

generateCustomDomainStripeLinks();

// Note: To switch back to the custom domain, uncomment the CUSTOM_DOMAIN line above and the block for replacing the domain.
