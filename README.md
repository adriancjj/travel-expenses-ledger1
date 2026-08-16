# Travel Expenses Ledger

A lightweight, single-page web application for tracking shared travel expenses across multiple trips and team members.

## Overview

**Travel Expenses Ledger** is a clean, modern expense management tool designed for travel teams, project groups, and shared cost tracking. It helps groups track who paid what, who owes whom, and settle balances fairly and transparently.

### Key Features

- **Trip Management** – Create and organize trips with associated team members
- **Expense Recording** – Log payments in any currency with automatic rate conversion to a base currency (MYR)
- **Split Tracking** – Allocate expenses equally or customize split amounts per team member
- **Daily Reports** – View daily settlement summaries and who owes/should receive
- **Automated Settlement** – See payment flow recommendations to settle all debts efficiently
- **Cloud Persistence** – Sync state to Cloudflare D1 for multi-device access (optional)

## Tech Stack

- **Frontend:** Pure HTML + inline vanilla JavaScript (no framework)
- **Backend:** Cloudflare Workers + D1 (SQLite at the edge)
- **Deployment:** Static HTML with optional Worker integration

## Project Structure

```
travel-expenses-ledger/
├── index.html              # All UI and application logic
├── _worker.js              # Cloudflare Worker (optional cloud sync)
├── schema.sql              # D1 database schema for cloud persistence

```

## Quick Start

### Local Usage (No Server)

1. Open `index.html` in a modern browser
2. Create trips and add team members
3. Log expenses and record splits
4. View daily settlement reports

All data is stored in browser localStorage by default.


### Cloud Sync (Optional)

To enable Cloudflare D1 cloud sync:

1. Deploy `_worker.js` to Cloudflare Workers
2. Create a D1 database and execute `schema.sql`
3. Set the `ACCOUNT_ID`, `DATABASE_ID`, and `API_TOKEN` in the Worker environment
4. Update the `/api/state` fetch URL in `index.html` to point to your Worker

## Core Functionality

### Trips
- Create named trips with a list of team members
- Edit trip member lists after creation
- Delete trips (preserves existing payment records)

### Payments
- Log income or expense transactions
- Support multiple currencies with editable exchange rates
- Attach payments to specific trips
- Split expenses equally or customize per-person amounts

### Daily Reports
- View settlement status for a given date
- See who paid, who owes, who should receive
- Record partial or full paybacks
- Auto-generate payment flow instructions

## Browser Support

- Chrome/Chromium (latest)
- Edge (latest)
- Firefox (latest)
- Safari (latest)

Requires localStorage support and ES2020+ JavaScript features.

## License

MIT

## Contributing

This is a reference implementation for shared expense tracking. Feel free to fork, modify, and adapt for your team's needs.

---

**Note:** This is a proof-of-concept single-file app. For production use with large datasets or teams, consider:
- Separating concerns into modules
- Adding proper authentication
- Implementing server-side validation
- Adding data export/import features
