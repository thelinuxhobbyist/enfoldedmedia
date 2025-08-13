// Simple test to verify Stripe secret key
if (!process.env.STRIPE_SECRET_KEY) {
  console.log('❌ STRIPE_SECRET_KEY not set in environment');
  console.log('Please set it with: export STRIPE_SECRET_KEY="your_key"');
  process.exit(1);
}

console.log('✅ STRIPE_SECRET_KEY is set');
console.log('Key starts with:', process.env.STRIPE_SECRET_KEY.substring(0, 7) + '...');

// Test if it's a valid format
if (!process.env.STRIPE_SECRET_KEY.startsWith('sk_')) {
  console.log('❌ Invalid Stripe key format - should start with "sk_"');
  process.exit(1);
}

console.log('✅ Stripe key format looks valid');

// Test if it's test or live
if (process.env.STRIPE_SECRET_KEY.startsWith('sk_test_')) {
  console.log('✅ Using Stripe TEST key');
} else if (process.env.STRIPE_SECRET_KEY.startsWith('sk_live_')) {
  console.log('✅ Using Stripe LIVE key');
} else {
  console.log('❌ Unknown Stripe key format');
}

console.log('\n🎯 Your Stripe key appears to be configured correctly!');
console.log('The GitHub Actions workflow should now be able to generate payment links.');
