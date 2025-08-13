const fs = require('fs');

console.log('🔧 Quick Stripe Link Generator');
console.log('==============================');

// Check if Stripe key is available
if (!process.env.STRIPE_SECRET_KEY) {
  console.log('\n❌ STRIPE_SECRET_KEY not found in environment');
  console.log('Please set it first:');
  console.log('export STRIPE_SECRET_KEY="your_stripe_secret_key"');
  console.log('\nThen run this script again.');
  process.exit(1);
}

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Load packages
const packages = JSON.parse(fs.readFileSync('./js/packages.json', 'utf8'));

console.log(`📦 Found ${packages.length} packages to process`);
console.log('🚀 Generating Stripe links...\n');

let generated = 0;
let skipped = 0;

async function generateLinks() {
  for (const pkg of packages) {
    try {
      // Skip if already has a link
      if (pkg.stripeLink && pkg.stripeLink.trim() !== '') {
        console.log(`⏭️  Skipped: ${pkg.name} (already has link)`);
        skipped++;
        continue;
      }

      // Parse price
      const price = parseInt(pkg.price.replace('£', '').replace(',', '')) * 100;
      
      // Create payment link
      const paymentLink = await stripe.paymentLinks.create({
        line_items: [{
          price_data: {
            currency: 'gbp',
            product_data: {
              name: pkg.name,
              description: pkg.shortDescription,
            },
            unit_amount: price,
          },
          quantity: 1,
        }],
        after_completion: {
          type: 'redirect',
          redirect: { url: 'https://enfoldedmedia.com/thank-you' },
        },
      });

      // Update package
      pkg.stripeLink = paymentLink.url;
      console.log(`✅ Generated: ${pkg.name} - ${paymentLink.url}`);
      generated++;

    } catch (error) {
      console.log(`❌ Failed: ${pkg.name} - ${error.message}`);
    }
  }

  // Save changes
  fs.writeFileSync('./js/packages.json', JSON.stringify(packages, null, 2));
  
  console.log('\n🎉 DONE!');
  console.log(`📊 Generated: ${generated} new links`);
  console.log(`⏭️  Skipped: ${skipped} existing links`);
  
  if (generated > 0) {
    console.log('\n✅ Your website should now work!');
    console.log('💳 Buy buttons will go to Stripe payment pages.');
  }
}

generateLinks();
