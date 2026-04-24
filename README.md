# Indo Trends 🇮🇩

Daily AI-powered social media trend dashboard for the Indonesian market. Covers TikTok, Instagram, and X/Twitter with platform-specific insights, viral patterns, and actionable content ideas.

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Claude API** (claude-sonnet-4-20250514) via Anthropic
- **Deployed on Vercel**

---

## Setup locally

**1. Clone the repo**
```bash
git clone https://github.com/YOUR_USERNAME/indo-trends.git
cd indo-trends
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Anthropic API key:
```
ANTHROPIC_API_KEY=sk-ant-...
```

Get your API key at: https://console.anthropic.com

**4. Run dev server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel

### Option A — Vercel CLI (fastest)

```bash
npm i -g vercel
vercel
```

Follow the prompts. When asked about environment variables, add `ANTHROPIC_API_KEY`.

### Option B — Vercel Dashboard (via GitHub)

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repo
4. Under **Environment Variables**, add:
   - Key: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-...` (your key from console.anthropic.com)
5. Click **Deploy**

Vercel auto-detects Next.js — no extra config needed.

---

## Project structure

```
indo-trends/
├── app/
│   ├── api/
│   │   └── trends/
│   │       └── route.ts      ← API route (calls Claude)
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx              ← Main dashboard UI
│   └── page.module.css
├── .env.example
├── .gitignore
├── next.config.js
├── package.json
└── tsconfig.json
```

---

## Notes

- The API route uses **Edge Runtime** for low latency
- Trend data is AI-generated (not real-time scraping) — accuracy improves with more specific platform filters
- History is stored in-memory (resets on page refresh) — for persistent history, connect a DB like Supabase or Upstash

---

Built with Claude by Anthropic.
