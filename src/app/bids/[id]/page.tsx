'use client';

import { useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import solicitations from '@/data/solicitations.json';
import s from './page.module.css';

export default function BidDetailPage({ params }: { params: { id: string } }) {
  const bid = (solicitations as any[]).find((b) => b.id === params.id);
  if (!bid) notFound();

  const [openSection, setOpenSection] = useState<string | null>('pws');

  const docs = [
    { key: 'pws',     label: 'Performance Work Statement (PWS)', content: bid.pwsExcerpt },
    { key: 'sectionL', label: 'Section L — Instructions to Offerors', content: bid.sectionL },
    { key: 'sectionM', label: 'Section M — Evaluation Criteria',      content: bid.sectionM },
  ];

  return (
    <div className={s.page}>

      {/* Breadcrumb */}
      <div className={s.breadcrumb}>
        <Link href="/bids">← Active Bids</Link>
        <span>/</span>
        <span>{bid.solicitationNumber}</span>
      </div>

      {/* Hero */}
      <div className={s.hero}>
        <div className={s.heroLeft}>
          <div className={s.heroTags}>
            <span className={s.tag}>{bid.type}</span>
            <span className={s.tagBlue}>{bid.setAside}</span>
            <span className={s.tag}>{bid.naics} — {bid.naicsDescription}</span>
          </div>
          <h1 className={s.heroTitle}>{bid.title}</h1>
          <p className={s.heroAgency}>{bid.agency}</p>
        </div>
        <div className={s.heroRight}>
          <div className={s.heroMeta}>
            <div className={s.heroMetaItem}>
              <span className={s.heroMetaLabel}>Contract Value</span>
              <span className={s.heroMetaValue} style={{ color: '#2563EB' }}>{bid.value}</span>
            </div>
            <div className={s.heroMetaItem}>
              <span className={s.heroMetaLabel}>Due Date</span>
              <span className={s.heroMetaValue}>{bid.dueDateDisplay}</span>
            </div>
            <div className={s.heroMetaItem}>
              <span className={s.heroMetaLabel}>Status</span>
              <span className={`${s.statusBadge} ${bid.status === 'New' ? s.statusNew : s.statusReview}`}>
                {bid.status}
              </span>
            </div>
          </div>
          <Link href={`/bids/${bid.id}/analyze`} className={s.ctaBtn}>
            <i className="fas fa-bolt" /> Analyze This Bid
          </Link>
        </div>
      </div>

      <div className={s.body}>
        <div className={s.mainCol}>

          {/* Synopsis */}
          <div className={s.card}>
            <h2 className={s.cardTitle}>Synopsis</h2>
            <p className={s.synopsis}>{bid.synopsis}</p>
          </div>

          {/* Documents Accordion */}
          <div className={s.card}>
            <h2 className={s.cardTitle} style={{ marginBottom: 16 }}>Solicitation Documents</h2>
            {docs.map((doc) => (
              <div key={doc.key} className={s.accordion}>
                <button
                  className={`${s.accordionHeader} ${openSection === doc.key ? s.open : ''}`}
                  onClick={() => setOpenSection(openSection === doc.key ? null : doc.key)}
                >
                  <span>{doc.label}</span>
                  <i className={`fas fa-chevron-${openSection === doc.key ? 'up' : 'down'}`} />
                </button>
                {openSection === doc.key && (
                  <div className={s.accordionBody}>
                    <pre className={s.docText}>{doc.content}</pre>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Key Deliverables */}
          <div className={s.card}>
            <h2 className={s.cardTitle} style={{ marginBottom: 16 }}>Key Deliverables</h2>
            <ul className={s.deliverableList}>
              {bid.keyDeliverables.map((d: string, i: number) => (
                <li key={i} className={s.deliverableItem}>
                  <i className="fas fa-check-circle" style={{ color: '#10B981', fontSize: 14 }} />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={s.sideCol}>

          {/* Compliance Snapshot */}
          <div className={s.card}>
            <h2 className={s.cardTitle} style={{ marginBottom: 16 }}>Compliance Snapshot</h2>
            <div className={s.complianceList}>
              {bid.complianceRequirements.map((req: string, i: number) => (
                <div key={i} className={s.complianceItem}>
                  <i className="fas fa-shield-alt" style={{ color: '#3B82F6', fontSize: 13, flexShrink: 0 }} />
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Evaluation Criteria */}
          <div className={s.card}>
            <h2 className={s.cardTitle} style={{ marginBottom: 16 }}>Evaluation Factors</h2>
            {bid.evaluationCriteria.map((ec: any, i: number) => (
              <div key={i} className={s.evalItem}>
                <div className={s.evalFactor}>{ec.factor}</div>
                <div className={s.evalWeight}>{ec.weight}</div>
              </div>
            ))}
          </div>

          {/* POC */}
          <div className={s.card}>
            <h2 className={s.cardTitle} style={{ marginBottom: 12 }}>Point of Contact</h2>
            <div className={s.poc}>
              <div className={s.pocName}>{bid.pointOfContact.name}</div>
              <a href={`mailto:${bid.pointOfContact.email}`} className={s.pocEmail}>
                {bid.pointOfContact.email}
              </a>
              <div className={s.pocPhone}>{bid.pointOfContact.phone}</div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
