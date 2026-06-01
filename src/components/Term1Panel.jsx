// Term1Panel.jsx
import { useState } from "react";
import { POLICIES_TERM1, CATEGORIES } from "../data/policies";
import { formatNumber } from "../hooks/useDeathCounter";

export default function Term1Panel() {
  const [open, setOpen] = useState(false);

  const total = POLICIES_TERM1.reduce((s, p) => s + p.deathsToDate, 0);

  return (
    <div className="term1-panel">
      <button className="term1-toggle" onClick={() => setOpen(o => !o)}>
        <span>⚖️ Compare: Trump Term 1 (2017–2021)</span>
        <span className="term1-total">{formatNumber(total)} estimated deaths</span>
        <span>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="term1-grid">
          <p className="term1-note">
            Term 1 figures are retrospective estimates from peer-reviewed studies and policy analyses.
            Click any card for sources.
          </p>
          {POLICIES_TERM1.map(p => {
            const cat = CATEGORIES[p.category];
            return (
              <Term1Card key={p.id} policy={p} cat={cat} />
            );
          })}
          <div className="term1-compare-bar">
            <div className="compare-col">
              <div className="compare-label">Term 1 Total</div>
              <div className="compare-num t1">{formatNumber(total)}</div>
            </div>
            <div className="compare-divider">vs</div>
            <div className="compare-col">
              <div className="compare-label">Term 2 (so far)</div>
              <div className="compare-num t2">See counter above ↑</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Term1Card({ policy, cat }) {
  const [exp, setExp] = useState(false);
  return (
    <div className="t1-card" onClick={() => setExp(e => !e)} style={{ "--cat-color": cat.color }}>
      <div className="t1-card-left">
        <span className="cat-icon">{cat.icon}</span>
        <div>
          <div className="t1-title">{policy.title}</div>
          <div className="t1-date">{policy.date}</div>
        </div>
      </div>
      <div className="t1-deaths" style={{ color: cat.color }}>{formatNumber(policy.deathsToDate)}</div>
      {exp && (
        <div className="t1-expand">
          <p>{policy.description}</p>
          <div className="sources">
            {policy.sources.map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                onClick={e => e.stopPropagation()} className="source-link">
                {s.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
