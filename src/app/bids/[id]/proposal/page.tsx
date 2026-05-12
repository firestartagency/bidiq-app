'use client';

import { useState } from 'react';
import Link from 'next/link';
import proposalSeeds from '@/data/proposal-seeds.json';
import solicitations from '@/data/solicitations.json';
import s from './page.module.css';

const SECTIONS = [
  { id: 'executiveSummary',  label: 'Executive Summary',  icon: 'fas fa-star' },
  { id: 'technicalApproach', label: 'Technical Approach', icon: 'fas fa-cogs' },
  { id: 'managementPlan',    label: 'Management Plan',     icon: 'fas fa-sitemap' },
  { id: 'pastPerformance',   label: 'Past Performance',    icon: 'fas fa-trophy' },
];

const FLAGS = [
  { type: 'warning',    section: 'Technical Approach', text: 'CMMC Level 2 gap identified — add explicit POA&M completion timeline and C3PAO engagement status.' },
  { type: 'suggestion', section: 'Executive Summary',  text: 'Consider quantifying the SOC uptime metric (99.98%) earlier in the summary to immediately differentiate.' },
  { type: 'warning',    section: 'Past Performance',   text: 'Reference contract FA8773-23-C-0041 — confirm COR contact details are current before submission.' },
];

export default function ProposalPage({ params }: { params: { id: string } }) {
  const seed = (proposalSeeds.seeds as any[]).find((s) => s.bidId === params.id);
  const sections = seed?.sections ?? {};
  const solicitation = (solicitations as any[]).find((s) => s.id === params.id);

  const [activeSection, setActiveSection]   = useState('executiveSummary');
  const [editMode, setEditMode]             = useState(false);
  const [content, setContent]               = useState<Record<string, string>>(sections);
  const [downloading, setDownloading]       = useState(false);
  const [downloadError, setDownloadError]   = useState<string | null>(null);

  const currentContent = content[activeSection] ?? 'Section content not available.';

  async function handleDownloadPDF() {
    if (!solicitation) return;
    setDownloading(true);
    setDownloadError(null);
    try {
      const proposalId = `BIQ-${params.id.toUpperCase()}-001`;
      const res = await fetch('/api/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ solicitation, proposal: content, proposalId }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'PDF generation failed');
      }
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `Proposal_${solicitation.solicitationNumber}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setDownloadError(err.message ?? 'Download failed');
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className={s.page}>

      {/* Breadcrumb */}
      <div className={s.breadcrumb}>
        <Link href="/bids">← Active Bids</Link>
        <span>/</span>
        <Link href={`/bids/${params.id}`}>{params.id.toUpperCase()}</Link>
        <span>/</span>
        <span>Proposal Review</span>
      </div>

      {/* Header */}
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>Proposal Review</h1>
          <p className={s.pageSub}>Review, edit, and approve the AI-generated proposal draft before submission</p>
        </div>
        <div className={s.headerActions}>
          <button
            className={`${s.toggleBtn} ${editMode ? s.toggleActive : ''}`}
            onClick={() => setEditMode(!editMode)}
          >
            <i className={`fas fa-${editMode ? 'eye' : 'edit'}`} />
            {editMode ? 'Preview Mode' : 'Edit Mode'}
          </button>
          <button
            className={s.downloadBtn}
            onClick={handleDownloadPDF}
            disabled={downloading}
            title={downloadError ?? undefined}
          >
            {downloading
              ? <><i className="fas fa-spinner fa-spin" /> Generating…</>
              : <><i className="fas fa-download" /> Download PDF</>
            }
          </button>
          {downloadError && <span className={s.errorText}>{downloadError}</span>}
          <Link href={`/bids/${params.id}/submitted`} className={s.approveBtn}>
            <i className="fas fa-check" /> Approve & Submit
          </Link>
        </div>
      </div>

      <div className={s.layout}>

        {/* Left nav */}
        <div className={s.leftNav}>
          <div className={s.navCard}>
            <div className={s.navTitle}>Proposal Sections</div>
            {SECTIONS.map((sec) => (
              <button
                key={sec.id}
                className={`${s.navItem} ${activeSection === sec.id ? s.navItemActive : ''}`}
                onClick={() => setActiveSection(sec.id)}
              >
                <i className={`${sec.icon} ${s.navIcon}`} />
                {sec.label}
              </button>
            ))}
          </div>

          {/* Compliance flags */}
          <div className={s.flagsCard}>
            <div className={s.navTitle}>
              <i className="fas fa-flag" style={{ color: '#EF4444', fontSize: 12 }} /> Reviewer Flags
            </div>
            {FLAGS.map((flag, i) => (
              <div key={i} className={`${s.flag} ${flag.type === 'warning' ? s.flagWarning : s.flagSuggestion}`}>
                <div className={s.flagSection}>{flag.section}</div>
                <div className={s.flagText}>{flag.text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right content */}
        <div className={s.rightPanel}>
          <div className={s.contentCard}>
            <div className={s.contentHeader}>
              <h2 className={s.contentTitle}>
                {SECTIONS.find(s => s.id === activeSection)?.label}
              </h2>
              {editMode && <span className={s.editingBadge}><i className="fas fa-pen" /> Editing</span>}
            </div>

            {editMode ? (
              <textarea
                className={s.editor}
                value={currentContent}
                onChange={(e) => setContent({ ...content, [activeSection]: e.target.value })}
              />
            ) : (
              <div className={s.contentBody}>
                {currentContent
                  ? currentContent.split('\n').map((para, i) =>
                      para.trim()
                        ? <p key={i} className={s.para}>{para}</p>
                        : null
                    )
                  : <p className={s.empty}>Content not available for this section.</p>
                }
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
