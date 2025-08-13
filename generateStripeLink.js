const fs = require('fs');

console.log('=== Stripe Link Generator Starting ===');
console.log('Timestamp:', new Date().toISOString());

// Validate JSON before processing
function validatePackage(pkg) {
  const required = ['id', 'name', 'shortDescription', 'price'];
  const errors = [];

  // Check required fields
  required.forEach(field => {
    if (!pkg[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  });

  // Validate price format
  if (pkg.price && !pkg.price.startsWith('£')) {
    errors.push('Price must start with £ symbol');
  }

  // Validate ID format (only allow letters, numbers, and hyphens)
  if (pkg.id && !/^[a-z0-9-]+$/.test(pkg.id)) {
    errors.push('ID must contain only lowercase letters, numbers, and hyphens');
  }

  return errors;
}

function validateAllPackages(packages) {
  console.log('Validating packages...');
  let hasErrors = false;

  packages.forEach((pkg, index) => {
    const errors = validatePackage(pkg);
    if (errors.length > 0) {
      console.error(`❌ Package ${index + 1} (${pkg.id || 'unknown'}) has errors:`);
      errors.forEach(err => console.error(`   - ${err}`));
      hasErrors = true;
    }
  });

  return !hasErrors;
}

// Create backup of packages.json
function backupPackages(packagesPath) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = `${packagesPath}.backup-${timestamp}`;
  fs.copyFileSync(packagesPath, backupPath);
  console.log(`✓ Created backup at: ${backupPath}`);
}

console.log('\n1. Environment Check:');

// Check for the specific environment variable we need
const hasStripeKey = !!process.env.SECRET_ENFOLD;
console.log('SECRET_ENFOLD present:', hasStripeKey);
if (hasStripeKey) {
    console.log('Key length:', process.env.SECRET_ENFOLD.length);
    console.log('Key starts with:', process.env.SECRET_ENFOLD.substring(0, 7));
}

// Check if Stripe secret key is available
if (!process.env.SECRET_ENFOLD) {
  console.error('\n❌ ERROR: SECRET_ENFOLD environment variable is not set');
  console.error('This is required for the script to work.');
  console.error('Please ensure the secret is properly set in GitHub repository settings.');
  process.exit(1);
}

console.log('\n2. Initializing Stripe...');
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

// Read and validate packages
let packages;
try {
  const packagesData = fs.readFileSync(packagesPath, 'utf8');
  packages = JSON.parse(packagesData);
  
  if (!Array.isArray(packages)) {
    throw new Error('packages.json must contain an array of packages');
  }
  
  console.log(`Successfully loaded ${packages.length} packages`);
  
  // Validate all packages before proceeding
  if (!validateAllPackages(packages)) {
    throw new Error('Package validation failed. Please fix the errors and try again.');
  }
  
  // Create backup before proceeding with changes
  backupPackages(packagesPath);
  
} catch (error) {
  console.error('❌ Error with packages.json:', error.message);
  if (error.code === 'ENOENT') {
    console.error('File not found. Please ensure packages.json exists in the js directory.');
  }
  process.exit(1);
}

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
      
      // Create a Payment Link on Stripe with retry logic and exponential backoff
      let paymentLink;
      let retries = 0;
      const maxRetries = 3;
      const baseDelay = 1000; // Start with 1 second delay
      
      while (retries < maxRetries) {
        try {
          // Add exponential backoff delay after first attempt
          if (retries > 0) {
            const delay = baseDelay * Math.pow(2, retries - 1);
            console.log(`Retry ${retries + 1}/${maxRetries} after ${delay}ms delay...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          }

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
      
      if (error.type === 'StripeError') {
        console.error(`   Stripe error type: ${error.type}`);
        console.error(`   Raw error: ${error.raw ? JSON.stringify(error.raw) : 'N/A'}`);
        console.error(`   HTTP status: ${error.statusCode}`);
        console.error(`   Request ID: ${error.requestId}`);
      } else {
        console.error(`   Error type: ${error.type || 'Unknown'}`);
        console.error(`   Error message: ${error.message}`);
        console.error(`   Error code: ${error.code || 'N/A'}`);
        console.error(`   Stack trace: ${error.stack}`);
      }
      
      errorCount++;
      
      // Log important details for debugging
      console.error(`\nDebug information for ${pkg.name}:`);
      console.error(`   Package data: ${JSON.stringify(pkg, null, 2)}`);
      console.error(`   Current timestamp: ${new Date().toISOString()}`);
      
      // Continue with other packages even if one fails
    }
  }
  
  // Summary
  console.log(`\n=== SUMMARY ===`);
  console.log(`Total packages: ${packages.length}`);
  console.log(`Successful: ${successCount}`);
  console.log(`Errors: ${errorCount}`);
  
  // Save the updated packages.json file
  if (errorCount > 0) {
    console.log('\n⚠️ Some errors occurred. Creating error report...');
    const errorReport = {
      timestamp: new Date().toISOString(),
      totalPackages: packages.length,
      successCount,
      errorCount,
      failedPackages: packages.filter(pkg => !pkg.stripeLink)
    };
    
    // Save error report
    const errorReportPath = `${process.cwd()}/stripe-errors-${Date.now()}.json`;
    fs.writeFileSync(errorReportPath, JSON.stringify(errorReport, null, 2));
    console.log(`Error report saved to: ${errorReportPath}`);
  }

  try {
    // Validate final packages data
    if (!validateAllPackages(packages)) {
      throw new Error('Final package validation failed');
    }

    // Create a temporary file first
    const tempPath = `${packagesPath}.tmp`;
    const updatedContent = JSON.stringify(packages, null, 2);
    
    fs.writeFileSync(tempPath, updatedContent);
    
    // Verify the written content
    const verificationContent = fs.readFileSync(tempPath, 'utf8');
    if (verificationContent !== updatedContent) {
      throw new Error('File content verification failed');
    }
    
    // Rename temp file to actual file (atomic operation)
    fs.renameSync(tempPath, packagesPath);
    
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
