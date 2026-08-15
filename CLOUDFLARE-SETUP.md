# Cloudflare Pages + D1 setup

1. In Cloudflare, open **Storage & Databases > D1 SQL Database** and create a database named `travel-expenses-ledger`.
2. Open that database's **Console**, paste the contents of `schema.sql`, and run it.
3. Open **Workers & Pages**, select your existing Pages project, then open **Settings > Bindings**.
4. Add a **D1 database binding** with variable name `DB` and select the database created above.
5. Open **Settings > Variables and Secrets**. Add `APP_PASSWORD`, choose **Encrypt**, and enter a strong shared password. Do not put this password in any uploaded file.
6. Create a new **Production** deployment and upload the entire `travel-expenses-ledger` folder or the provided ZIP. It must include `index.html`, `_worker.js`, and `schema.sql`.
7. Open the `pages.dev` site. Enter the shared password when prompted. Use the same URL and password on every device.

Cloudflare requires a new deployment after adding bindings or secrets. Existing browser-only data is not automatically migrated; add it again after cloud storage connects.
