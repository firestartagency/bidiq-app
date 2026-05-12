'use client';

import { useState } from 'react';
import Link from 'next/link';
import s from './page.module.css';

/* ---- static data ---- */
const PIPELINE = [
  { label: 'Bids Ingested',          value: 47, color: '#3B82F6' },
  { label: 'Analyzed by AI',         value: 38, color: '#6366F1' },
  { label: 'Proposals Generated',    value: 31, color: '#8B5CF6' },
  { label: 'Submitted',              value: 22, color: '#0EA5E9' },
  { label: 'Awards Won',             value: 14, color: '#10B981' },
];

const AGENCY_PERFORMANCE = [
  { agency: 'DoD / DISA', analyzed: 18, winRate: 72, avgScore: 89 },
  { agency: 'GSA',         analyzed: 12, winRate: 67, avgScore: 84 },
  { agency: 'VA',          analyzed:  7, winRate: 71, avgScore: 87 },
  { agency: 'HHS',         analyzed:  5, winRate: 40, avgScore: 76 },
  { agency: 'DHS',         analyzed:  4, winRate: 50, avgScore: 79 },
  { agency: 'USACE',       analyzed:  3, winRate: 67, avgScore: 82 },
];

const COMPLIANCE_DIST = [
  { range: '90–100%',  count: 8,  color: '#059669' },
  { range: '75–89%',   count: 16, color: '#D97706' },
  { range: '60–74%',   count: 10, color: '#EA580C' },
  { range: 'Below 60%',count: 4,  color: '#DC2626' },
];

const RECENT_ANALYSES = [
  { id: 'bid-001', solNum: 'DISA-HC-2026-R-0042', title: 'IT Infrastructure Modernization & Cybersecurity',  agency: 'DISA', score: 84, winThemes: 5, flags: 2, date: '2026-05-12', status: 'In Review' },
  { id: 'bid-002', solNum: 'GSA-MAS-2026-Q-0019', title: 'Professional Services & Administrative Support',   agency: 'GSA',  score: 92, winThemes: 4, flags: 0, date: '2026-05-10', status: 'Submitted' },
  { id: 'bid-003', solNum: 'USACE-RD-2026-SS-0007',title: 'Facility Operations & Maintenance',              agency: 'USACE',score: 61, winThemes: 3, flags: 4, date: '2026-05-12', status: 'Draft' },
  { id: 'bid-001', solNum: 'VA-CLOUD-2026-R-0014', title: 'Veterans Affairs Cloud Infrastructure & DevSecOps',agency: 'VA', score: 89, winThemes: 5, flags: 1, date: '2026-04-22', status: 'Submitted' },
  { id: 'bid-001', solNum: 'DoD-CYBER-2025-R-0088',title: 'Cybersecurity Advisory & Penetration Testing',  agency: 'DoD',  score: 96, winThemes: 6, flags: 0, date: '2026-01-15', status: 'Won' },
];

const NAICS_BREAKDOWN = [
  { code: '541512', desc: 'Computer Systems Design',         pct: 38, count: 18 },
  { code: '541330', desc: 'Engineering Services',            pct: 21, count: 10 },
  { code: '561110', desc: 'Office Administrative Services',  pct: 17, count:  8 },
  { code: '237310', desc: 'Highway/Street Construction',     pct: 13, count:  6 },
  { code: '541611', desc: 'Mgmt Consulting Services',        pct: 11, count:  5 },
];

const WIN_LOSS = { won: 14, lost: 8, active: 16 };

function scoreColor(score: number) {
  if (score >= 90) return '#059669';
  if (score >= 75) return '#D97706';
  return '#DC2626';
}

const STATUS_CLS: Record<string, string> = {
  'Draft': 'draft', 'In Review': 'review', 'Submitted': 'submitted', 'Won': 'won', 'Lost': 'lost',
};

export default function AnalysisPage() {
  const [activeAgencyTab, setActiveAgencyTab] = useState<'winRate' | 'avgScore'>('winRate');
  const maxPipeline = PIPELINE[0].value;

  return (
    <div className={s.page}>

      {/* ---- Header ---- */}
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>Analysis & Intelligence</h1>
          <p className={s.pageSub}>AI-powered insights across your full bid pipeline</p>
        </div>
        <Link href="/bids" className={s.analyzeBtn}>
          <i className="fas fa-bolt" /> Analyze New Bid
        </Link>
      </div>

      {/* ---- Top Stats ---- */}
      <div className={s.statsRow}>
        {[
          { icon: 'fas fa-search', color: '#EFF6FF', iconColor: '#2563EB', value: '47', label: 'Bids Analyzed' },
          { icon: 'fas fa-file-signature', color: '#F5F3FF', iconColor: '#7C3AED', value: '31', label: 'Proposals Generated' },
          { icon: 'fas fa-percentage', color: '#ECFDF5', iconColor: '#059669', value: '64%', label: 'Win Rate' },
          { icon: 'fas fa-chart-line', color: '#FFFBEB', iconColor: '#D97706', value: '83%', label: 'Avg Compliance Score' },
          { icon: 'fas fa-dollar-sign', color: '#FEF2F2', iconColor: '#DC2626', value: '$66.7M', label: 'Active Pipeline Value' },
        ].map((stat, i) => (
          <div key={i} className={s.statCard}>
            <div className={s.statIcon} style={{ background: stat.color, color: stat.iconColor }}>
              <i className={stat.icon} />
            </div>
            <div>
              <div className={s.statValue}>{stat.value}</div>
              <div className={s.statLabel}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ---- Row 2: Pipeline Funnel + Win/Loss ---- */}
      <div className={s.row2}>

        {/* Pipeline Funnel */}
        <div className={s.card} style={{ flex: 2 }}>
          <div className={s.cardHeader}>
            <h2 className={s.cardTitle}>Bid Pipeline Funnel</h2>
            <span className={s.cardSub}>End-to-end conversion from ingestion to award</span>
          </div>
          <div className={s.funnel}>
            {PIPELINE.map((step, i) => {
              const pct = Math.round((step.value / maxPipeline) * 100);
              const conversion = i > 0
                ? `${Math.round((step.value / PIPELINE[i - 1].value) * 100)}%`
                : null;
              return (
                <div key={i} className={s.funnelStep}>
                  <div className={s.funnelMeta}>
                    <span className={s.funnelLabel}>{step.label}</span>
                    <span className={s.funnelValue}>{step.value}</span>
                  </div>
                  <div className={s.funnelBarWrap}>
                    <div
                      className={s.funnelBar}
                      style={{ width: `${pct}%`, background: step.color }}
                    />
                  </div>
                  {conversion && (
                    <span className={s.conversionRate}><i className="fas fa-arrow-down" /> {conversion} conversion</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Win/Loss Donut */}
        <div className={s.card} style={{ flex: 1 }}>
          <div className={s.cardHeader}>
            <h2 className={s.cardTitle}>Win / Loss Breakdown</h2>
            <span className={s.cardSub}>Closed proposals</span>
          </div>

          <div className={s.donutWrap}>
            <div className={s.donutOuter}>
              <div className={s.donutInner}>
                <span className={s.donutPct}>{Math.round((WIN_LOSS.won / (WIN_LOSS.won + WIN_LOSS.lost)) * 100)}%</span>
                <span className={s.donutLabel}>Win Rate</span>
              </div>
            </div>
          </div>

          <div className={s.legendList}>
            <div className={s.legendItem}>
              <span className={s.legendDot} style={{ background: '#10B981' }} />
              <span className={s.legendText}>Won</span>
              <span className={s.legendNum}>{WIN_LOSS.won}</span>
            </div>
            <div className={s.legendItem}>
              <span className={s.legendDot} style={{ background: '#EF4444' }} />
              <span className={s.legendText}>Lost</span>
              <span className={s.legendNum}>{WIN_LOSS.lost}</span>
            </div>
            <div className={s.legendItem}>
              <span className={s.legendDot} style={{ background: '#3B82F6' }} />
              <span className={s.legendText}>Active</span>
              <span className={s.legendNum}>{WIN_LOSS.active}</span>
            </div>
          </div>
        </div>

      </div>

      {/* ---- Row 3: Agency Performance + Compliance Dist ---- */}
      <div className={s.row3}>

        {/* Agency Performance */}
        <div className={s.card} style={{ flex: 3 }}>
          <div className={s.cardHeader}>
            <h2 className={s.cardTitle}>Agency Performance</h2>
            <div className={s.tabGroup}>
              <button
                className={`${s.tab} ${activeAgencyTab === 'winRate' ? s.tabActive : ''}`}
                onClick={() => setActiveAgencyTab('winRate')}
              >Win Rate</button>
              <button
                className={`${s.tab} ${activeAgencyTab === 'avgScore' ? s.tabActive : ''}`}
                onClick={() => setActiveAgencyTab('avgScore')}
              >Avg Score</button>
            </div>
          </div>
          <div className={s.agencyList}>
            {AGENCY_PERFORMANCE.sort((a, b) =>
              activeAgencyTab === 'winRate' ? b.winRate - a.winRate : b.avgScore - a.avgScore
            ).map((ag, i) => {
              const displayVal = activeAgencyTab === 'winRate' ? ag.winRate : ag.avgScore;
              const color = displayVal >= 70 ? '#059669' : displayVal >= 55 ? '#D97706' : '#DC2626';
              return (
                <div key={i} className={s.agencyRow}>
                  <span className={s.agencyName}>{ag.agency}</span>
                  <span className={s.agencyCount}>{ag.analyzed} bids</span>
                  <div className={s.agencyBarWrap}>
                    <div className={s.agencyBar} style={{ width: `${displayVal}%`, background: color }} />
                  </div>
                  <span className={s.agencyPct} style={{ color }}>{displayVal}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Compliance distribution */}
        <div className={s.card} style={{ flex: 2 }}>
          <div className={s.cardHeader}>
            <h2 className={s.cardTitle}>Compliance Score Distribution</h2>
            <span className={s.cardSub}>Across {COMPLIANCE_DIST.reduce((a, b) => a + b.count, 0)} proposals</span>
          </div>
          <div className={s.compDist}>
            {COMPLIANCE_DIST.map((band, i) => {
              const pct = Math.round((band.count / 38) * 100);
              return (
                <div key={i} className={s.compBand}>
                  <div className={s.compBandHead}>
                    <span className={s.compRange} style={{ color: band.color }}>{band.range}</span>
                    <span className={s.compCount}>{band.count} proposals</span>
                  </div>
                  <div className={s.compBarWrap}>
                    <div className={s.compBar} style={{ width: `${pct}%`, background: band.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ---- Row 4: NAICS Breakdown + Recent Analyses ---- */}
      <div className={s.row4}>

        {/* NAICS breakdown */}
        <div className={s.card} style={{ flex: 1 }}>
          <div className={s.cardHeader}>
            <h2 className={s.cardTitle}>NAICS Breakdown</h2>
            <span className={s.cardSub}>By volume of bids analyzed</span>
          </div>
          <div className={s.naicsList}>
            {NAICS_BREAKDOWN.map((n, i) => (
              <div key={i} className={s.naicsRow}>
                <div className={s.naicsMeta}>
                  <span className={s.naicsCode}>{n.code}</span>
                  <span className={s.naicsDesc}>{n.desc}</span>
                </div>
                <div className={s.naicsBarWrap}>
                  <div className={s.naicsBar} style={{ width: `${n.pct}%` }} />
                </div>
                <span className={s.naicsCount}>{n.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Analyses */}
        <div className={s.card} style={{ flex: 2 }}>
          <div className={s.cardHeader}>
            <h2 className={s.cardTitle}>Recent Analyses</h2>
            <Link href="/bids" className={s.viewAll}>View all bids →</Link>
          </div>
          <table className={s.table}>
            <thead>
              <tr>
                <th>Solicitation</th>
                <th>Score</th>
                <th>Win Themes</th>
                <th>Flags</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {RECENT_ANALYSES.map((row, i) => (
                <tr key={i}>
                  <td>
                    <div className={s.solTitle}>{row.title.slice(0, 42)}{row.title.length > 42 ? '…' : ''}</div>
                    <div className={s.solNum}>{row.solNum}</div>
                  </td>
                  <td>
                    <span className={s.scoreChip} style={{ color: scoreColor(row.score), borderColor: scoreColor(row.score) + '33', background: scoreColor(row.score) + '11' }}>
                      {row.score}%
                    </span>
                  </td>
                  <td><span className={s.dimText}>{row.winThemes}</span></td>
                  <td>
                    {row.flags > 0
                      ? <span className={s.flagChip}><i className="fas fa-flag" /> {row.flags}</span>
                      : <span className={s.noFlags}><i className="fas fa-check" /></span>
                    }
                  </td>
                  <td>
                    <span className={`${s.statusBadge} ${s[STATUS_CLS[row.status] ?? 'draft']}`}>
                      {row.status}
                    </span>
                  </td>
                  <td>
                    <Link href={`/bids/${row.id}/analyze`} className={s.viewLink}>
                      View <i className="fas fa-arrow-right" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
