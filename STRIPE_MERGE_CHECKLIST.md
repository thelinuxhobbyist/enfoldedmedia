# Stripe Integration Pre-Merge Checklist

## Integration Points
1. Cloudflare Pages Functions:
   - [x] /api/create-checkout-session.js (new checkout flow)
   - [x] Existing webhook at /api/stripe-webhook-github

## Environment Variables (Cloudflare)
- [x] STRIPE_PUBLISHABLE_KEY
- [x] STRIPE_SECRET_KEY
- [x] STRIPE_WEBHOOK_SECRET

## Revert Plan
If issues occur after merge:

1. Quick Revert:
```bash
git revert [STRIPE INTEGRATION CHECKPOINT commit hash]
git push origin main
```

2. Manual Revert Steps:
- Switch back to payment links branch
- Restore GitHub Actions workflow
- Re-enable old webhook handling

## Testing Plan
1. Test new checkout flow on stripe-elements branch
2. Verify webhook forwarding
3. Test existing payment links still work
4. Monitor error logs after merge

## Emergency Contacts
- Keep Stripe Dashboard open: https://dashboard.stripe.com/test/logs
- Monitor Cloudflare Functions logs
- Watch GitHub Actions logs
