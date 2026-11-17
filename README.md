# TechNext '28 — Website & Portal

Website and portal for **TechNext '28**, the national industrial expo and innovation showcase at VIT Vellore, held alongside ic-ETITE'28.

This is one of three websites that share one database and one login:

| Website | Repository | Local port |
| --- | --- | --- |
| ic-ETITE'28 conference | `likhithm123/website` / `ieeeitsvitscore-ai/ic-etite28` | 3000 |
| BOLT 3.0 hackathon | `IEEEITSVIT/BOLT-3.0` | 3001 |
| TechNext '28 expo | `IEEEITSVIT/TECHNEXT-3.O` | 3002 |

- **One account everywhere.** The `users` table is shared, so an account made on any of the three works on all of them. If someone tries to sign up with an email that already exists, they are sent to the login page with their email filled in and told to use their existing password (or "Forgot password?").
- **Separate admin portals.** TechNext '28's admin, CMS, payments and settings are only on this website. Admin and evaluator roles are per site (`site_roles` table); existing ic-ETITE admins (and BOLT evaluators) were copied over once when the sites were split, and from then on roles are managed separately in each site's Users page. People listed in `ADMIN_EMAILS` become admins of this site when they log in.
- **Separate payments.** This site has its own payment provider settings (Admin → Site content → Payments), its own `VIT_PAYMENT_*` keys and its own `/api/payments/callback`. It only takes payments for stall bookings.
- **Shared email.** All three use the same SMTP account (Admin → Email & SMTP, or `SMTP_*` env vars) and its daily limit is counted across all three. Each site sends its own queue.

## What's here

- `/` — the TechNext '28 page (about, gallery, expo categories, stall types, register)
- `/register` — book a stall (organisation details, stall type, representatives); admins approve, then payment opens
- `/dashboard` — my booking, payment, invoices, certificates; `/login`, `/signup`, password reset

Admin portal (`/admin`): Site content (stall types and prices, booking dates, early bird, awards, booking open/closed, announcement bar, appearance, payments, invoice template, website links), Page content (edit every text/image with live preview), Stall bookings (approve/reject, payments, emails, certificates, export), Invoices, Certificates from Excel, Users & roles, Email & SMTP.

## Run locally

```bash
npm install
cp .env.example .env.local   # same D1 gateway, SESSION_SECRET and SMTP values as ic-ETITE
npm run dev                  # http://localhost:3002
```

`.env.local` also needs:

```
NEXT_PUBLIC_SITE_URL=http://localhost:3002
NEXT_PUBLIC_ICETITE_URL=http://localhost:3000
NEXT_PUBLIC_BOLT_URL=http://localhost:3001
NEXT_PUBLIC_TECHNEXT_URL=http://localhost:3002
```

The database (Cloudflare D1 `icetite`), its migrations and the D1 gateway Worker live in the **ic-ETITE repository** (`db/migrations`, `workers/d1-gateway`). Run the gateway from there (`npx wrangler dev --config workers/d1-gateway/wrangler.toml --local --port 8788`).

## Deploy (Vercel)

1. Import this repository as a new Vercel project.
2. Environment variables: copy `D1_GATEWAY_URL`, `D1_GATEWAY_SECRET`, `SESSION_SECRET`, `SMTP_*` and `CRON_SECRET` from the ic-ETITE project (they must match: same database, same session secret for encrypted SMTP passwords). Set `NEXT_PUBLIC_SITE_URL` to this site's domain, `ADMIN_EMAILS` for this site's admins, and the `VIT_PAYMENT_*` keys for this site's gateway.
3. Deploy, attach the domain, then in **ic-ETITE's** Admin → Site content → Website links set the TechNext '28 address. Set the other two addresses here in this site's Admin → Site content → Website links.

## Code layout

Shared files (`lib/`, `components/portal`, `components/cms`, `components/admin`, auth pages, dashboard, admin portal) are kept identical in all three repositories; `lib/site.ts` says which site this is, and `SITE` switches decide what each site shows. Fix shared code in one repo and copy it to the other two.
