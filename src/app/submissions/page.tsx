'use client';

import { useState } from 'react';
import Link from 'next/link';
import s from './page.module.css';

/* ---- data ---- */
const SUBMISSIONS = [
  {
    id: 'sub-001',
    bidId: 'bid-001',
    proposalId: 'BIQ-DISA-HC-2026-R-0042-001',
    solicitationNumber: 'DISA-HC-2026-R-0042',
    title: 'IT Infrastructure Modernization & Cybersecurity Operations',
    agency: 'DISA',
    agencyFull: 'Defense Information Systems Agency',
    type: 'RFP',
    value: '$24.5M',
    setAside: '8(a) Competitive',
    submittedDate: '2026-05-12T14:32:00',
    dueDate: '2026-06-15',
    status: 'Under Evaluation',
    complianceScore: 84,
    awardDecisionEta: '2026-08-30',
    coName: 'Maj. Dennis K. Carter',
    coEmail: 'dennis.carter@disa.mil',
    timeline: [
      { label: 'Submitted',           date: '2026-05-12', done: true  },
      { label: 'Receipt Acknowledged', date: '2026-05-13', done: true  },
      { label: 'Technical Evaluation', date: null,         done: false, active: true },
      { label: 'Best Value Analysis',  date: null,         done: false },
      { label: 'Award Decision',       date: '2026-08-30', done: false },
    ],
    notes: 'Proposal received confirmation from CO on 5/13. Evaluation Notice (EN) period active through June 30.',
  },
  {
    id: 'sub-002',
    bidId: 'bid-002',
    proposalId: 'BIQ-GSA-MAS-2026-Q-0019-001',
    solicitationNumber: 'GSA-MAS-2026-Q-0019',
    title: 'Professional Services & Administrative Support — GSA MAS',
    agency: 'GSA',
    agencyFull: 'General Services Administration',
    type: 'RFQ',
    value: '$8.2M',
    setAside: 'SDVOSB',
    submittedDate: '2026-05-05T09:15:00',
    dueDate: '2026-05-10',
    status: 'Award Decision Pending',
    complianceScore: 92,
    awardDecisionEta: '2026-06-30',
    coName: 'Patricia R. Nguyen',
    coEmail: 'patricia.nguyen@gsa.gov',
    timeline: [
      { label: 'Submitted',            date: '2026-05-05', done: true  },
      { label: 'Receipt Acknowledged', date: '2026-05-06', done: true  },
      { label: 'Technical Evaluation', date: '2026-05-20', done: true  },
      { label: 'Best Value Analysis',  date: '2026-06-01', done: true  },
      { label: 'Award Decision',       date: '2026-06-30', done: false, active: true },
    ],
    notes: 'Passed technical evaluation. Best value determination in progress. No ENs issued.',
  },
  {
    id: 'sub-003',
    bidId: 'bid-001',
    proposalId: 'BIQ-VA-CLOUD-2026-R-0014-001',
    solicitationNumber: 'VA-CLOUD-2026-R-0014',
    title: 'Veterans Affairs Cloud Infrastructure & DevSecOps Support',
    agency: 'VA',
    agencyFull: 'Department of Veterans Affairs',
    type: 'RFP',
    value: '$18.7M',
    setAside: 'SDVOSB',
    submittedDate: '2026-04-22T16:45:00',
    dueDate: '2026-04-25',
    status: 'Won',
    complianceScore: 89,
    awardDecisionEta: null,
    awardDate: '2026-05-08',
    contractNumber: 'VA-36C10X24P0088',
    coName: 'Patricia L. Dawson',
    coEmail: 'patricia.dawson@va.gov',
    timeline: [
      { label: 'Submitted',            date: '2026-04-22', done: true },
      { label: 'Receipt Acknowledged', date: '2026-04-23', done: true },
      { label: 'Technical Evaluation', date: '2026-04-30', done: true },
      { label: 'Best Value Analysis',  date: '2026-05-06', done: true },
      { label: 'Award Decision',       date: '2026-05-08', done: true },
    ],
    notes: 'CONTRACT AWARDED. Contract No. VA-36C10X24P0088. Period of Performance: Jul 1 2026 – Jun 30 2028. Kickoff meeting scheduled Jun 15.',
  },
  {
    id: 'sub-004',
    bidId: 'bid-001',
    proposalId: 'BIQ-DOD-CYBER-2025-R-0088-001',
    solicitationNumber: 'DoD-CYBER-2025-R-0088',
    title: 'Cybersecurity Advisory & Penetration Testing Services',
    agency: 'DoD',
    agencyFull: 'Department of Defense',
    type: 'RFP',
    value: '$6.4M',
    setAside: '8(a) Sole Source',
    submittedDate: '2026-01-15T11:00:00',
    dueDate: '2026-01-20',
    status: 'Won',
    complianceScore: 96,
    awardDate: '2026-02-14',
    contractNumber: 'W911QX26C0041',
    coName: 'Maj. Sandra H. Pierce',
    coEmail: 'sandra.pierce@army.mil',
    timeline: [
      { label: 'Submitted',            date: '2026-01-15', done: true },
      { label: 'Receipt Acknowledged', date: '2026-01-16', done: true },
      { label: 'Technical Evaluation', date: '2026-01-28', done: true },
      { label: 'Best Value Analysis',  date: '2026-02-07', done: true },
      { label: 'Award Decision',       date: '2026-02-14', done: true },
    ],
    notes: 'CONTRACT AWARDED. Active. Period of Performance: Mar 1 2026 – Feb 28 2027.',
  },
  {
    id: 'sub-005',
    bidId: 'bid-002',
    proposalId: 'BIQ-HHS-IT-2025-R-0031-001',
    solicitationNumber: 'HHS-IT-2025-R-0031',
    title: 'Health IT Data Analytics & Cloud Migration',
    agency: 'HHS',
    agencyFull: 'Dept. of Health & Human Services',
    type: 'RFP',
    value: '$11.2M',
    setAside: 'Small Business',
    submittedDate: '2025-11-30T10:00:00',
    dueDate: '2025-12-01',
    status: 'Lost',
    complianceScore: 78,
    awardDate: '2026-01-20',
    awardedTo: 'Nexgen Federal LLC',
    coName: 'Richard W. Flores',
    coEmail: 'richard.flores@hhs.gov',
    timeline: [
      { label: 'Submitted',            date: '2025-11-30', done: true },
      { label: 'Receipt Acknowledged', date: '2025-12-02', done: true },
      { label: 'Technical Evaluation', date: '2026-01-05', done: true },
      { label: 'Best Value Analysis',  date: '2026-01-15', done: true },
      { label: 'Award Decision',       date: '2026-01-20', done: true },
    ],
    notes: 'Not selected. Award to Nexgen Federal LLC. Debriefing requested 1/22. Debrief scheduled 2/10 — price was competitive, tech approach scored lower on Section M Factor 2 (Management).',
  },
];

const STATUS_CONFIG: Record<string, { cls: string; icon: string; color: string }> = {
  'Submitted':             { cls: 'statusSubmitted', icon: 'fas fa-paper-plane', color: '#2563EB' },
  'Under Evaluation':      { cls: 'statusEval',      icon: 'fas fa-search',       color: '#7C3AED' },
  'Award Decision Pending':{ cls: 'statusPending',   icon: 'fas fa-hourglass-half',color: '#D97706' },
  'Won':                   { cls: 'statusWon',       icon: 'fas fa-trophy',       color: '#059669' },
  'Lost':                  { cls: 'statusLost',      icon: 'fas fa-times-circle', color: '#DC2626' },
};

const AGENCY_COLORS: Record<string, string> = {
  DISA: '#1E3A8A', GSA: '#065F46', VA: '#1E40AF', DoD: '#581C87', HHS: '#9F1239',
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function SubmissionsPage() {
  const [filter, setFilter] = useState('All');
  const [expanded, setExpanded] = useState<string | null>(null);

  const statuses = ['All', 'Under Evaluation', 'Award Decision Pending', 'Won', 'Lost'];
  const filtered = filter === 'All' ? SUBMISSIONS : SUBMISSIONS.filter(s => s.status === filter);

  const won       = SUBMISSIONS.filter(s => s.status === 'Won').length;
  const lost      = SUBMISSIONS.filter(s => s.status === 'Lost').length;
  const active    = SUBMISSIONS.filter(s => !['Won','Lost'].includes(s.status)).length;
  const totalWonValue = SUBMISSIONS
    .filter(s => s.status === 'Won')
    .reduce((acc, s) => acc + parseFloat(s.value.replace(/[$M,]/g, '')), 0);

  return (
    <div className={s.page}>

      {/* ---- Header ---- */}
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>Submissions</h1>
          <p className={s.pageSub}>Track every submitted proposal from receipt acknowledgment to award decision</p>
        </div>
      </div>

      {/* ---- Stats ---- */}
      <div className={s.statsRow}>
        {[
          { icon: 'fas fa-paper-plane', bg: '#EFF6FF', ic: '#2563EB', val: SUBMISSIONS.length, label: 'Total Submitted' },
          { icon: 'fas fa-spinner',     bg: '#F5F3FF', ic: '#7C3AED', val: active,             label: 'Pending Decision' },
          { icon: 'fas fa-trophy',      bg: '#ECFDF5', ic: '#059669', val: won,                label: 'Awards Won' },
          { icon: 'fas fa-times-circle',bg: '#FEF2F2', ic: '#DC2626', val: lost,               label: 'Not Selected' },
          { icon: 'fas fa-dollar-sign', bg: '#FFFBEB', ic: '#D97706', val: `$${totalWonValue.toFixed(1)}M`, label: 'Total Contract Value Won' },
        ].map((st, i) => (
          <div key={i} className={s.statCard}>
            <div className={s.statIcon} style={{ background: st.bg, color: st.ic }}><i className={st.icon} /></div>
            <div>
              <div className={s.statValue}>{st.val}</div>
              <div className={s.statLabel}>{st.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ---- Filter bar ---- */}
      <div className={s.filterBar}>
        {statuses.map(st => (
          <button
            key={st}
            className={`${s.filterChip} ${filter === st ? s.filterActive : ''}`}
            onClick={() => setFilter(st)}
          >{st} {filter === st && filtered.length > 0 && <span className={s.filterCount}>{filtered.length}</span>}</button>
        ))}
      </div>

      {/* ---- Submission Cards ---- */}
      <div className={s.cardList}>
        {filtered.map(sub => {
          const st = STATUS_CONFIG[sub.status];
          const isOpen = expanded === sub.id;
          const agencyColor = AGENCY_COLORS[sub.agency] ?? '#374151';

          return (
            <div key={sub.id} className={`${s.subCard} ${sub.status === 'Won' ? s.subCardWon : ''} ${sub.status === 'Lost' ? s.subCardLost : ''}`}>

              {/* Card Header */}
              <div className={s.cardHead}>
                <div className={s.agencyAvatar} style={{ background: agencyColor }}>{sub.agency.slice(0,2)}</div>
                <div className={s.headMeta}>
                  <div className={s.solNum}>{sub.solicitationNumber}</div>
                  <div className={s.agencyType}>{sub.agencyFull} · {sub.type} · {sub.setAside}</div>
                </div>
                <span className={`${s.statusBadge} ${s[st.cls]}`}>
                  <i className={st.icon} /> {sub.status}
                </span>
              </div>

              {/* Title + value row */}
              <div className={s.titleRow}>
                <h2 className={s.subTitle}>{sub.title}</h2>
                <div className={s.valueTag}>{sub.value}</div>
              </div>

              {/* Proposal IDs */}
              <div className={s.idRow}>
                <span className={s.propId}><i className="fas fa-hashtag" /> {sub.proposalId}</span>
                {(sub as any).contractNumber && (
                  <span className={s.contractNum}><i className="fas fa-file-contract" /> Contract: {(sub as any).contractNumber}</span>
                )}
                {sub.status === 'Lost' && (sub as any).awardedTo && (
                  <span className={s.awardedTo}><i className="fas fa-award" /> Awarded to: {(sub as any).awardedTo}</span>
                )}
              </div>

              {/* Timeline */}
              <div className={s.timeline}>
                {sub.timeline.map((step, i) => (
                  <div key={i} className={s.timelineStep}>
                    <div className={`${s.stepDot} ${step.done ? s.dotDone : ''} ${(step as any).active ? s.dotActive : ''}`}>
                      {step.done
                        ? <i className="fas fa-check" />
                        : (step as any).active ? <span className={s.pulse} /> : <span>{i + 1}</span>
                      }
                    </div>
                    <div className={s.stepInfo}>
                      <div className={`${s.stepLabel} ${step.done || (step as any).active ? s.stepLabelOn : ''}`}>{step.label}</div>
                      {step.date && <div className={s.stepDate}>{fmtDate(step.date)}</div>}
                    </div>
                    {i < sub.timeline.length - 1 && (
                      <div className={`${s.stepLine} ${step.done ? s.stepLineDone : ''}`} />
                    )}
                  </div>
                ))}
              </div>

              {/* Key dates strip */}
              <div className={s.datesStrip}>
                <div className={s.dateItem}>
                  <span className={s.dateLabel}>Submitted</span>
                  <span className={s.dateVal}>{fmtDateTime(sub.submittedDate)}</span>
                </div>
                <div className={s.dateItem}>
                  <span className={s.dateLabel}>Proposal Due</span>
                  <span className={s.dateVal}>{fmtDate(sub.dueDate)}</span>
                </div>
                <div className={s.dateItem}>
                  <span className={s.dateLabel}>Compliance Score</span>
                  <span className={s.dateVal} style={{ color: sub.complianceScore >= 90 ? '#059669' : sub.complianceScore >= 75 ? '#D97706' : '#DC2626', fontWeight: 700 }}>
                    {sub.complianceScore}%
                  </span>
                </div>
                <div className={s.dateItem}>
                  <span className={s.dateLabel}>{sub.status === 'Won' ? 'Award Date' : sub.status === 'Lost' ? 'Decision Date' : 'Award ETA'}</span>
                  <span className={s.dateVal}>
                    {(sub as any).awardDate ? fmtDate((sub as any).awardDate) : (sub.awardDecisionEta ? fmtDate(sub.awardDecisionEta) : '—')}
                  </span>
                </div>
              </div>

              {/* Notes + expand toggle */}
              <div className={s.cardFoot}>
                <button className={s.toggleNotes} onClick={() => setExpanded(isOpen ? null : sub.id)}>
                  <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`} /> {isOpen ? 'Hide' : 'Show'} Notes & Actions
                </button>
              </div>

              {/* Expanded: notes + CO + actions */}
              {isOpen && (
                <div className={s.expanded}>
                  {sub.notes && (
                    <div className={s.notesBox}>
                      <div className={s.notesLabel}><i className="fas fa-sticky-note" /> Notes</div>
                      <p className={s.notesText}>{sub.notes}</p>
                    </div>
                  )}
                  <div className={s.expandedGrid}>
                    <div className={s.coCard}>
                      <div className={s.coLabel}>Contracting Officer</div>
                      <div className={s.coName}>{sub.coName}</div>
                      <a href={`mailto:${sub.coEmail}`} className={s.coEmail}><i className="fas fa-envelope" /> {sub.coEmail}</a>
                    </div>
                    <div className={s.actionsCard}>
                      <div className={s.coLabel}>Quick Actions</div>
                      <div className={s.actionBtns}>
                        <Link href={`/bids/${sub.bidId}/proposal`} className={s.actionBtn}>
                          <i className="fas fa-file-alt" /> View Proposal
                        </Link>
                        <Link href={`/bids/${sub.bidId}/analyze`} className={s.actionBtn}>
                          <i className="fas fa-chart-bar" /> Analysis Report
                        </Link>
                        <button className={s.actionBtn}>
                          <i className="fas fa-download" /> Download PDF
                        </button>
                        <a href={`mailto:${sub.coEmail}?subject=Re: ${sub.solicitationNumber}`} className={s.actionBtn}>
                          <i className="fas fa-envelope" /> Contact CO
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}
