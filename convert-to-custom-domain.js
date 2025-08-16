const fs = require('fs');

// Custom domain configuration
const OLD_DOMAIN = 'buy.stripe.com';
const NEW_DOMAIN = 'pay.enfoldedmedia.com';

console.log('🔄 Converting Stripe links to use custom domain...');
console.log(`📤 From: ${OLD_DOMAIN}`);
console.log(`📥 To: ${NEW_DOMAIN}\n`);

try {
  // Load packages
  const packages = JSON.parse(fs.readFileSync('./js/packages.json', 'utf8'));
  console.log(`📦 Loaded ${packages.length} packages`);

  // Create backup
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  fs.writeFileSync(`./js/packages.json.backup-${timestamp}`, JSON.stringify(packages, null, 2));
  console.log(`💾 Created backup: packages.json.backup-${timestamp}`);

  let updatedCount = 0;
  let skippedCount = 0;

  // Update each package's stripe link
  packages.forEach((pkg, index) => {
    if (pkg.stripeLink && pkg.stripeLink.includes(OLD_DOMAIN)) {
      const oldLink = pkg.stripeLink;
      pkg.stripeLink = pkg.stripeLink.replace(OLD_DOMAIN, NEW_DOMAIN);
      console.log(`✅ Updated ${pkg.name}:`);
      console.log(`   Old: ${oldLink}`);
      console.log(`   New: ${pkg.stripeLink}\n`);
      updatedCount++;
    } else if (pkg.stripeLink) {
      console.log(`⏭️  Skipped ${pkg.name}: Already using custom domain or different format`);
      skippedCount++;
    } else {
      console.log(`⚠️  Skipped ${pkg.name}: No stripe link found`);
      skippedCount++;
    }
  });

  // Save updated packages
  fs.writeFileSync('./js/packages.json', JSON.stringify(packages, null, 2));
  
  console.log(`\n🎉 SUCCESS! Domain conversion completed`);
  console.log(`📊 Summary: ${updatedCount} links updated, ${skippedCount} skipped`);
  console.log(`🌐 All Stripe links now use: ${NEW_DOMAIN}`);
  
  if (updatedCount > 0) {
    console.log('\n✅ Your buy buttons should now redirect to your custom domain!');
    console.log('\n⚠️  Important: Make sure your custom domain is configured in Stripe:');
    console.log('   1. Go to https://dashboard.stripe.com/settings/branding');
    console.log('   2. Add your custom domain under "Custom checkout domain"');
    console.log('   3. Add DNS CNAME record: pay.enfoldedmedia.com -> hosted-checkout.stripecdn.com');
    console.log('   4. Wait for domain verification to complete');
  }

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
