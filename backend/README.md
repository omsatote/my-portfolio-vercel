# Portfolio contact API

1. Copy `.env.example` to `.env`.
2. Fill in the SMTP account, owner email, and social links.
3. Start the API with `npm run start` from this directory.

The frontend proxies `/api` to `http://localhost:3001` during Vite development. Use an app password or transactional email credential for `EMAIL_PASSWORD`; never commit `.env`.
