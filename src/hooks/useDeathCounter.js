// useDeathCounter.js
// Computes a running death toll counter based on per-policy projection models.
// The count is a *deterministic function of wall-clock time*: it equals the
// `deathsToDate` baseline as of a fixed anchor date (DATA_EPOCH), plus the
// deaths accrued since that anchor at each policy's current rate. Because it is
// anchored to absolute time (not page-load time), the number is identical on
// every device and keeps climbing across reloads instead of resetting.
// Historical (concluded) policies contribute a fixed toll and do not tick.

import { useState, useEffect, useRef } from "react";
import { POLICIES_TERM2 } from "../data/policies";
import {
  PROJECTION_MODELS,
  getEffectiveModel,
  projectedDeathsInWindow,
} from "../utils/projectionModels";

const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;

// Fixed anchor: the date the `deathsToDate` baselines are current as of.
// Everything ticks forward deterministically from this instant (UTC), so all
// devices agree and the value never resets on reload.
const DATA_EPOCH_MS = Date.UTC(2026, 5, 1); // 2026-06-01T00:00:00Z

function startMs(policy) {
  return Date.UTC(policy.startYear ?? 2025, 0, 1);
}

function activeFor(selectedCategories) {
  return selectedCategories === "ALL"
    ? POLICIES_TERM2
    : POLICIES_TERM2.filter(p => selectedCategories.includes(p.category));
}

// Deterministic live total for the given policies at the current wall-clock time.
function computeLiveTotal(policies, base, policyModels) {
  const now = Date.now();
  const elapsedSinceEpoch = Math.max(0, now - DATA_EPOCH_MS) / MS_PER_YEAR;
  let total = base;
  for (const p of policies) {
    const model = PROJECTION_MODELS[getEffectiveModel(p, policyModels)];
    const yearsElapsed = Math.max(0, (now - startMs(p)) / MS_PER_YEAR);
    total += model.rateNow(p, yearsElapsed) * elapsedSinceEpoch;
  }
  return total;
}

export function useDeathCounter(selectedCategories, policyModels = {}) {
  const [count, setCount] = useState(() => {
    const policies = activeFor(selectedCategories);
    const base = policies.reduce((sum, p) => sum + (p.deathsToDate || 0), 0);
    return Math.floor(computeLiveTotal(policies, base, policyModels));
  });
  const dataRef = useRef({ base: 0, policies: [] });

  useEffect(() => {
    const activePolicies = activeFor(selectedCategories);
    const base = activePolicies.reduce((sum, p) => sum + (p.deathsToDate || 0), 0);
    dataRef.current = { base, policies: activePolicies };

    const tick = () => {
      const { base: b, policies } = dataRef.current;
      setCount(Math.floor(computeLiveTotal(policies, b, policyModels)));
    };

    tick();
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
