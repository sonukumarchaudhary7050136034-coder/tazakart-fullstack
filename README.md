# TazaKart — Full Stack Grocery E-commerce

A Blinkit-style grocery delivery app with **User Panel** (customer shopping) and
**Admin Panel** (store management) — built with Next.js + TypeScript + Tailwind
(frontend) and FastAPI + MySQL + JWT auth (backend).

## Folder structure

```
grocery-app/
├── frontend/     Next.js app (user panel + admin panel, same app)
└── backend/      FastAPI app (REST API + MySQL)
```

## Prerequisites

- Node.js 18+
- Python 3.10+
- MySQL or MariaDB server

## 1. Backend setup

```bash
copy .env.example .env
python seed.py
python -m uvicorn app.main:app --reload --port 8000


# Make sure MySQL is running, then create DB + user:
mysql -u root -e "
  CREATE DATABASE tazakart CHARACTER SET utf8mb4;
  CREATE USER 'tazakart_user'@'localhost' IDENTIFIED BY 'TazaKart@2026';
  GRANT ALL PRIVILEGES ON tazakart.* TO 'tazakart_user'@'localhost';
  FLUSH PRIVILEGES;
"

# Seed categories, products and a default admin account
python3 seed.py

# Start the API
python3 -m uvicorn app.main:app --reload --port 8000
```

API runs at `http://localhost:8000`. Interactive docs at `http://localhost:8000/docs`.

**Default admin login:** `admin@tazakart.com` / `Admin@123`

To use a different DB host/password, set env vars before running:
```bash
export DB_USER=tazakart_user
export DB_PASSWORD='TazaKart@2026'
export DB_HOST=localhost
export DB_NAME=tazakart
export JWT_SECRET=your-random-secret-key   # change in production!
```

## 2. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:3000` (or 3456 if configured). It reads the
API URL from `.env.local` — `NEXT_PUBLIC_API_URL=http://localhost:8000`.

## Routes

**Customer (User Panel):**
- `/` — home, category grid
- `/category/[slug]` — subcategory sidebar + product grid
- `/product/[id]` — product detail
- `/login` — Email OTP + Continue with Google (see "Login setup" below)
- `/checkout/address` — delivery address
- `/checkout` — order summary, payment method, place order
- `/orders` — order history

**Admin Panel** (hidden from customers, separate login):
- `/admin/login`
- `/admin/dashboard`
- `/admin/products` — add/edit/delete products
- `/admin/categories` — add categories & subcategories
- `/admin/orders` — change order status
- `/admin/users` — block/unblock customers
- `/admin/coupons`, `/admin/banners`, `/admin/settings`

## Notes / what's still a placeholder

- **Payment**: Cash on Delivery works end-to-end. UPI/Card are selectable but
  don't call a real payment gateway yet — plug in Razorpay/Stripe in
  `app/routers/orders_router.py` when ready.
- **Product images**: original placeholder SVGs (no copyrighted logos/brands).
  Replace files in `frontend/public/products/` with real photos — same
  filenames, and update `image` paths via the admin panel or `seed.py`.
- **File uploads**: `POST /api/products/upload-image` saves to
  `backend/app/static/products/` — wire the admin "Add Product" image input
  to call it for production use (currently the form field is present but not
  yet connected to this endpoint).

## Login setup (Email OTP + Google)

Copy `backend/.env.example` to `backend/.env` and fill it in. Restart the backend after any change.

**Without any setup**, Email OTP still works in dev mode: the OTP is printed in the
backend terminal and shown on the login screen. Google button stays hidden until
`GOOGLE_CLIENT_ID` is set.

### A) Email OTP via Gmail (real emails)
1. Use a Gmail account for the store -> Google Account -> Security -> turn on **2-Step Verification**.
2. Search "App passwords" in Google Account -> create one (name: TazaKart) -> copy the 16-char password.
3. In `.env`: `SMTP_USER=yourstore@gmail.com`, `SMTP_PASSWORD=<16-char app password>`.
4. Done — OTPs now arrive in the user's inbox. (Gmail limit ~500 mails/day; for scale use Brevo / Amazon SES / Resend SMTP — only the 3 SMTP_* values change.)

### B) Google Login
1. Go to https://console.cloud.google.com -> create project "TazaKart".
2. APIs & Services -> **OAuth consent screen** -> External -> app name, support email -> Save.
3. APIs & Services -> **Credentials** -> Create Credentials -> **OAuth client ID** -> type **Web application**.
4. Authorized JavaScript origins: `http://localhost:3000` (add your real domain when you deploy, e.g. `https://tazakart.com`). Redirect URIs: not needed.
5. Copy the **Client ID** into `.env` as `GOOGLE_CLIENT_ID`. Restart backend. The button appears automatically.

### Upgrading an existing database (if you ran the previous version)
```sql
ALTER TABLE users MODIFY mobile VARCHAR(15) NULL;
ALTER TABLE users ADD COLUMN google_id VARCHAR(64) NULL UNIQUE,
                  ADD COLUMN auth_provider VARCHAR(20) DEFAULT 'email',
                  ADD COLUMN is_email_verified BOOLEAN DEFAULT FALSE;
```
(The new `email_otps` table is created automatically on backend start. Or simply drop & recreate the DB and run `python3 seed.py`.)
