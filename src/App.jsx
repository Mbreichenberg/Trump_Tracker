// App.jsx
import { useState, useMemo } from "react";
import { POLICIES_TERM2, POLICIES_TERM1, CATEGORIES } from "./data/policies";
import { POLICIES_OBAMA } from "./data/obama";
import { POLICIES_BIDEN } from "./data/biden";
import { ADMIN_SUMMARY } from "./data/adminSummary";
import {
  useDeathCounter,
  formatNumber,
  currentRatePerYear,
  futureDeathsAhead,
} from "./hooks/useDeathCounter";
import { getEffectiveModel } from "./utils/projectionModels";
import PolicyCard from "./components/PolicyCard";
import Term1Panel from "./components/Term1Panel";
import "./styles.css";

const ALL_CATS = Object.keys(CATEGORIES);

const ADMIN_DATA = {
  trump2: POLICIES_TERM2,
  trump1: POLICIES_TERM1,
  obama: POLICIES_OBAMA,
  biden: POLICIES_BIDEN,
};

export default function App() {
  const [selectedCats, setSelectedCats] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [yearsAhead, setYearsAhead] = useState(0);
  const [activeAdmin, setActiveAdmin] = useState("trump2");
  // Per-policy model overrides: { [policyId]: modelKey }. Empty = defaults.
  const [policyModels, setPolicyModels] = useState({});

  // Live counter always reflects Trump Term 2 (the only live-tracked admin).
  const liveCount = useDeathCounter(selectedCats, policyModels);

  const isLive = activeAdmin === "trump2";
  const isPositiveAdmin = activeAdmin === "obama" || activeAdmin === "biden";
  const adminSummary = ADMIN_SUMMARY[activeAdmin];
  const shortName = activeAdmin.startsWith("trump") ? "Trump" : adminSummary.label;

  const activePolicies = ADMIN_DATA[activeAdmin] ?? POLICIES_TERM2;

  function handleModelChange(policyId, modelKey) {
    setPolicyModels(prev => ({ ...prev, [policyId]: modelKey }));
  }

  function resetModels() {
    setPolicyModels({});
  }

  // How many policies are currently using a non-default model.
  const overrideCount = useMemo(
    () =>
      POLICIES_TERM2.filter(
        p => getEffectiveModel(p, policyModels) !== (p.projectionModel ?? "flat")
      ).length,
    [policyModels]
  );

  // Which policies to show (filtered by category + search) for the active admin.
  const visiblePolicies = useMemo(() => {
    let list = selectedCats === "ALL"
      ? activePolicies
      : activePolicies.filter(p => selectedCats.includes(p.category));
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activePolicies, selectedCats, searchQuery]);

  // Aggregate total for the active admin, respecting the category filter
  // (so category-specific comparisons only count the selected categories).
  const adminTotal = useMemo(() => {
    const list = selectedCats === "ALL"
      ? activePolicies
      : activePolicies.filter(p => selectedCats.includes(p.category));
    if (isPositiveAdmin) {
      return list.reduce((s, p) => s + (p.livesSaved ?? 0), 0);
    }
    return list.reduce((s, p) => s + (p.deathsToDate ?? 0), 0);
  }, [activePolicies, isPositiveAdmin, selectedCats]);

  // Model-aware live rate + projection (Trump Term 2 only).
  const activeRatePerYear = currentRatePerYear(selectedCats, policyModels);
  const ratePerSecond = (activeRatePerYear / (365.25 * 24 * 3600)).toFixed(2);
  const futureDeaths = Math.floor(
    liveCount + futureDeathsAhead(selectedCats, yearsAhead, policyModels)
  );
  const targetYear = new Date().getFullYear() + yearsAhead;

  // Hero number presentation.
  const heroNumber = isLive ? liveCount : adminTotal;
  const heroColor = isPositiveAdmin ? "#22c55e" : "var(--red)";
  const heroArrow = isPositiveAdmin ? "↑" : "↓";

  function toggleCategory(catId) {
    if (selectedCats === "ALL") {
      setSelectedCats([catId]);
    } else if (selectedCats.includes(catId)) {
      const next = selectedCats.filter(c => c !== catId);
      setSelectedCats(next.length === 0 ? "ALL" : next);
    } else {
      const next = [...selectedCats, catId];
      setSelectedCats(next.length === ALL_CATS.length ? "ALL" : next);
    }
  }

  function isActive(catId) {
    return selectedCats === "ALL" || selectedCats.includes(catId);
  }

  // Per-category net for the active admin (lives saved or deaths).
  function catStats(catId) {
    const list = activePolicies.filter(p => p.category === catId);
    if (list.length === 0) return null;
    if (isPositiveAdmin) {
      const net = list.reduce((s, p) => s + (p.livesSaved ?? 0), 0);
      return { value: net, positive: net >= 0 };
    }
    const deaths = list.reduce((s, p) => s + (p.deathsToDate ?? 0), 0);
    return { value: -deaths, positive: false };
  }

  return (
    <div className="app">
      {/* ── HERO ─────────────────────────────────────────── */}
      <header className="hero">
        <div className="hero-noise" />
        <div className="hero-content">
          <div className="eyebrow">ACCOUNTABILITY TRACKER</div>
          <h1 className="hero-title">
            {isPositiveAdmin ? "The Lives Saved" : "The Human Cost"}
            <span className="hero-subtitle">
              {isPositiveAdmin ? ` by ${shortName} Policy` : ` of ${shortName} Policy`}
            </span>
          </h1>
          <p className="hero-intro">
            Estimates based on peer-reviewed studies, UN reports, Congressional analyses,
            and major news organizations. Click any policy for sources.
          </p>

          {/* Counter */}
          <div className="counter-block">
            <div className="counter-label">
              {adminSummary.label}
              {" · "}
              {selectedCats === "ALL" ? "All Categories" : selectedCats.map(c => CATEGORIES[c].label).join(" + ")}
            </div>
            <div
              className={`counter-number ${isLive ? "" : "counter-number--static"}`}
              style={{ color: heroColor }}
            >
              {formatNumber(heroNumber)}
            </div>
            {isLive ? (
              <div className="counter-sublabel">
                estimated deaths to date &nbsp;·&nbsp;
                <span className="pulse-dot" /> {ratePerSecond} per second
              </div>
            ) : (
              <div className="counter-sublabel">
                <span style={{ color: heroColor }}>{heroArrow}</span>
                &nbsp;{isPositiveAdmin ? "net lives saved" : "estimated deaths"}
                &nbsp;·&nbsp; {adminSummary.years}
              </div>
            )}

            {/* Future projection slider — Trump Term 2 only */}
            {isLive && (
              <div className="projection-slider">
                <div className="projection-slider__readout">
                  {yearsAhead === 0 ? (
                    <span className="projection-slider__now">Today's estimate</span>
                  ) : (
                    <>
                      <span className="projection-slider__deaths">{formatNumber(futureDeaths)}</span>
                      <span className="projection-slider__caption">
                        estimated deaths by <strong>{targetYear}</strong>
                        {" "}(+{yearsAhead} {yearsAhead === 1 ? "year" : "years"})
                      </span>
                    </>
                  )}
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={yearsAhead}
                  onChange={e => setYearsAhead(Number(e.target.value))}
                  className="projection-slider__input"
                  aria-label="Years into the future"
                />
                <div className="projection-slider__ticks">
                  <span>Now</span>
                  <span>+10</span>
                  <span>+20</span>
                  <span>+30</span>
                  <span>+40</span>
                  <span>+50 yrs</span>
                </div>
              </div>
            )}
          </div>

          {/* Comparison bar — when not viewing Trump Term 2 */}
          {!isLive && (
            <div className="comparison-bar">
              <div className="compare-item">
                <div className="compare-item-label">Trump Term 2 (to date)</div>
                <div className="compare-item-value negative">{formatNumber(liveCount)}</div>
                <div className="compare-item-sub">lives lost</div>
              </div>
              <div className="compare-divider">vs</div>
              <div className="compare-item">
                <div className="compare-item-label">{adminSummary.label}</div>
                <div className="compare-item-value" style={{ color: heroColor }}>
                  {formatNumber(Math.abs(adminTotal))}
                </div>
                <div className="compare-item-sub">
                  {isPositiveAdmin ? "net lives saved" : "lives lost"}
                </div>
              </div>
            </div>
          )}

          {/* Administration switcher */}
          <div className="admin-switcher">
            {Object.values(ADMIN_SUMMARY).map(admin => (
              <button
                key={admin.id}
                className={`admin-tab ${activeAdmin === admin.id ? "admin-tab--active" : ""}`}
                style={activeAdmin === admin.id ? {
                  borderColor: admin.color,
                  color: admin.color,
                  background: `${admin.color}15`,
                } : {}}
                onClick={() => setActiveAdmin(admin.id)}
              >
                <span className="admin-tab-label">{admin.label}</span>
                <span className="admin-tab-years">{admin.years}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── CATEGORY FILTER ──────────────────────────────── */}
      <nav className="cat-nav">
        <button
          className={`cat-btn ${selectedCats === "ALL" ? "cat-btn--all-active" : ""}`}
          onClick={() => setSelectedCats("ALL")}
        >
          <span className="cat-btn-label">🗂 All Categories</span>
        </button>
        {ALL_CATS.map(catId => {
          const cat = CATEGORIES[catId];
          const active = isActive(catId);
          const stats = catStats(catId);
          return (
            <button
              key={catId}
              className={`cat-btn ${active && selectedCats !== "ALL" ? "cat-btn--active" : ""}`}
              style={active && selectedCats !== "ALL" ? { borderColor: cat.color, color: cat.color } : {}}
              onClick={() => toggleCategory(catId)}
            >
              <span className="cat-btn-label">{cat.icon} {cat.label}</span>
              {stats && (
                <span className={`cat-net ${stats.positive ? "cat-net--pos" : "cat-net--neg"}`}>
                  {stats.positive ? "+" : "−"}{formatNumber(Math.abs(stats.value))}
                  {" "}{stats.positive ? "saved" : "lost"}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* ── SEARCH ───────────────────────────────────────── */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search policies..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <span className="search-count">{visiblePolicies.length} policies shown</span>
        {isLive && overrideCount > 0 && (
          <span className="model-override-indicator">
            ⚠️ {overrideCount} {overrideCount === 1 ? "model" : "models"} overridden
          </span>
        )}
        {isLive && (
          <button
            className="reset-models-btn"
            onClick={resetModels}
            disabled={overrideCount === 0}
          >
            Reset All Models to Defaults
          </button>
        )}
      </div>

      {/* ── POLICY GRID ──────────────────────────────────── */}
      <main className="policy-grid">
        {visiblePolicies.map(policy => (
          <PolicyCard
            key={policy.id}
            policy={policy}
            showModel={isLive}
            currentModel={getEffectiveModel(policy, policyModels)}
            onModelChange={handleModelChange}
          />
        ))}
        {visiblePolicies.length === 0 && (
          <div className="empty-state">No policies match your filters.</div>
        )}
      </main>

      {/* ── TERM 1 COMPARISON (Trump Term 2 view only) ───── */}
      {isLive && (
        <section className="term1-section">
          <Term1Panel />
        </section>
      )}

      {/* ── METHODOLOGY ──────────────────────────────────── */}
      <footer className="methodology">
        <h2>Methodology & Notes</h2>
        <p>
          <strong>Real-time counter:</strong> Deaths shown to-date are from published studies and reports.
          The live counter advances in real time based on each policy's estimated annual mortality rate,
          divided by seconds per year. This is an approximation — causation is complex and contested.
          Some figures represent ranges; we use midpoints or conservative estimates.
        </p>
        <p>
          <strong>Comparing administrations:</strong> Trump Term 2 is tracked live. Trump Term 1, Obama,
          and Biden are shown as static historical totals. Obama and Biden figures represent <em>net lives
          saved</em> versus a no-policy baseline (green); both include notable negative exceptions
          (drone strikes; Gaza arms) shown in red. The comparison bar always contrasts the selected
          administration against Trump Term 2's running count.
        </p>
        <p>
          <strong>Projection models:</strong> Different policies follow different mortality curves.
          Climate and compounding failures use <em>exponential growth</em>; sudden aid cuts use a
          <em> front-loaded decay</em> (deaths peak early, then taper); insurance and healthcare losses
          use a <em>lagged ramp</em> (deaths build over months); and concluded events (e.g. the Iran war)
          are <em>historical</em> fixed tolls. Projections apply only to the live Trump Term 2 data; expand
          any policy card to see — and change — the model applied to it.
        </p>
        <p>
          <strong>Attribution:</strong> All estimates represent additional deaths above baseline that
          researchers attribute to specific policy changes. Counterfactual deaths (what would have
          happened without the policy) are inherently uncertain. We cite the primary source for each claim.
        </p>
        <p className="footer-disclaimer">
          This tracker is built from public research. Sources are linked on each policy card.
          Figures will be updated as new studies are published.
        </p>
      </footer>
    </div>
  );
}
