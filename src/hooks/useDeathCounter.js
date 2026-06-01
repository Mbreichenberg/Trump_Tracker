// useDeathCounter.js
// Animates a running death toll counter based on per-policy projection models.
// For each active policy we ask its model for the *current* instantaneous
// mortality rate (rateNow, deaths/year) given how long the policy has been in
// effect, then advance the counter at that rate while the page is open.
// Historical (concluded) policies contribute a fixed toll and do not tick.

import { useState, useEffect, useRef } from "react";
import { POLICIES_TERM2 } from "../data/policies";
import {
  PROJECTION_MODELS,
  getEffectiveModel,
  projectedDeathsInWindow,
} from "../utils/projectionModels";

const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;

function startMs(policy) {
  return new Date(policy.startYear ?? 2025, 0, 1).getTime();
}

function activeFor(selectedCategories) {
  return selectedCategories === "ALL"
    ? POLICIES_TERM2
    : POLICIES_TERM2.filter(p => selectedCategories.includes(p.category));
}

export function useDeathCounter(selectedCategories, policyModels = {}) {
  const [count, setCount] = useState(0);
  const startRef = useRef(null);
  const dataRef = useRef({ base: 0, policies: [] });

  useEffect(() => {
    const activePolicies = activeFor(selectedCategories);
    const base = activePolicies.reduce((sum, p) => sum + (p.deathsToDate || 0), 0);

    dataRef.current = { base, policies: activePolicies };
    startRef.current = Date.now();
    setCount(base);

    const tick = () => {
      const now = Date.now();
      const elapsedMs = now - startRef.current;
      const { base: b, policies } = dataRef.current;
      let total = b;
      for (const p of policies) {
        const model = PROJECTION_MODELS[getEffectiveModel(p, policyModels)];
        const yearsElapsed = Math.max(0, (now - startMs(p)) / MS_PER_YEAR);
        const rateNow = model.rateNow(p, yearsElapsed); // deaths / year, right now
        total += rateNow * (elapsedMs / MS_PER_YEAR);
      }
      setCount(Math.floor(total));
    };

    const interval = setInterval(tick, 100);
    return () => clearInterval(interval);
    // policyModels is an object held in parent state; identity changes on edit.
  }, [selectedCategories, policyModels]);

  return count;
}

// Current aggregate instantaneous rate (deaths/year) for the active selection,
// honoring per-policy model overrides.
export function currentRatePerYear(selectedCategories, policyModels = {}) {
  const now = Date.now();
  return activeFor(selectedCategories).reduce((sum, p) => {
    const model = PROJECTION_MODELS[getEffectiveModel(p, policyModels)];
    const yearsElapsed = Math.max(0, (now - startMs(p)) / MS_PER_YEAR);
    return sum + model.rateNow(p, yearsElapsed);
  }, 0);
}

// Additional deaths expected over the next `yearsAhead` years across the active
// selection, using each policy's model. Added on top of the live count.
export function futureDeathsAhead(selectedCategories, yearsAhead, policyModels = {}) {
  const now = Date.now();
  return activeFor(selectedCategories).reduce((sum, p) => {
    const yearsElapsedNow = Math.max(0, (now - startMs(p)) / MS_PER_YEAR);
    return sum + projectedDeathsInWindow(p, yearsElapsedNow, yearsAhead, policyModels);
  }, 0);
}

// Simple formatter: 1,234,567
export function formatNumber(n) {
  return Math.round(n).toLocaleString("en-US");
}
