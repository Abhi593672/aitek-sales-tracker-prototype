# AITEK Sales Tracker — Functional Prototype

This repository contains a working, role-based prototype for AITEK's internal Sales Tracker.

## Included roles

- Key Account Manager (KAM)
- Inside Sales Team (IST)
- IST Desk Manager
- Regional Manager

## Included commercial scope

- Assigned Strategic Reseller journey
- New Reseller intake and onboarding block
- Opportunity creation and Draft handling
- Base Pipeline KAM fields and controlled dropdowns from the supplied CRO workbook
- Base Activity KAM interaction capture and replacement Next Action workflow
- System-derived stage probability and weighted pipeline
- Full commercial stages from Identified through Recovered/Paid, Lost, Dormant and Disqualified
- Mandatory Lost Reason and conditional competitor information
- Opportunity Summary, Activities, Quote Requests, Quotations, Orders and History tabs
- Quote Request submission to the IST Pool
- IST pickup and Standard/Complex/Tender classification
- New Reseller publication block and onboarding resolution
- Quotation publication and version number
- Desk Manager pool, SLA and reassignment views
- Regional pipeline and performance visibility
- Shared notifications and local audit-style state

The direct End User journey is intentionally excluded from this version.

## Run locally

Requirements: Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Open `http://localhost:3000` and select a role. Changes are stored in browser local storage, so the same records appear when switching roles. Use **Reset demo** to restore the supplied sample data.

## Recommended demonstration

1. Sign in as KAM.
2. Open Opportunities and create an Opportunity for a New Reseller.
3. Open Quotations and submit a Quote Request linked to that Opportunity.
4. Switch to IST and pick up the request.
5. Classify it as Standard, Complex or Tender.
6. Observe that publication is blocked because the New Reseller is not yet linked.
7. Open Reseller Onboarding and mark the Reseller as created and linked.
8. Return to My Assigned Requests and publish the quotation.
9. Switch to Desk Manager or Regional Manager to review the updated shared state.

## Deploy to Vercel

### From GitHub

1. Push this folder to a GitHub repository.
2. In Vercel, select **Add New Project**.
3. Import the GitHub repository.
4. Vercel detects Next.js automatically.
5. Select **Deploy**.

### With Vercel CLI

```bash
npm install
npm run build
npx vercel
```

## Prototype data and production integration

This prototype deliberately uses browser local storage. It does not connect to production authentication, AITEKCenter, Sage, Outlook or a shared database.

For production implementation, replace the local store with authenticated services while preserving these business objects:

`Reseller → Opportunity → Activity/Next Action → Quote Request → Quotation Version → Order → Invoice/Payment status`

Never store production credentials in this repository.
