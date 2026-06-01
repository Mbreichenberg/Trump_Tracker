# The Human Cost — Trump Policy Death Toll Tracker

A research-backed, interactive web app tracking estimated deaths attributed to Trump administration policy decisions (Terms 1 & 2), with live counters, category filtering, and sourced policy cards.

## Quick Start (Cursor / Local Dev)

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## Project Structure

```
src/
├── data/
│   └── policies.js        ← ALL DATA LIVES HERE — add new policies here
├── hooks/
│   └── useDeathCounter.js ← Live counter logic (deaths per second)
├── components/
│   ├── PolicyCard.jsx     ← Individual policy card with expand/collapse
│   └── Term1Panel.jsx     ← Term 1 comparison section
├── App.jsx                ← Main app: filtering, counter, layout
├── main.jsx               ← React entry point
└── styles.css             ← All styles
```

## How the Real-Time Counter Works

Each policy has a `ratePerYear` field (estimated additional deaths per year).

The counter hook converts this to **deaths per millisecond** and adds the elapsed time since page load to the `deathsToDate` baseline. Updated every 100ms.

```js
const ratePerMs = ratePerYear / (365.25 * 24 * 60 * 60 * 1000);
setCount(Math.floor(base + ratePerMs * elapsed));
```

This approximates real-world ongoing mortality based on published annual rate estimates.

## Adding a New Policy (Term 2)

Open `src/data/policies.js` and add an object to `POLICIES_TERM2`:

```js
{
  id: "unique_snake_case_id",
  category: "HEALTHCARE",   // Must match a key in CATEGORIES
  title: "Policy Name",
  date: "Month Year",
  description: "2–4 sentence description of the policy and its impact.",
  deathsToDate: 50000,       // Best estimate from studies, as of writing
  deathsProjected: 200000,   // Projected deaths by projectedYear
  projectedYear: 2030,
  ratePerYear: 12000,        // Additional deaths per year — drives live counter
  sources: [
    { label: "Source Name", url: "https://..." },
  ],
},
```

## Adding a New Category

In `src/data/policies.js`, add to the `CATEGORIES` object:

```js
export const CATEGORIES = {
  // ... existing categories ...
  MY_NEW_CATEGORY: {
    id: "MY_NEW_CATEGORY",
    label: "Human-Readable Label",
    color: "#hex",   // Used for card accent, stat colors, active filter
    icon: "🏷️",
  },
};
```

Then use `"MY_NEW_CATEGORY"` as the `category` value in your policies.

## Data Sources

All death estimates are sourced from:
- Peer-reviewed journals (The Lancet, JAMA, Annals of Internal Medicine)
- UN Human Rights reports (OHCHR)
- Congressional analyses (Sherman/Meeks Committee)
- Major public health schools (Harvard, UCLA, Columbia, UC Berkeley)
- KFF (Kaiser Family Foundation)
- Environmental Protection Network (600+ former EPA workers)
- AP, NPR, The Guardian, CNN investigative reporting

Sources are linked on every policy card. Click any card to expand and view citations.

## Methodology Notes

- **Deaths to date** = published estimates from studies conducted through 2025–2026
- **Projected deaths** = modeled estimates if policies remain in place through stated year
- **Rate per year** = annual additional mortality attributed to the policy (drives live counter)
- All figures represent *excess deaths above baseline*, not total deaths in the affected domain
- Ranges are represented by midpoints or conservative estimates
- The live counter is an approximation — real-world causation is complex

## Updating Data

As new studies are published, update `deathsToDate` and `ratePerYear` in `policies.js`.
No other files need to change.
