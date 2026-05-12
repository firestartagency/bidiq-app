'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import proposalsData from '@/data/proposals.json';
import s from './page.module.css';

/* ---- types ---- */
interface Proposal {
  id: string;
  bidId: string;
  solicitationNumber: string;
  title: string;
  agency: string;
  agencyShort: string;
  type: string;
  value: string;
  status: string;
  submittedDate: string | null;
  dueDate: string;
  createdDate: string;
  lastModified: string;
  sections: { executiveSummary: boolean; technicalApproach: boolean; managementPlan: boolean; pastPerformance: boolean };
  complianceScore: number;
  reviewerFlags: number;
  assignedTo: string;
  proposalId: string;
}

const proposals = proposalsData.proposals as Proposal[];

/* ---- status config ---- */
const STATUS: Record<string, { label: string; cls: string; icon: string }> = {
  'Draft':            { label: 'Draft',            cls: 'draft',    icon: 'fas fa-pencil-alt' },
  'In Review':        { label: 'In Review',        cls: 'review',   icon: 'fas fa-eye' },
  'Pending Approval': { label: 'Pending Approval', cls: 'pending',  icon: 'fas fa-clock' },
  'Submitted':        { label: 'Submitted',        cls: 'submitted',icon: 'fas fa-paper-plane' },
  'Won':              { label: 'Won',              cls: 'won',      icon: 'fas fa-trophy' },
  'Lost':             { label: 'Lost',             cls: 'lost',     icon: 'fas fa-times-circle' },
};

const AGENCY_COLORS: Record<string, string> = {
  DISA:  '#1E3A8A', GSA: '#065F46', USACE: '#78350F',
  DoD:   '#581C87', HHS: '#9F1239', VA:    '#1E40AF',
  DHS:   '#374151', DOE: '#92400E',
};

const SECTION_LABELS = [
  { key: 'executiveSummary',  label: 'Exec Summary' },
  { key: 'technicalApproach', label: 'Technical' },
  { key: 'managementPlan',    label: 'Management' },
  { key: 'pastPerformance',   label: 'Past Perf.' },
];

function scoreColor(score: number) {
  if (score >= 90) return '#059669';
  if (score >= 75) return '#D97706';
  return '#DC2626';
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/* ---- stats ---- */
function computeStats(list: Proposal[]) {
  const total   = list.length;
  const won     = list.filter(p => p.status === 'Won').length;
  const lost    = list.filter(p => p.status === 'Lost').length;
  const active  = list.filter(p => !['Won','Lost'].includes(p.status)).length;
  const winRate = won + lost > 0 ? Math.round((won / (won + lost)) * 100) : 0;
  const totalValue = proposals
    .filter(p => p.status === 'Won')
    .reduce((acc, p) => acc + parseFloat(p.value.replace(/[$M,]/g, '')), 0);
  return { total, won, active, winRate, totalValue };
}

/* ---- main ---- */
export default function ProposalsPage() {
  const [search, setSearch]       = useState('');
  const [statusFilter, setStatus] = useState('All');
  const [typeFilter, setType]     = useState('All');

  const stats = computeStats(proposals);

  const filtered = useMemo(() => {
    return proposals.filter(p => {
      const matchSearch = search === '' ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.solicitationNumber.toLowerCase().includes(search.toLowerCase()) ||
        p.agency.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' || p.status === statusFilter;
      const matchType   = typeFilter === 'All'   || p.type === typeFilter;
      return matchSearch && matchStatus && matchType;
    });
  }, [search, statusFilter, typeFilter]);

  const statuses = ['All', 'Draft', 'In Review', 'Pending Approval', 'Submitted', 'Won', 'Lost'];
  const types    = ['All', 'RFP', 'RFQ', 'Sources Sought'];

  return (
    <div className={s.page}>

      {/* ---- Page Header ---- */}
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>Proposals</h1>
          <p className={s.pageSub}>{proposals.length} proposals tracked across all solicitations</p>
        </div>
        <Link href="/bids" className={s.newBtn} id="proposals-new-btn">
          <i className="fas fa-plus" /> New Proposal
        </Link>
      </div>

      {/* ---- Stats Row ---- */}
      <div className={s.statsRow}>
        <div className={s.statCard}>
          <div className={s.statIcon} style={{ background: '#EFF6FF', color: '#2563EB' }}>
            <i className="fas fa-file-alt" />
          </div>
          <div>
            <div className={s.statValue}>{stats.total}</div>
            <div className={s.statLabel}>Total Proposals</div>
          </div>
        </div>
        <div className={s.statCard}>
          <div className={s.statIcon} style={{ background: '#FFFBEB', color: '#D97706' }}>
            <i className="fas fa-spinner" />
          </div>
          <div>
            <div className={s.statValue}>{stats.active}</div>
            <div className={s.statLabel}>Active / In Progress</div>
          </div>
        </div>
        <div className={s.statCard}>
          <div className={s.statIcon} style={{ background: '#ECFDF5', color: '#059669' }}>
            <i className="fas fa-trophy" />
          </div>
          <div>
            <div className={s.statValue}>{stats.won}</div>
            <div className={s.statLabel}>Awards Won</div>
          </div>
        </div>
        <div className={s.statCard}>
          <div className={s.statIcon} style={{ background: '#F5F3FF', color: '#7C3AED' }}>
            <i className="fas fa-percentage" />
          </div>
          <div>
            <div className={s.statValue}>{stats.winRate}%</div>
            <div className={s.statLabel}>Win Rate</div>
          </div>
        </div>
        <div className={s.statCard}>
          <div className={s.statIcon} style={{ background: '#FEF2F2', color: '#DC2626' }}>
            <i className="fas fa-dollar-sign" />
          </div>
          <div>
            <div className={s.statValue}>${stats.totalValue.toFixed(1)}M</div>
            <div className={s.statLabel}>Total Awards Value</div>
          </div>
        </div>
      </div>

      {/* ---- Filter Bar ---- */}
      <div className={s.filterBar}>
        <div className={s.searchWrap}>
          <i className={`fas fa-search ${s.searchIcon}`} />
          <input
            className={s.searchInput}
            placeholder="Search proposals, solicitation #, agency…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className={s.filters}>
          <select className={s.select} value={statusFilter} onChange={e => setStatus(e.target.value)}>
            {statuses.map(st => <option key={st}>{st}</option>)}
          </select>
          <select className={s.select} value={typeFilter} onChange={e => setType(e.target.value)}>
            {types.map(t => <option key={t}>{t}</option>)}
          </select>
          <span className={s.resultCount}>{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* ---- Proposal Cards ---- */}
      <div className={s.cardList}>
        {filtered.length === 0 && (
          <div className={s.emptyState}>
            <i className="fas fa-folder-open" />
            <p>No proposals match your filters.</p>
            <button className={s.clearBtn} onClick={() => { setSearch(''); setStatus('All'); setType('All'); }}>
              Clear filters
            </button>
          </div>
        )}
        {filtered.map((prop, idx) => {
          const st = STATUS[prop.status] ?? STATUS['Draft'];
          const sectionsComplete = Object.values(prop.sections).filter(Boolean).length;
          const sectionsTotal   = Object.values(prop.sections).length;
          const pct = (sectionsComplete / sectionsTotal) * 100;
          const agencyColor = AGENCY_COLORS[prop.agencyShort] ?? '#374151';

          return (
            <div key={prop.id} className={s.propCard} style={{ animationDelay: `${idx * 40}ms` }}>

              {/* Card header */}
              <div className={s.cardHead}>
                <div className={s.agencyAvatar} style={{ background: agencyColor }}>
                  {prop.agencyShort.slice(0, 2)}
                </div>
                <div className={s.cardMeta}>
                  <div className={s.solNum}>{prop.solicitationNumber}</div>
                  <div className={s.agencyName}>{prop.agency} · {prop.type}</div>
                </div>
                <span className={`${s.statusBadge} ${s[st.cls]}`}>
                  <i className={st.icon} /> {st.label}
                </span>
              </div>

              {/* Title */}
              <h2 className={s.propTitle}>{prop.title}</h2>

              {/* Section completion bar */}
              <div className={s.sectionsRow}>
                <span className={s.sectionsLabel}>Sections</span>
                <div className={s.sectionPills}>
                  {SECTION_LABELS.map(sec => (
                    <span
                      key={sec.key}
                      className={`${s.sectionPill} ${(prop.sections as any)[sec.key] ? s.pillDone : s.pillPending}`}
                      title={sec.label}
                    >
                      {(prop.sections as any)[sec.key]
                        ? <><i className="fas fa-check" /> {sec.label}</>
                        : <>{sec.label}</>
                      }
                    </span>
                  ))}
                </div>
                <span className={s.sectionsCount}>{sectionsComplete}/{sectionsTotal}</span>
              </div>

              {/* Progress bar */}
              <div className={s.progressWrap}>
                <div className={s.progressFill} style={{ width: `${pct}%`, background: pct === 100 ? '#059669' : '#3B82F6' }} />
              </div>

              {/* Detail grid */}
              <div className={s.detailGrid}>
                <div className={s.detail}>
                  <span className={s.detailLabel}>Contract Value</span>
                  <span className={s.detailValue}>{prop.value}</span>
                </div>
                <div className={s.detail}>
                  <span className={s.detailLabel}>Due Date</span>
                  <span className={s.detailValue}>{formatDate(prop.dueDate)}</span>
                </div>
                <div className={s.detail}>
                  <span className={s.detailLabel}>Submitted</span>
                  <span className={s.detailValue}>{formatDate(prop.submittedDate)}</span>
                </div>
                <div className={s.detail}>
                  <span className={s.detailLabel}>Compliance</span>
                  <span className={s.detailValue} style={{ color: scoreColor(prop.complianceScore), fontWeight: 700 }}>
                    {prop.complianceScore}%
                  </span>
                </div>
              </div>

              {/* Footer row */}
              <div className={s.cardFoot}>
                <div className={s.footLeft}>
                  <span className={s.proposalId}>{prop.proposalId}</span>
                  {prop.reviewerFlags > 0 && (
                    <span className={s.flagBadge}>
                      <i className="fas fa-flag" /> {prop.reviewerFlags} flag{prop.reviewerFlags > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <div className={s.cardActions}>
                  <Link href={`/bids/${prop.bidId}/proposal`} className={s.actionBtn} title="View / Edit Proposal">
                    <i className="fas fa-edit" /> Edit
                  </Link>
                  <Link href={`/bids/${prop.bidId}/analyze`} className={s.actionBtn} title="View Analysis">
                    <i className="fas fa-chart-bar" /> Analysis
                  </Link>
                  {prop.status === 'Draft' || prop.status === 'Pending Approval' || prop.status === 'In Review' ? (
                    <Link href={`/bids/${prop.bidId}/submitted`} className={s.submitBtn} title="Submit Proposal">
                      <i className="fas fa-paper-plane" /> Submit
                    </Link>
                  ) : (
                    <button className={s.downloadBtn} title="Download PDF">
                      <i className="fas fa-download" /> PDF
                    </button>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
