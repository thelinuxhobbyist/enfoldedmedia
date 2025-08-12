const fs = require('fs');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  maxNetworkRetries: 3,
  timeout: 30000
});

// Check if Stripe secret key is available
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('STRIPE_SECRET_KEY environment variable is not set');
  process.exit(1);
}

// Path to your packages.json file
const packages = JSON.parse(fs.readFileSync('./js/packages.json', 'utf8'));

function parsePrice(priceStr) {
  // Remove £ symbol and any commas
  let cleanPrice = priceStr.replace('£', '').replace(',', '');
  
  // Handle monthly prices (e.g., "£100/month")
  if (cleanPrice.includes('/month')) {
    cleanPrice = cleanPrice.replace('/month', '');
  }
  
  // Parse the number
  const price = parseFloat(cleanPrice);
  if (isNaN(price)) {
    throw new Error(`Invalid price format: ${priceStr}`);
  }
  
  // Convert to cents
  return Math.round(price * 100);
}

async function generateStripeLinks() {
  console.log('Starting Stripe payment link generation...');
  
  for (const pkg of packages) {
    try {
      console.log(`Processing package: ${pkg.name} with price: ${pkg.price}`);
      
      // Skip if already has a Stripe link (uncomment the lines below if you want to regenerate all links)
      if (pkg.stripeLink && pkg.stripeLink.trim() !== '') {
        console.log(`Skipping ${pkg.name} - already has a Stripe link: ${pkg.stripeLink}`);
        continue;
      }
      
      // Parse price to cents
      const priceInCents = parsePrice(pkg.price);
      console.log(`Price in cents: ${priceInCents}`);
      
      // Create a Payment Link on Stripe with retry logic
      let paymentLink;
      let retries = 0;
      const maxRetries = 3;
      
      while (retries < maxRetries) {
        try {
          paymentLink = await stripe.paymentLinks.create({
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
                url: 'https://enfoldedmedia.com/thank-you', // Update this to your actual thank you page
              },
            },
          });
          break; // Success, exit retry loop
        } catch (error) {
          retries++;
          console.log(`Attempt ${retries}/${maxRetries} failed for ${pkg.name}: ${error.message}`);
          
          if (retries >= maxRetries) {
            throw error; // Re-throw if all retries failed
          }
          
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * retries));
        }
      }

      // Update the package with the new Stripe payment link
      pkg.stripeLink = paymentLink.url;
      console.log(`Generated Stripe link for ${pkg.name}: ${paymentLink.url}`);

    } catch (error) {
      console.error(`Error generating link for ${pkg.name}:`, error.message);
      // Continue with other packages even if one fails
    }
  }
  
  // Save the updated packages.json file
  try {
    fs.writeFileSync('./js/packages.json', JSON.stringify(packages, null, 2));
    console.log('Successfully updated packages.json with Stripe links');
  } catch (error) {
    console.error('Error saving packages.json:', error.message);
    process.exit(1);
  }
}

generateStripeLinks().catch(error => {
  console.error('Fatal error:', error.message);
  process.exit(1);
});
