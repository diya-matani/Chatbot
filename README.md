# WizKlub Chatbot Prototype

A **working chatbot prototype** for [WizKlub.com](https://wizklub.com) that engages visitors, qualifies leads (Parents vs Schools), collects contact details, and drives demo bookings.

## Features

- **Dual user flows**: Parent (exploring STEM programs) and School (partnership interest)
- **Structured qualification**: Child age/interest (parents); school name, role, grades, reach (schools)
- **Lead capture**: Name, phone, email, user type — all stored and visible in the Leads dashboard
- **Lead scoring**: Rule-based score (0–100%) from qualification answers; shown in dashboard
- **Conversion CTA**: “Book a demo” / “Just call me” with confirmation and optional demo link
- **Dashboard**: View all captured leads (stored in browser for prototype; ready for CRM integration)

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Click the chat button (bottom right) and go through either **Parent** or **School** flow.

## Deploy (shareable link)

### Vercel (recommended)

1. Push this repo to GitHub.
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → Import your repo.
3. Leave build settings as default (Vite): **Build command** `npm run build`, **Output directory** `dist`.
4. Deploy. Your chatbot will be live at `https://your-project.vercel.app`.

### Netlify

1. Push to GitHub.
2. In Netlify: **Add new site** → **Import from Git** → choose repo.
3. Build command: `npm run build`, Publish directory: `dist`.
4. Deploy. Share the Netlify URL.

## Project structure

```
Chatbot/
├── src/
│   ├── App.jsx              # Landing + nav + dashboard view
│   ├── Dashboard.jsx        # Leads table (CRM mockup)
│   ├── chat/
│   │   ├── conversationEngine.js  # Rule-based flow, steps, lead scoring, save
│   │   ├── ChatWidget.jsx   # FAB + chat window
│   │   ├── MessageList.jsx  # Messages + typing + quick replies
│   │   ├── MessageBubble.jsx
│   │   ├── QuickReplies.jsx
│   │   └── ChatInput.jsx
│   └── index.css
├── index.html
├── package.json
└── README.md
```

## CRM integration (production)

Leads are currently saved to `localStorage` under the key `wizklub_leads`. To plug into a CRM or backend:

1. In `conversationEngine.js`, replace or complement `saveLead(lead)` with a `fetch()` call to your API, e.g. `POST /api/leads`.
2. In `Dashboard.jsx`, replace `getLeads()` with an API call to `GET /api/leads` (or use the same backend and sync localStorage for demo).

## Optional enhancements

- **AI-powered replies**: Add an optional step that sends the last user message to an LLM API (e.g. OpenAI) for context-aware answers before continuing the flow.
- **Webhook**: Add a serverless function (e.g. Vercel serverless) that receives lead payloads and forwards to Zapier/Make/CRM.

---

Built for WizKlub visitor engagement and demo booking conversion.
