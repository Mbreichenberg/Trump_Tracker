// projectionModels.js
// Per-policy mortality projection models. Each model exposes:
//   calculate(policy, yearsAhead) → cumulative deaths from the policy's
//     start over `yearsAhead` years (used for projected totals / slider).
//   rateNow(policy, yearsElapsed) → instantaneous deaths/year at a given
//     point in time (used to drive the live counter).
// All functions are pure.

export const PROJECTION_MODELS = {
  flat: {
    label: "Flat Rate",
    badge: "Flat",
    icon: "➖",
    description:
      "Constant annual deaths — appropriate when no strong trend is expected.",
    calculate: (policy, yearsAhead) => {
      return policy.ratePerYear * yearsAhead;
    },
    rateNow: (policy) => policy.ratePerYear,
  },

  exponential: {
    label: "Exponential Growth",
    badge: "Exponential",
    icon: "📈",
    description:
      "Deaths increase by a fixed % each year — appropriate for climate and compounding systemic failures.",
    calculate: (policy, yearsAhead) => {
      const g = policy.modelParams?.growthFactor ?? 1.05;
      if (g === 1) return policy.ratePerYear * yearsAhead;
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
    badge: "Front-Loaded",
    icon: "📉",
    description:
      "Deaths peak in year 1–2 and decline as populations adapt or die — appropriate for sudden aid cuts.",
    calculate: (policy, yearsAhead) => {
      const d = policy.modelParams?.decayFactor ?? 0.85;
      // Continuous sum of a decaying rate over the window.
      let total = 0;
      const steps = Math.max(1, Math.ceil(yearsAhead * 12));
      const dt = yearsAhead / steps;
      for (let i = 0; i < steps; i++) {
        const t = i * dt;
        total += policy.ratePerYear * Math.pow(d, t) * dt;
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
    badge: "Lagged",
    icon: "⏳",
    description:
      "Deaths ramp up over months as people lose care and conditions worsen — appropriate for insurance and healthcare cuts.",
    calculate: (policy, yearsAhead) => {
      const lagYears = (policy.modelParams?.lagMonths ?? 24) / 12;
      // Integral of a linear ramp (0 → full over lagYears) then flat.
      let total = 0;
      const steps = Math.max(1, Math.ceil(yearsAhead * 12));
      const dt = yearsAhead / steps;
      for (let i = 0; i < steps; i++) {
        const t = i * dt;
        const rampFactor = lagYears <= 0 ? 1 : Math.min(1, t / lagYears);
        total += policy.ratePerYear * rampFactor * dt;
      }
      return total;
    },
    rateNow: (policy, yearsElapsed) => {
      const lagYears = (policy.modelParams?.lagMonths ?? 24) / 12;
      return policy.ratePerYear * (lagYears <= 0 ? 1 : Math.min(1, yearsElapsed / lagYears));
    },
  },

  threshold: {
    label: "Epidemic Threshold",
    badge: "Threshold",
    icon: "🦠",
    description:
      "Deaths stay low until vaccine coverage drops below herd immunity threshold, then spike — appropriate for vaccine-preventable diseases.",
    calculate: (policy, yearsAhead) => {
      let total = 0;
      const steps = Math.max(1, Math.ceil(yearsAhead * 12));
      const dt = yearsAhead / steps;
      for (let i = 0; i < steps; i++) {
        const t = i * dt;
        total += thresholdRate(policy, t) * dt;
      }
      return total;
    },
    rateNow: (policy, yearsElapsed) => thresholdRate(policy, yearsElapsed),
  },

  historical: {
    label: "Historical (Concluded)",
    badge: "Historical",
    icon: "📜",
    description:
      "A concluded event with a fixed documented death toll. Counter does not advance.",
    calculate: () => 0,
    rateNow: () => 0,
  },
};

// Shared math for the threshold (epidemic) model so calculate + rateNow agree.
function thresholdRate(policy, yearsElapsed) {
  const startCoverage = 0.92;
  const threshold = policy.modelParams?.thresholdCoverage ?? 0.95;
  const coverageDropPerYear = 0.012;
  const coverage = Math.max(0.5, startCoverage - coverageDropPerYear * yearsElapsed);
  if (coverage >= threshold) return policy.ratePerYear * 0.1;
  const belowThreshold = threshold - coverage;
  return policy.ratePerYear * Math.pow(1 + belowThreshold * 5, yearsElapsed * 0.5);
}

export const MODEL_OPTIONS = Object.entries(PROJECTION_MODELS).map(([key, val]) => ({
  value: key,
  label: val.label,
  description: val.description,
}));

// Returns the effective model key for a policy, honoring user overrides.
export function getEffectiveModel(policy, policyModels = {}) {
  return policyModels[policy.id] ?? policy.projectionModel ?? "flat";
}

// Cumulative deaths attributable to a future window [now, now + yearsAhead),
// where `yearsElapsedNow` is how long the policy has already been in effect.
export function projectedDeathsInWindow(policy, yearsElapsedNow, yearsAhead, policyModels = {}) {
  const model = PROJECTION_MODELS[getEffectiveModel(policy, policyModels)];
  return (
    model.calculate(policy, yearsElapsedNow + yearsAhead) -
    model.calculate(policy, yearsElapsedNow)
  );
}

// Total projected deaths across policies, using each policy's projectedYear
// as the horizon (per the methodology). Historical policies contribute their
// fixed documented toll.
export function calculateProjectedTotal(policies, policyModels = {}, targetYear = null) {
  return policies.reduce((sum, p) => {
    const modelKey = getEffectiveModel(p, policyModels);
    if (modelKey === "historical") return sum + (p.deathsToDate || 0);
    const startYear = p.startYear ?? 2025;
    const horizon = targetYear ?? p.projectedYear ?? startYear;
    const yearsAhead = Math.max(0, horizon - startYear);
    return sum + (p.deathsToDate || 0) + PROJECTION_MODELS[modelKey].calculate(p, yearsAhead);
  }, 0);
}
