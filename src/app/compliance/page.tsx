'use client';

import { useState } from 'react';
import s from './page.module.css';

/* ---- static data ---- */
const CERTIFICATIONS = [
  {
    name: '8(a) Business Development Program',
    issuedBy: 'U.S. Small Business Administration',
    status: 'Active',
    issued: '2020-09-30',
    expires: '2028-09-30',
    daysUntil: 856,
    description: 'Sole-source and competitive set-aside eligibility for DoD and civilian agencies.',
    icon: 'fas fa-certificate',
    color: '#7C3AED',
  },
  {
    name: 'SDVOSB Verification',
    issuedBy: 'VA / Vets First Verification Program',
    status: 'Active',
    issued: '2019-04-12',
    expires: null,
    daysUntil: null,
    description: 'Service-Disabled Veteran-Owned Small Business — no expiration, subject to annual self-attestation.',
    icon: 'fas fa-medal',
    color: '#059669',
  },
  {
    name: 'HUBZone Certification',
    issuedBy: 'U.S. Small Business Administration',
    status: 'Active',
    issued: '2023-06-15',
    expires: '2027-06-15',
    daysUntil: 399,
    description: 'Historically Underutilized Business Zone — requires annual recertification and principal office compliance.',
    icon: 'fas fa-map-marked-alt',
    color: '#D97706',
  },
  {
    name: 'ISO 9001:2015 Quality Management',
    issuedBy: 'Bureau Veritas Certification',
    status: 'Active',
    issued: '2024-11-30',
    expires: '2027-11-30',
    daysUntil: 567,
    description: 'Quality management system certification covering all service delivery operations.',
    icon: 'fas fa-check-double',
    color: '#0EA5E9',
  },
  {
    name: 'CMMC Level 2',
    issuedBy: 'Authorized C3PAO (Pending Assessment)',
    status: 'In Progress',
    issued: null,
    expires: null,
    daysUntil: null,
    pctComplete: 68,
    description: 'Cybersecurity Maturity Model Certification required for DoD contracts involving CUI. Assessment scheduled Q3 2026.',
    icon: 'fas fa-shield-alt',
    color: '#EA580C',
  },
  {
    name: 'SAM.gov Registration',
    issuedBy: 'System for Award Management',
    status: 'Active',
    issued: '2024-03-15',
    expires: '2027-03-15',
    daysUntil: 307,
    description: 'Required for all federal prime contractors. Must be renewed annually.',
    icon: 'fas fa-id-badge',
    color: '#2563EB',
  },
];

const ACTION_ITEMS = [
  {
    id: 'ai-001',
    priority: 'High',
    category: 'CMMC',
    title: 'Complete CMMC Level 2 POA&M',
    detail: 'Remediate 7 remaining CUI handling gaps identified during pre-assessment. C3PAO assessment scheduled Aug 2026.',
    dueDate: '2026-07-15',
    assignedTo: 'Marcus Thorne',
    status: 'In Progress',
  },
  {
    id: 'ai-002',
    priority: 'High',
    category: 'Clearance',
    title: 'Renew Top Secret clearance — Keisha Williams',
    detail: 'Periodic Reinvestigation (PR) due. Submit eQIP package and notify FSO. Delay may impact key personnel eligibility on DISA bid.',
    dueDate: '2026-06-30',
    assignedTo: 'Ronald Davis (FSO)',
    status: 'Pending',
  },
  {
    id: 'ai-003',
    priority: 'Medium',
    category: 'HUBZone',
    title: 'HUBZone annual recertification',
    detail: 'Verify principal office address qualifies. Confirm 35% HUBZone employee requirement. Submit recertification through SBA portal.',
    dueDate: '2026-08-01',
    assignedTo: 'Marcus Thorne',
    status: 'Not Started',
  },
  {
    id: 'ai-004',
    priority: 'Medium',
    category: 'Regulatory',
    title: 'Update System Security Plan (SSP)',
    detail: 'SSP must reflect Q1 infrastructure changes including new AWS GovCloud environment and updated access control policies.',
    dueDate: '2026-06-15',
    assignedTo: 'Dr. Serena Washington',
    status: 'In Progress',
  },
  {
    id: 'ai-005',
    priority: 'Low',
    category: 'SAM.gov',
    title: 'Verify NAICS codes for upcoming renewal',
    detail: 'Confirm all 5 NAICS codes are accurate for upcoming SAM renewal in March 2027. Consider adding NAICS 541519.',
    dueDate: '2027-01-15',
    assignedTo: 'Ronald Davis',
    status: 'Not Started',
  },
];

const FAR_DFARS = [
  { clause: 'FAR 52.204-7',  title: 'System for Award Management',          category: 'Registration', status: 'Compliant',    note: 'Active through 2027-03-15' },
  { clause: 'FAR 52.219-14', title: 'Limitations on Subcontracting (8a)',    category: '8(a)',         status: 'Compliant',    note: 'Monitored per contract award' },
  { clause: 'FAR 52.222-26', title: 'Equal Opportunity',                     category: 'HR/Labor',     status: 'Compliant',    note: 'EEO policy posted and current' },
  { clause: 'FAR 52.222-41', title: 'Service Contract Labor Standards',      category: 'HR/Labor',     status: 'Compliant',    note: 'Wage determinations applied to all SCA contracts' },
  { clause: 'FAR 52.227-14', title: 'Rights in Data — General',              category: 'IP',           status: 'Compliant',    note: 'IP policy documented' },
  { clause: 'DFARS 252.204-7012', title: 'Safeguarding Covered Defense Info', category: 'Cybersecurity',status: 'Partial',     note: 'SSP active; CMMC Level 2 in progress' },
  { clause: 'DFARS 252.204-7020', title: 'NIST SP 800-171 Assessment',       category: 'Cybersecurity',status: 'Partial',     note: 'Self-assessment score: 91/110. Gap remediation ongoing.' },
  { clause: 'DFARS 252.239-7010', title: 'Cloud Computing Services',         category: 'Cybersecurity',status: 'Compliant',    note: 'All cloud on FedRAMP Authorized systems (AWS GovCloud)' },
  { clause: 'FAR 52.215-2',  title: 'Audit and Records — Negotiation',       category: 'Financial',    status: 'Compliant',    note: 'QuickBooks Gov edition; DCAA compliant accounting' },
  { clause: 'FAR 52.232-33', title: 'Payment by EFT — SAM',                  category: 'Financial',    status: 'Compliant',    note: 'Bank info verified in SAM.gov' },
];

const CALENDAR = [
  { date: '2026-06-15', event: 'System Security Plan (SSP) Update Due',        category: 'Cybersecurity', priority: 'high' },
  { date: '2026-06-30', event: 'Keisha Williams — TS Clearance PR eQIP Due',   category: 'Clearance',     priority: 'high' },
  { date: '2026-07-15', event: 'CMMC POA&M Remediation Deadline',               category: 'CMMC',          priority: 'high' },
  { date: '2026-08-01', event: 'HUBZone Annual Recertification',                category: 'HUBZone',       priority: 'medium' },
  { date: '2026-09-30', event: 'AFMC Contract FA8773-23-C-0041 Closeout',       category: 'Contract',      priority: 'medium' },
  { date: '2027-01-15', event: 'SAM.gov NAICS Code Review (pre-renewal)',       category: 'SAM.gov',       priority: 'low' },
  { date: '2027-03-15', event: 'SAM.gov Registration Renewal',                  category: 'SAM.gov',       priority: 'medium' },
  { date: '2027-06-15', event: 'HUBZone Certification Expiration',              category: 'HUBZone',       priority: 'high' },
];

const PRIORITY_CLS: Record<string, string> = { High: 'priorityHigh', Medium: 'priorityMed', Low: 'priorityLow' };
const STATUS_CLS: Record<string, string>   = {
  Compliant: 'statusGood', Partial: 'statusPartial', 'Non-Compliant': 'statusBad',
  Active: 'statusGood', 'In Progress': 'statusPartial', Pending: 'statusPending', 'Not Started': 'statusNS',
};
const CAL_CLS: Record<string, string> = { high: 'calHigh', medium: 'calMed', low: 'calLow' };

function daysFromNow(dateStr: string) {
  const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
  return diff;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function CompliancePage() {
  const [farFilter, setFarFilter] = useState<string>('All');
  const farCategories = ['All', ...Array.from(new Set(FAR_DFARS.map(r => r.category)))];

  const filteredFar = farFilter === 'All' ? FAR_DFARS : FAR_DFARS.filter(r => r.category === farFilter);

  const openItems   = ACTION_ITEMS.filter(a => a.status !== 'Resolved').length;
  const highPri     = ACTION_ITEMS.filter(a => a.priority === 'High').length;
  const activeCerts = CERTIFICATIONS.filter(c => c.status === 'Active').length;
  const expiringSoon = CERTIFICATIONS.filter(c => c.daysUntil !== null && c.daysUntil !== undefined && c.daysUntil < 400).length;

  return (
    <div className={s.page}>

      {/* ---- Header ---- */}
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>Compliance Center</h1>
          <p className={s.pageSub}>Manage certifications, regulatory obligations, and action items across all active contracts</p>
        </div>
        <div className={s.scoreCard}>
          <div className={s.scoreRing}>
            <span className={s.scoreNum}>78</span>
            <span className={s.scoreLabel}>/ 100</span>
          </div>
          <div>
            <div className={s.scoreTitle}>Compliance Score</div>
            <div className={s.scoreSub}>2 open gaps · 3 action items</div>
          </div>
        </div>
      </div>

      {/* ---- Stats Row ---- */}
      <div className={s.statsRow}>
        {[
          { icon: 'fas fa-certificate', color: '#EFF6FF', iconColor: '#2563EB', value: activeCerts, label: 'Active Certifications' },
          { icon: 'fas fa-clock',        color: '#FFFBEB', iconColor: '#D97706', value: expiringSoon, label: 'Expiring in 400 Days' },
          { icon: 'fas fa-exclamation-circle', color: '#FEF2F2', iconColor: '#DC2626', value: openItems, label: 'Open Action Items' },
          { icon: 'fas fa-fire',          color: '#FFF7ED', iconColor: '#EA580C', value: highPri,    label: 'High Priority' },
          { icon: 'fas fa-check-circle',  color: '#ECFDF5', iconColor: '#059669', value: FAR_DFARS.filter(r => r.status === 'Compliant').length, label: 'FAR/DFARS Compliant' },
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

      {/* ---- Certifications + Action Items ---- */}
      <div className={s.row2}>

        {/* Certifications */}
        <div className={s.card} style={{ flex: 3 }}>
          <div className={s.cardHeader}>
            <h2 className={s.cardTitle}><i className="fas fa-certificate" /> Certification Tracker</h2>
          </div>
          <div className={s.certList}>
            {CERTIFICATIONS.map((cert, i) => {
              const expiring = cert.daysUntil !== null && cert.daysUntil !== undefined && cert.daysUntil < 400;
              return (
                <div key={i} className={`${s.certCard} ${expiring ? s.certExpiring : ''}`}>
                  <div className={s.certIcon} style={{ background: cert.color + '15', color: cert.color }}>
                    <i className={cert.icon} />
                  </div>
                  <div className={s.certBody}>
                    <div className={s.certTop}>
                      <span className={s.certName}>{cert.name}</span>
                      <span className={`${s.certBadge} ${s[cert.status === 'Active' ? 'badgeGreen' : 'badgeOrange']}`}>
                        {cert.status}
                      </span>
                    </div>
                    <div className={s.certIssuer}>{cert.issuedBy}</div>
                    <div className={s.certDesc}>{cert.description}</div>
                    {'pctComplete' in cert && cert.pctComplete !== undefined ? (
                      <div className={s.cmmcRow}>
                        <span className={s.cmmcLabel}>Assessment Progress</span>
                        <div className={s.progressWrap}>
                          <div className={s.progressFill} style={{ width: `${cert.pctComplete}%`, background: cert.color }} />
                        </div>
                        <span className={s.cmmcPct}>{cert.pctComplete}%</span>
                      </div>
                    ) : (
                      cert.expires && (
                        <div className={s.certDates}>
                          <span className={s.certDateItem}><i className="fas fa-calendar-check" /> Issued: {cert.issued ? formatDate(cert.issued) : '—'}</span>
                          <span className={s.certDateItem} style={{ color: expiring ? '#D97706' : '#6B7280' }}>
                            <i className="fas fa-calendar-times" /> Expires: {formatDate(cert.expires)}
                            {cert.daysUntil !== null && cert.daysUntil !== undefined && (
                              <span className={`${s.daysTag} ${expiring ? s.daysTagWarn : s.daysTagOk}`}>{cert.daysUntil}d</span>
                            )}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Items */}
        <div className={s.card} style={{ flex: 2 }}>
          <div className={s.cardHeader}>
            <h2 className={s.cardTitle}><i className="fas fa-tasks" /> Action Items</h2>
          </div>
          <div className={s.actionList}>
            {ACTION_ITEMS.map((item, i) => {
              const days = daysFromNow(item.dueDate);
              const urgent = days < 45;
              return (
                <div key={i} className={s.actionCard}>
                  <div className={s.actionTop}>
                    <div className={s.actionLeft}>
                      <span className={`${s.priorityTag} ${s[PRIORITY_CLS[item.priority]]}`}>{item.priority}</span>
                      <span className={s.actionCategory}>{item.category}</span>
                    </div>
                    <span className={`${s.actionStatus} ${s[STATUS_CLS[item.status] ?? 'statusNS']}`}>{item.status}</span>
                  </div>
                  <div className={s.actionTitle}>{item.title}</div>
                  <div className={s.actionDetail}>{item.detail}</div>
                  <div className={s.actionFoot}>
                    <span className={s.actionAssigned}><i className="fas fa-user" /> {item.assignedTo}</span>
                    <span className={`${s.actionDue} ${urgent ? s.actionDueUrgent : ''}`}>
                      <i className="fas fa-calendar-alt" /> {formatDate(item.dueDate)} {urgent && <span className={s.urgentTag}>URGENT</span>}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ---- FAR/DFARS Checklist ---- */}
      <div className={s.card}>
        <div className={s.cardHeader}>
          <h2 className={s.cardTitle}><i className="fas fa-clipboard-list" /> FAR / DFARS Compliance Checklist</h2>
          <div className={s.farFilters}>
            {farCategories.map(cat => (
              <button
                key={cat}
                className={`${s.filterChip} ${farFilter === cat ? s.filterChipActive : ''}`}
                onClick={() => setFarFilter(cat)}
              >{cat}</button>
            ))}
          </div>
        </div>
        <table className={s.table}>
          <thead>
            <tr>
              <th>Clause</th>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {filteredFar.map((row, i) => (
              <tr key={i}>
                <td><span className={s.clauseCode}>{row.clause}</span></td>
                <td className={s.clauseTitle}>{row.title}</td>
                <td><span className={s.catTag}>{row.category}</span></td>
                <td>
                  <span className={`${s.statusBadge} ${s[STATUS_CLS[row.status] ?? 'statusNS']}`}>
                    {row.status === 'Compliant' && <i className="fas fa-check-circle" />}
                    {row.status === 'Partial'    && <i className="fas fa-exclamation-circle" />}
                    {row.status === 'Non-Compliant' && <i className="fas fa-times-circle" />}
                    {' '}{row.status}
                  </span>
                </td>
                <td className={s.noteText}>{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---- Compliance Calendar ---- */}
      <div className={s.card}>
        <div className={s.cardHeader}>
          <h2 className={s.cardTitle}><i className="fas fa-calendar-alt" /> Compliance Calendar</h2>
          <span className={s.cardSub}>{CALENDAR.length} upcoming events</span>
        </div>
        <div className={s.calendarList}>
          {CALENDAR.map((ev, i) => {
            const days = daysFromNow(ev.date);
            return (
              <div key={i} className={`${s.calRow} ${s[CAL_CLS[ev.priority]]}`}>
                <div className={s.calDate}>
                  <div className={s.calMonth}>{new Date(ev.date).toLocaleDateString('en-US', { month: 'short' })}</div>
                  <div className={s.calDay}>{new Date(ev.date).getDate()}</div>
                  <div className={s.calYear}>{new Date(ev.date).getFullYear()}</div>
                </div>
                <div className={s.calBody}>
                  <div className={s.calEvent}>{ev.event}</div>
                  <span className={s.calCat}>{ev.category}</span>
                </div>
                <div className={s.calRight}>
                  <span className={`${s.calDays} ${days < 60 ? s.calDaysUrgent : days < 180 ? s.calDaysMed : s.calDaysOk}`}>
                    {days > 0 ? `${days}d away` : 'Overdue'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
