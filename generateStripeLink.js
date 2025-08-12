const fs = require('fs');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Load the secret key from environment variables

// Path to your packages.js file
const packages = JSON.parse(fs.readFileSync('./js/packages.json', 'utf8'));

async function generateStripeLinks() {
  for (const pkg of packages) {
    try {
      // Convert price to cents (Stripe accepts the price in cents, e.g., £25 = 2500)
    const priceStr = pkg.price.replace('£', '').replace(',', '');
    const priceInCents = parseInt(priceStr) * 100;

      // Create a Payment Link on Stripe
      const paymentLink = await stripe.paymentLinks.create({
        line_items: [
          {
            price_data: {
              currency: 'gbp', // Currency is GBP for pounds
              product_data: {
                name: pkg.name,
                description: pkg.shortDescription,
              },
              unit_amount: priceInCents, // price in cents
            },
            quantity: 1,
          },
        ],
        after_completion: {
          type: 'redirect',
          redirect: {
            url: 'https://your-website.com/thank-you', // Redirect after successful payment
          },
        },
      });

      // Update the packages.js with the new Stripe payment link
      pkg.stripeLink = paymentLink.url;

            console.log(`Processing package: ${pkg.name}, price: ${pkg.price}, priceInCents: ${priceInCents}`);

    // Save the updated packages.json file
    fs.writeFileSync('./js/packages.json', JSON.stringify(packages, null, 2));

    } catch (error) {
      console.error(`Error generating link for ${pkg.name}:`, error);
    }
  }
}

generateStripeLinks();
