# CURSOR PROMPT: Implement Per-Policy Projection Models with UI Dropdowns

## CONTEXT

This is a React + Vite app (`npm run dev` → localhost:5173) that tracks estimated deaths from Trump administration policy decisions. It uses a live real-time counter driven by a flat `ratePerYear` field on each policy. 

The core problem: **a single flat annual rate is scientifically wrong for most policy categories.** Different policies have fundamentally different mortality curves. This prompt asks you to implement a proper multi-model projection system with a user-facing dropdown on each policy card.

---

## THE PROBLEM WITH FLAT RATES

Here's how each category actually behaves over time, based on the research literature:

### 🌿 ENVIRONMENT / CLIMATE (`exponential`)
Climate-related deaths accelerate with warming. Each degree Celsius of additional warming increases mortality from heat stress, extreme weather, crop failure, and displacement nonlinearly. The IPCC AR6 and Lancet Countdown both model this as compounding. A flat rate dramatically understates harm after ~2030.
- **Formula:** `deaths(year) = ratePerYear * growthFactor^(year - startYear)`
- **Default growth factor for climate policies:** `1.07` (7% annual increase, consistent with Lancet Countdown on Health and Climate Change 2023)
- **Source basis:** Burke et al. (2018) Nature, Vicedo-Cabrera et al. (2021) Nature Climate Change

### 💉 VACCINES / INFECTIOUS DISEASE (`threshold`)
Vaccine-preventable disease deaths don't scale linearly — they follow epidemic threshold logic. When vaccination coverage drops below herd immunity thresholds (measles: ~95%, polio: ~85%), outbreaks can become self-sustaining and deaths spike nonlinearly. Below the threshold, rate is low. Once crossed, deaths can multiply 10-50x rapidly.
- **Formula:** Two-phase: slow baseline until coverage threshold crossed, then exponential outbreak phase
- **Default threshold coverage for measles:** 95%; current U.S. coverage trending toward ~88% by 2027 per CDC trajectory
- **Source basis:** Fine et al. (2011) Clinical Infectious Diseases; CDC MMWR measles outbreak modeling

### 🌍 FOREIGN AID / USAID (`frontLoaded`)  
Aid-dependent populations who were already on medication or food assistance die quickly when aid stops. The largest mortality pulse happens in year 1-2, then tapers as populations who could adapt do, and those who couldn't have already died.
- **Formula:** `deaths(year) = baseRate * decayFactor^(year - startYear)` where decayFactor < 1
- **Default decay factor:** `0.82` (18% annual reduction after initial pulse)
- **Source basis:** Lancet study (July 2025), UCLA Fielding School modeling (Sherman/Meeks report)

### 🏥 DOMESTIC HEALTHCARE — Medicaid/ACA/SNAP (`lagged`)
When people lose health insurance, they don't die immediately. They delay care, conditions worsen, and mortality increases 1-3 years later. Studies of prior Medicaid expansions/contractions show a ~18-month average lag before the mortality signal becomes statistically detectable.
- **Formula:** Rate ramps from 0 to full rate over a 3-year lag period, then plateaus
- **Default ramp period:** 36 months
- **Source basis:** Sommers et al. (2012, 2017) NEJM; Garthwaite et al. (2019) Journal of Health Economics

### 💣 IRAN WAR (`historical`)
The ceasefire was signed in April 2026. This is a concluded historical event with a documented body count. The counter should NOT advance for these policies — they display a fixed, sourced number.
- **Formula:** Static. `deaths = deathsToDate`. ratePerYear = 0.
- **Applies to:** `iran_us_strikes`, `iran_civilian`, `iran_lebanon`, `us_service_members`

### 🚧 IMMIGRATION (`lagged`)
Similar to healthcare — deportees don't die immediately. Deaths from lack of medical care, dangerous conditions in receiving countries, and violence manifest over months to years.
- **Default ramp period:** 24 months

### 🌪️ DISASTER PREP (`exponential`)  
Like climate, disaster preparedness failures compound. A degraded NWS or FEMA is more catastrophic each year as climate makes extreme events more frequent.
- **Default growth factor:** `1.04` (4% annual increase)

### 🏥 HEALTHCARE — Opioids, NIH/CDC cuts (`flat`)
Opioid deaths and research funding gaps have a more stable annual toll that doesn't cleanly fit accelerating or decaying patterns given the many confounding factors. Use flat rate as default but allow user to override.

---

## WHAT TO BUILD

### 1. Update `src/data/policies.js`

Add two new fields to **every policy object**:

```js
projectionModel: "frontLoaded",  // default model (see options below)
modelParams: {
  // model-specific parameters — only include what's relevant to the model
  decayFactor: 0.82,      // for frontLoaded
  growthFactor: 1.07,     // for exponential  
  lagMonths: 36,          // for lagged
  thresholdCoverage: 0.95 // for threshold (vaccines only)
},
```

**Assign each policy its scientifically appropriate default** based on the research above. Be specific — don't just give everything the same model. Here are the correct defaults per policy ID:

| Policy ID | Default Model | Key Param |
|---|---|---|
| `usaid_shutdown` | `frontLoaded` | decayFactor: 0.82 |
| `hiv_aids_cuts` | `frontLoaded` | decayFactor: 0.80 |
| `malaria_tb_cuts` | `frontLoaded` | decayFactor: 0.84 |
| `child_nutrition_cuts` | `frontLoaded` | decayFactor: 0.78 |
| `who_withdrawal` | `exponential` | growthFactor: 1.05 |
| `epa_rollbacks` | `exponential` | growthFactor: 1.07 |
| `power_plant_rules` | `exponential` | growthFactor: 1.07 |
| `endangerment_finding` | `exponential` | growthFactor: 1.10 |
| `clean_water_rollback` | `flat` | — |
| `medicaid_cuts` | `lagged` | lagMonths: 36 |
| `snap_cuts` | `lagged` | lagMonths: 24 |
| `nih_cuts` | `lagged` | lagMonths: 48 |
| `cdc_cuts` | `lagged` | lagMonths: 30 |
| `hhs_layoffs` | `lagged` | lagMonths: 18 |
| `aca_subsidy_cuts` | `lagged` | lagMonths: 24 |
| `drug_treatment_cuts` | `flat` | — |
| `nursing_home_staffing` | `lagged` | lagMonths: 24 |
| `vaccine_undermining` | `threshold` | thresholdCoverage: 0.95 |
| `pandemic_preparedness` | `exponential` | growthFactor: 1.08 |
| `bird_flu` | `exponential` | growthFactor: 1.15 |
| `iran_us_strikes` | `historical` | — |
| `iran_civilian` | `historical` | — |
| `iran_lebanon` | `historical` | — |
| `us_service_members` | `historical` | — |
| `mass_deportation` | `lagged` | lagMonths: 18 |
| `immigrant_healthcare_cuts` | `lagged` | lagMonths: 24 |
| `fema_cuts` | `exponential` | growthFactor: 1.04 |
| `nws_noaa_cuts` | `exponential` | growthFactor: 1.04 |
| `ncar_elimination` | `exponential` | growthFactor: 1.06 |

---

### 2. Create `src/utils/projectionModels.js`

This file contains the math for each model. Implement these pure functions:

```js
// Returns projected deaths for a given policy from startYear to endYear
// given its model type and params

export const PROJECTION_MODELS = {
  flat: {
    label: "Flat Rate",
    description: "Constant annual deaths — appropriate when no strong trend is expected.",
    calculate: (policy, yearsAhead) => {
      return policy.ratePerYear * yearsAhead;
    },
    // Deaths per second for live counter
    rateNow: (policy, yearsElapsed) => policy.ratePerYear,
  },

  exponential: {
    label: "Exponential Growth",
    description: "Deaths increase by a fixed % each year — appropriate for climate and compounding systemic failures.",
    calculate: (policy, yearsAhead) => {
      const g = policy.modelParams?.growthFactor ?? 1.05;
      // Sum of geometric series: r * (g^n - 1) / (g - 1)
      return policy.ratePerYear * ((Math.pow(g, yearsAhead) - 1) / (g - 1));
    },
    rateNow: (policy, yearsElapsed) => {
      const g = policy.modelParams?.growthFactor ?? 1.05;
      return policy.ratePerYear * Math.pow(g, yearsElapsed);
    },
  },

  frontLoaded: {
    label: "Front-Loaded Decay",
    description: "Deaths peak in year 1–2 and decline as populations adapt or die — appropriate for sudden aid cuts.",
    calculate: (policy, yearsAhead) => {
      const d = policy.modelParams?.decayFactor ?? 0.85;
      // Sum of decaying geometric series
      let total = 0;
      for (let i = 0; i < yearsAhead; i++) {
        total += policy.ratePerYear * Math.pow(d, i);
      }
      return total;
    },
    rateNow: (policy, yearsElapsed) => {
      const d = policy.modelParams?.decayFactor ?? 0.85;
      return policy.ratePerYear * Math.pow(d, yearsElapsed);
    },
  },

  lagged: {
    label: "Lagged Ramp",
    description: "Deaths ramp up over months as people lose care and conditions worsen — appropriate for insurance and healthcare cuts.",
    calculate: (policy, yearsAhead) => {
      const lagYears = (policy.modelParams?.lagMonths ?? 24) / 12;
      // Ramp linearly to full rate over lagYears, then flat
      let total = 0;
      for (let i = 0; i < yearsAhead; i++) {
        const rampFactor = Math.min(1, i / lagYears);
        total += policy.ratePerYear * rampFactor;
      }
      return total;
    },
    rateNow: (policy, yearsElapsed) => {
      const lagYears = (policy.modelParams?.lagMonths ?? 24) / 12;
      return policy.ratePerYear * Math.min(1, yearsElapsed / lagYears);
    },
  },

  threshold: {
    label: "Epidemic Threshold",
    description: "Deaths stay low until vaccine coverage drops below herd immunity threshold, then spike — appropriate for vaccine-preventable diseases.",
    calculate: (policy, yearsAhead) => {
      // Model: coverage drops 1% per year from current ~92%, threshold at 95% already breached for measles
      // Below threshold: outbreaks grow exponentially
      const startCoverage = 0.92;
      const threshold = policy.modelParams?.thresholdCoverage ?? 0.95;
      const coverageDropPerYear = 0.012;
      let total = 0;
      for (let i = 0; i < yearsAhead; i++) {
        const coverage = Math.max(0.5, startCoverage - coverageDropPerYear * i);
        const belowThreshold = Math.max(0, threshold - coverage);
        // Exponential outbreak risk below threshold
        const outbreakMultiplier = coverage < threshold ? Math.pow(1 + belowThreshold * 5, i * 0.5) : 0.1;
        total += policy.ratePerYear * outbreakMultiplier;
      }
      return total;
    },
    rateNow: (policy, yearsElapsed) => {
      const startCoverage = 0.92;
      const threshold = policy.modelParams?.thresholdCoverage ?? 0.95;
      const coverage = Math.max(0.5, startCoverage - 0.012 * yearsElapsed);
      if (coverage >= threshold) return policy.ratePerYear * 0.1;
      const belowThreshold = threshold - coverage;
      return policy.ratePerYear * Math.pow(1 + belowThreshold * 5, yearsElapsed * 0.5);
    },
  },

  historical: {
    label: "Historical (Concluded)",
    description: "A concluded event with a fixed documented death toll. Counter does not advance.",
    calculate: (policy, yearsAhead) => 0,
    rateNow: (policy, yearsElapsed) => 0,
  },
};

export const MODEL_OPTIONS = Object.entries(PROJECTION_MODELS).map(([key, val]) => ({
  value: key,
  label: val.label,
  description: val.description,
}));
```

---

### 3. Update `src/hooks/useDeathCounter.js`

Replace the flat-rate logic with model-aware calculation:

- Import `PROJECTION_MODELS` from `projectionModels.js`
- Accept a `policyModels` object: `{ [policyId]: modelKey }` — user's per-policy overrides
- For each policy, use `policyModels[policy.id] ?? policy.projectionModel` to pick the model
- Call `model.rateNow(policy, yearsElapsed)` to get the current instantaneous rate
- Sum across all active policies for the live counter
- Also export a `calculateProjectedTotal(policies, policyModels, targetYear)` function that sums `model.calculate()` across all policies for the projected total display

The `yearsElapsed` for each policy should be calculated from a `startYear` field on the policy (add `startYear: 2025` to all Term 2 policies in `policies.js`).

---

### 4. Update `src/components/PolicyCard.jsx`

Add a **model dropdown** to each expanded policy card:

```jsx
// When the card is expanded, show:
<div className="model-selector">
  <label className="model-label">Projection Model:</label>
  <select
    value={currentModel}  // from props or parent state
    onChange={e => onModelChange(policy.id, e.target.value)}
    className="model-select"
  >
    {MODEL_OPTIONS.map(opt => (
      <option key={opt.value} value={opt.value}>{opt.label}</option>
    ))}
  </select>
  <p className="model-description">
    {PROJECTION_MODELS[currentModel].description}
  </p>
</div>
```

- Default value = `policy.projectionModel` (the scientifically assigned default)
- When user changes it, call `onModelChange(policyId, newModel)` which bubbles up to App state
- The live counter and projected totals recalculate immediately on change
- Add a small badge on the card header showing the active model name (e.g. "📈 Exponential")

---

### 5. Update `src/App.jsx`

Add state for per-policy model overrides:

```js
const [policyModels, setPolicyModels] = useState({});
// policyModels: { [policyId]: "exponential" | "flat" | etc }
// Empty = use policy defaults

function handleModelChange(policyId, modelKey) {
  setPolicyModels(prev => ({ ...prev, [policyId]: modelKey }));
}
```

- Pass `policyModels` and `handleModelChange` down to PolicyCard
- Pass `policyModels` to `useDeathCounter`
- Add a **"Reset All Models to Defaults"** button in the filter bar
- Show a subtle indicator when any policy is using a non-default model (e.g. "⚠️ 3 models overridden")

---

### 6. CSS additions for `src/styles.css`

Add styles for:

```css
.model-selector { /* container for the dropdown section */ }
.model-label { /* "Projection Model:" label — mono font, muted */ }
.model-select { /* dark styled select dropdown matching app theme */ }
.model-description { /* italic, muted, small text explaining the model */ }
.model-badge { /* small pill on card header showing current model */ }
```

Style the select to match the dark theme — dark background, red focus border, no system chrome.

---

## IMPORTANT NOTES FOR CURSOR

1. **Don't flatten the model back to flat rate** — the whole point is that defaults are scientifically differentiated. Resist any temptation to simplify.

2. **The threshold model for vaccines is the most complex** — make sure `yearsElapsed` is calculated correctly as a float (not just integer years) so the live counter ticks smoothly.

3. **Historical policies (Iran war) must have rateNow = 0** — their counter contribution is exactly `deathsToDate`, no more.

4. **The projected total shown in the hero** should recalculate based on each policy's `projectedYear` field, not a fixed time horizon. Use `targetYear = policy.projectedYear` when calling `calculate()`.

5. **Preserve the existing UI aesthetic** — dark theme, IBM Plex fonts, red/amber palette. The dropdown should feel native to the design, not like a browser default.

6. **Add `startYear` to all policies** — Term 2 policies use `startYear: 2025`, Term 1 use their actual start year (2017, 2018, 2020, etc.).

7. **Export a `getEffectiveModel(policy, policyModels)` helper** from `projectionModels.js` that returns the model key, for use across components.

---

## TESTING CHECKLIST

After implementing, verify:
- [ ] Climate/environment policies show higher projected totals than flat-rate would give (exponential should grow)
- [ ] USAID deaths show highest death count in year 1, declining thereafter
- [ ] Medicaid deaths show near-zero in month 1, ramping to full rate by month 36
- [ ] Vaccine policy counter accelerates noticeably over time (not linear)  
- [ ] Iran war counter does not tick upward — shows fixed number only
- [ ] Changing a dropdown immediately updates both the live counter and projected total
- [ ] "Reset to defaults" restores all scientifically assigned models
- [ ] Model badge updates when dropdown changes
