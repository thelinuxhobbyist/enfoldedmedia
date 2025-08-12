# Stripe Payment Link Generation Setup

This repository automatically generates Stripe payment links for packages when you push to GitHub.

## How it works

1. When you push changes to the `main` branch that modify `js/packages.json`, a GitHub Action is triggered
2. The action runs `generateStripeLink.js` which:
   - Reads the packages from `js/packages.json`
   - Creates Stripe payment links for packages that don't have them
   - Updates the JSON file with the new links
   - Commits and pushes the changes back to the repository

## Setup Requirements

### 1. Stripe Account
- You need a Stripe account with API access
- Get your Stripe Secret Key from the Stripe Dashboard

### 2. GitHub Secrets
Add your Stripe Secret Key as a GitHub secret:
1. Go to your GitHub repository
2. Click on "Settings" → "Secrets and variables" → "Actions"
3. Click "New repository secret"
4. Name: `STRIPE_SECRET_KEY`
5. Value: Your Stripe Secret Key (starts with `sk_`)

### 3. Repository Permissions
The GitHub Action needs permission to push changes back to the repository:
1. Go to your GitHub repository
2. Click on "Settings" → "Actions" → "General"
3. Under "Workflow permissions", select "Read and write permissions"
4. Check "Allow GitHub Actions to create and approve pull requests"

## Testing Locally

You can test the price parsing locally:

```bash
node test-stripe.js
```

To test the full Stripe integration locally (requires Stripe Secret Key):

```bash
export STRIPE_SECRET_KEY="your_stripe_secret_key_here"
node generateStripeLink.js
```

## Troubleshooting

### Common Issues

1. **"STRIPE_SECRET_KEY environment variable is not set"**
   - Make sure you've added the secret to GitHub repository settings
   - Check that the secret name is exactly `STRIPE_SECRET_KEY`

2. **"Invalid price format"**
   - Ensure all prices in `js/packages.json` are in the format `£XX` or `£XX/month`
   - The script handles monthly prices automatically

3. **GitHub Action fails to push changes**
   - Check that workflow permissions are set to "Read and write permissions"
   - Ensure the action has permission to create commits

4. **Stripe API errors**
   - Verify your Stripe Secret Key is correct
   - Check your Stripe account has sufficient permissions
   - Ensure your Stripe account is in the correct mode (test/live)

### Debugging

Check the GitHub Actions logs for detailed error messages:
1. Go to your repository on GitHub
2. Click on "Actions" tab
3. Click on the failed workflow run
4. Check the logs for specific error messages

## File Structure

- `.github/workflows/generate-stripe-links.yml` - GitHub Action workflow
- `generateStripeLink.js` - Main script that generates Stripe links
- `test-stripe.js` - Test script for local debugging
- `js/packages.json` - Package data with Stripe links

## Price Format Support

The script supports these price formats:
- `£25` → 2500 cents
- `£100/month` → 10000 cents
- `£1,500` → 150000 cents

## Security Notes

- Never commit your Stripe Secret Key to the repository
- Always use GitHub Secrets for sensitive data
- The script only generates links for packages that don't already have them
- Each package gets a unique Stripe payment link
