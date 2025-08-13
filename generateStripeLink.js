const fs = require('fs');

console.log('Script started');
console.log('Checking environment...');

// Check if Stripe secret key is available
if (!process.env.SECRET_ENFOLD) {
  console.error('ERROR: SECRET_ENFOLD environment variable is not set');
  process.exit(1);
}

console.log('Initializing Stripe...');
let stripe;
try {
  stripe = require('stripe')(process.env.SECRET_ENFOLD, {
    apiVersion: '2023-10-16',
    maxNetworkRetries: 3,
    timeout: 30000
  });
  console.log('Stripe initialized successfully');
} catch (error) {
  console.error('ERROR initializing Stripe:', error.message);
  console.error('Full error:', error);
  process.exit(1);
}

// Check file permissions
try {
  const testPath = `${process.cwd()}/js`;
  console.log('Checking write permissions for directory:', testPath);
  fs.accessSync(testPath, fs.constants.W_OK);
  console.log('✅ Have write permissions to js directory');
} catch (error) {
  console.error('❌ No write permissions to js directory:', error);
  process.exit(1);
}

// Path to your packages.json file
const packagesPath = `${process.cwd()}/js/packages.json`;
console.log(`Reading packages from: ${packagesPath}`);
const packages = JSON.parse(fs.readFileSync(packagesPath, 'utf8'));
console.log(`Successfully loaded ${packages.length} packages`);

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
  console.log(`Total packages to process: ${packages.length}`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const pkg of packages) {
    try {
      console.log(`\n--- Processing package: ${pkg.name} ---`);
      console.log(`Price: ${pkg.price}`);
      
      // Skip if already has a Stripe link
      if (pkg.stripeLink && pkg.stripeLink.trim() !== '') {
        console.log(`✅ Skipping ${pkg.name} - already has a Stripe link`);
        successCount++;
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
      console.log(`✅ Generated Stripe link for ${pkg.name}: ${paymentLink.url}`);
      successCount++;

    } catch (error) {
      console.error(`❌ Error generating link for ${pkg.name}:`);
      console.error(`   Error type: ${error.type}`);
      console.error(`   Error message: ${error.message}`);
      console.error(`   Error code: ${error.code}`);
      errorCount++;
      
      // Continue with other packages even if one fails
    }
  }
  
  // Summary
  console.log(`\n=== SUMMARY ===`);
  console.log(`Total packages: ${packages.length}`);
  console.log(`Successful: ${successCount}`);
  console.log(`Errors: ${errorCount}`);
  
  // Save the updated packages.json file
  try {
    const updatedContent = JSON.stringify(packages, null, 2);
    fs.writeFileSync(packagesPath, updatedContent);
    console.log(`✅ Successfully updated ${packagesPath} with Stripe links`);
    console.log('First few characters of saved content:', updatedContent.substring(0, 100));
    
    // Verify the file was saved correctly
    const verifyContent = fs.readFileSync(packagesPath, 'utf8');
    console.log('File exists after save:', fs.existsSync(packagesPath));
    console.log('File size after save:', fs.statSync(packagesPath).size);
    console.log('First few characters after re-reading:', verifyContent.substring(0, 100));
  } catch (error) {
    console.error('❌ Error saving packages.json:', error);
    console.error('Error stack:', error.stack);
    process.exit(1);
  }
}

generateStripeLinks().catch(error => {
  console.error('Fatal error:', error.message);
  process.exit(1);
});
