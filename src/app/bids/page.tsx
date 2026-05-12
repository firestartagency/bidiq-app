import Link from 'next/link';
import solicitations from '@/data/solicitations.json';
import s from './page.module.css';

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  'In Review':      { label: 'In Review',      cls: 'review' },
  'Proposal Ready': { label: 'Proposal Ready', cls: 'ready'  },
  'New':            { label: 'New',            cls: 'new'    },
  'Submitted':      { label: 'Submitted',      cls: 'done'   },
};

const AGENCY_COLORS: Record<string, string> = {
  DISA:  '#1E3A8A',
  GSA:   '#065F46',
  USACE: '#78350F',
  DoD:   '#581C87',
  HHS:   '#9F1239',
};

export default function BidsPage() {
  const bids = solicitations as any[];

  return (
    <div className={s.page}>
      {/* Header */}
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>Active Bids</h1>
          <p className={s.pageSub}>{bids.length} solicitations tracked — click any bid to review and analyze</p>
        </div>
        <button className={s.importBtn} id="bids-import-btn">
          <i className="fas fa-plus" /> Import Bid
        </button>
      </div>

      {/* Bid cards */}
      <div className={s.bidList}>
        {bids.map((bid) => {
          const statusInfo = STATUS_MAP[bid.status] ?? { label: bid.status, cls: 'new' };
          return (
            <div key={bid.id} className={s.bidCard}>
              {/* Top row */}
              <div className={s.bidCardTop}>
                <div className={s.agencyAvatar} style={{ background: AGENCY_COLORS[bid.agencyShort] ?? '#374151' }}>
                  {bid.agencyShort.slice(0, 2)}
                </div>
                <div className={s.bidMeta}>
                  <div className={s.bidSolNum}>{bid.solicitationNumber}</div>
                  <div className={s.bidAgency}>{bid.agency}</div>
                </div>
                <span className={`${s.statusBadge} ${s[statusInfo.cls]}`}>{statusInfo.label}</span>
              </div>

              {/* Title */}
              <h2 className={s.bidTitle}>{bid.title}</h2>

              {/* Tags row */}
              <div className={s.tags}>
                <span className={s.tag}>{bid.type}</span>
                <span className={s.tag}>NAICS {bid.naics}</span>
                <span className={s.tag}>{bid.naicsDescription}</span>
                <span className={s.tagBlue}>{bid.setAside}</span>
              </div>

              {/* Detail row */}
              <div className={s.details}>
                <div className={s.detail}>
                  <span className={s.detailLabel}>Contract Value</span>
                  <span className={s.detailValue}>{bid.value}</span>
                </div>
                <div className={s.detail}>
                  <span className={s.detailLabel}>Due Date</span>
                  <span className={s.detailValue}>{bid.dueDateDisplay}</span>
                </div>
                <div className={s.detail}>
                  <span className={s.detailLabel}>Place of Performance</span>
                  <span className={s.detailValue}>{bid.placeOfPerformance}</span>
                </div>
                <div className={s.detail}>
                  <span className={s.detailLabel}>Period</span>
                  <span className={s.detailValue}>{bid.periodOfPerformance}</span>
                </div>
              </div>

              {/* Synopsis preview */}
              <p className={s.synopsis}>{bid.synopsis.slice(0, 220)}…</p>

              {/* Actions */}
              <div className={s.actions}>
                <Link href={`/bids/${bid.id}`} className={s.viewBtn} id={`bid-view-${bid.id}`}>
                  View Details
                </Link>
                <Link href={`/bids/${bid.id}/analyze`} className={s.analyzeBtn} id={`bid-analyze-${bid.id}`}>
                  <i className="fas fa-bolt" /> Analyze Bid
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
