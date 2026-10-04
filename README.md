# NEXORA

## Contact-form backend

The contact form submits to the Vercel serverless endpoint at `/api/contact`.

Before deploying, create a [Resend](https://resend.com) API key and add it to Vercel as `RESEND_API_KEY`. For professional branded sending, verify a domain in Resend and add `EMAIL_FROM`, for example `NEXORA <hello@yourdomain.com>`.

The endpoint always delivers enquiries to `nexorabuisnessdigital@gmail.com`; the visitor's email is set as the reply-to address.
