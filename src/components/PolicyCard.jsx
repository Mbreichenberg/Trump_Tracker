// PolicyCard.jsx
import { useState } from "react";
import { CATEGORIES } from "../data/policies";
import { formatNumber } from "../hooks/useDeathCounter";
import { PROJECTION_MODELS, MODEL_OPTIONS } from "../utils/projectionModels";

export default function PolicyCard({ policy, currentModel, onModelChange, showModel = false }) {
  const [expanded, setExpanded] = useState(false);
  const cat = CATEGORIES[policy.category];

  // Net-effect (lives-saved) entries come from Obama/Biden datasets.
  const isPositive = policy.netEffect === "positive";
  const isNegative = policy.netEffect === "negative";
  const hasNetEffect = isPositive || isNegative;

  const mainValue = policy.livesSaved ?? policy.deathsToDate ?? 0;
  const displayValue = Math.abs(mainValue);

  const valueColor = isNegative ? "#ef4444" : isPositive ? "#22c55e" : cat.color;
  const valueLabel = isNegative ? "lives lost" : isPositive ? "lives saved" : "deaths to date";
  const valuePrefix = isPositive ? "+" : isNegative ? "−" : "";

  // Accent + hover color follows net effect for Obama/Biden, category otherwise.
  const accentColor = hasNetEffect ? valueColor : cat.color;

  const activeModel = currentModel ?? policy.projectionModel ?? "flat";
  const model = PROJECTION_MODELS[activeModel];
  const isOverridden = showModel && activeModel !== (policy.projectionModel ?? "flat");

  const cardClass = [
    "policy-card",
    isPositive && "card--positive",
    isNegative && "card--negative-entry",
  ].filter(Boolean).join(" ");

  return (
    <div
      className={cardClass}
      style={{ "--cat-color": accentColor }}
      onClick={() => setExpanded(e => !e)}
    >
      <div className="card-accent" />

      <div className="card-header">
        <span className="cat-icon">{cat.icon}</span>
        <div className="card-meta">
          <span className="cat-label" style={{ color: cat.color }}>{cat.label}</span>
          <span className="card-date">{policy.date}</span>
        </div>
        <span className="expand-arrow">{expanded ? "▲" : "▼"}</span>
      </div>

      <h3 className="card-title">{policy.title}</h3>

      {showModel && (
        <div className="card-badges">
          <span className={`model-badge ${isOverridden ? "model-badge--override" : ""}`}>
            {model.icon} {model.badge}
            {isOverridden && <span className="model-badge__dot" title="Overridden from default" />}
          </span>
        </div>
      )}

      <div className="card-stats">
        {hasNetEffect ? (
          <div className="stat">
            <span className="stat-value" style={{ color: valueColor }}>
              {valuePrefix}{formatNumber(displayValue)}
            </span>
            <span className="stat-label">{valueLabel}</span>
          </div>
        ) : (
          <>
            <div className="stat">
              <span className="stat-value" style={{ color: cat.color }}>
                {formatNumber(policy.deathsToDate)}
              </span>
              <span className="stat-label">deaths to date</span>
            </div>
            {policy.deathsProjected > policy.deathsToDate && (
              <div className="stat">
                <span className="stat-value" style={{ color: "#f59e0b" }}>
                  {formatNumber(policy.deathsProjected)}
                </span>
                <span className="stat-label">projected by {policy.projectedYear}</span>
              </div>
            )}
            {policy.ratePerYear > 0 && (
              <div className="stat">
                <span className="stat-value stat-rate">
                  {formatNumber(policy.ratePerYear)}
                </span>
                <span className="stat-label">deaths / year</span>
              </div>
            )}
          </>
        )}
      </div>

      {expanded && (
        <div className="card-body">
          <p className="card-desc">{policy.description}</p>

          {showModel && (
            <div className="model-selector" onClick={e => e.stopPropagation()}>
              <label className="model-label" htmlFor={`model-${policy.id}`}>
                Projection Model:
              </label>
              <select
                id={`model-${policy.id}`}
                value={activeModel}
                onChange={e => onModelChange?.(policy.id, e.target.value)}
                className="model-select"
              >
                {MODEL_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <p className="model-description">{model.description}</p>
            </div>
          )}

          <div className="sources">
            <span className="sources-label">Sources:</span>
            {policy.sources.map((s, i) => (
              <a
                key={i}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="source-link"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
