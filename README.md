# Fried & Furious — Full App (Backend + Frontend)

This package contains a full-stack app:
- Backend: Node + Express + SQLite + Stripe (webhook) for payments
- Frontend: React + Vite
- Authentication (simple email/password), loyalty points (1 point per £1)
- Stripe Checkout integration — supports Apple Pay & Google Pay when Stripe and domain verification are configured.

## Important - Stripe setup (required)
1. Create a Stripe account and get your **Secret Key** (set as environment variable STRIPE_SECRET_KEY).
2. Configure a webhook endpoint in Stripe pointing to: `https://YOUR_BACKEND_DOMAIN/webhook` and set **STRIPE_WEBHOOK_SECRET** in env.
3. Apple Pay: verify your domain in Stripe dashboard (required to enable Apple Pay). Stripe provides the verification file to place on your site.
4. Set environment variables in a `.env` file in `backend/`:
```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
JWT_SECRET=choose_a_secret
BASE_URL=http://localhost:5173
SUCCESS_URL=http://localhost:5173/?success=1
CANCEL_URL=http://localhost:5173/?cancel=1
```

## Run locally
1. Backend:
   ```
   cd backend
   npm install
   npm run init-db
   npm run dev
   ```
2. Frontend:
   ```
   cd ../frontend
   npm install
   npm run dev
   ```

## How payments & points work
- Frontend sends cart to `/api/create-checkout-session` (user must be signed in).
- Backend creates Stripe Checkout session and a pending order row.
- After successful payment, Stripe calls `/webhook` with `checkout.session.completed`.
- Webhook marks order paid and awards points (1 point per £1 spent).
- User can fetch their points with `/api/me`.

## Notes
- Apple Pay / Google Pay availability depends on Stripe configuration and domain verification.
- This is a prototype: for production, secure keys, validate inputs, use HTTPS and proper CORS, and consider stronger auth/session handling.
