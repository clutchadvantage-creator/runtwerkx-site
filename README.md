# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

## Consult Request Submission Pipeline

Consult requests now post to `POST /api/consult-request` and are delivered server-side through Resend.

1. Copy `.env.example` to `.env` and set:
	- `RESEND_API_KEY`
	- `CONSULT_TO_EMAIL`
	- `CONSULT_FROM_EMAIL`
2. Configure a verified sender domain in Resend and use that address for `CONSULT_FROM_EMAIL`.
3. Deploy the app to Vercel so the `api/consult-request.js` function is available.

The customer never opens an email app or downloads a package manually. The server generates the PDF dossier and attaches it directly to the consultation email.

Manual setup notes:

1. In Resend, verify the sending domain and create a production sender.
2. In Vercel, add the three environment variables above to the project settings.
3. Ensure the Vercel deployment exposes the `api/consult-request` serverless function.
4. If you later add Cloudflare Turnstile, pass the token through the existing request payload `security.turnstileToken` field.
