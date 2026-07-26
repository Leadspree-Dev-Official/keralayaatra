# Keralayaatra - Trusted Local Kerala Travel Partner

🔗 **Live Demo:** [https://leadspree-dev-official.github.io/keralayaatra/](https://leadspree-dev-official.github.io/keralayaatra/)

Keralayaatra is a highly customized, full-stack experiential travel curation portal for exploring Kerala with absolute local trust. It bypasses middlemen and deceptive brokers by calculating outstation taxi fares dynamically using standard regional motor union rates, offering verified sustainable homestays, and compiling customized day-by-day itineraries tailored directly to your budget and interests using Google Gemini AI.

---

## 🌟 Key Features

- **Transparent Taxi Cost Planner**: Estimate multi-day or outstation trips with live calculations on standard regional state motor union tariffs. Features complete fleet classes from budget hatchbacks to luxury Tempo Travellers.
- **Handpicked Stays & Resorts**: Book certified courtyard bungalows, spice plantation treehouses, and floating houseboats directly.
- **AI Custom Tour Curation**: Powered by a local server-side integration of `Gemini 3.5 Flash`, curating custom, geographically realistic plans based on passenger count, budget tier, and travel style.
- **Local Expert Live Chat Guide**: An interactive chat assistant to ask about authentic culinary highlights (e.g., Karimeen, Appam and Stew), regional safety, weather conditions, or local sights.
- **Unified Trip Dashboard**: Localized offline storage of active bookings, packing checklist calculators, and travel voucher printing.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React (v19) with TypeScript & Vite, styled elegantly with Tailwind CSS.
- **Icons**: Lucide React.
- **Backend**: Node.js & Express API proxy.
- **AI Engine**: Official `@google/genai` TypeScript SDK (server-side client, keeping API keys completely hidden from browsers).
- **Animation**: Motion (`motion/react`).

---

## 👥 Credits

- **Developer**: Aniruddha Das
- **Developed by**: [LeadSpree Business Solutions](https://leadspree.in)

---

## 🚀 Local Quickstart

### Prerequisites

- Node.js (v18+)
- npm

### 1. Clone & Install Dependencies

```bash
git clone <your-repo-url>
cd keralayaatra
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory by copying the example:

```bash
cp .env.example .env
```

Open `.env` and configure your environment variables (see `.env.example` for reference).

### 3. Run Development Server

```bash
npm run dev
```

The application will launch on port `3000` at `http://localhost:3000`.

### 4. Build for Production

```bash
npm run build
```

This compiles both the React frontend and bundles the Express server into `dist/server.cjs` via esbuild.

### 5. Start Production Server

```bash
npm run start
```

---

## 📝 License

Developed with care by [LeadSpree Business Solutions](https://leadspree.in). All rights reserved.
