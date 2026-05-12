'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import s from './page.module.css';

export default function SubmittedPage({ params }: { params: { id: string } }) {
  const timestamp = new Date().toLocaleString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  const proposalId = `BIQ-${params.id.toUpperCase()}-${Date.now().toString().slice(-6)}`;

  /* ---- confetti burst on mount ---- */
  useEffect(() => {
    let frame: ReturnType<typeof setTimeout>;
    async function burst() {
      const confetti = (await import('canvas-confetti')).default;
      const end = Date.now() + 2200;
      const colors = ['#1E3A8A', '#B8860B', '#93C5FD', '#FCD34D', '#FFFFFF'];
      (function loop() {
        confetti({
          particleCount: 6,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        });
        confetti({
          particleCount: 6,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        });
        if (Date.now() < end) frame = setTimeout(loop, 40);
      })();
    }
    burst();
    return () => clearTimeout(frame);
  }, []);

  return (
    <div className={s.page}>
      {/* Success card */}
      <div className={s.successCard}>
        <div className={s.checkWrap}>
          <div className={s.checkCircle}>
            <i className="fas fa-check" />
          </div>
          <div className={s.ripple} />
          <div className={s.ripple2} />
        </div>

        <h1 className={s.headline}>Proposal Submitted!</h1>
        <p className={s.sub}>Your proposal has been approved and successfully submitted for review.</p>

        <div className={s.summaryGrid}>
          <div className={s.summaryItem}>
            <span className={s.summaryLabel}>Solicitation</span>
            <span className={s.summaryValue}>{params.id.toUpperCase()}</span>
          </div>
          <div className={s.summaryItem}>
            <span className={s.summaryLabel}>Proposal ID</span>
            <span className={s.summaryValue}>{proposalId}</span>
          </div>
          <div className={s.summaryItem}>
            <span className={s.summaryLabel}>Submitted At</span>
            <span className={s.summaryValue}>{timestamp}</span>
          </div>
          <div className={s.summaryItem}>
            <span className={s.summaryLabel}>Status</span>
            <span className={s.statusBadge}><i className="fas fa-paper-plane" /> Submitted</span>
          </div>
        </div>
      </div>

      {/* What Happens Next */}
      <div className={s.nextCard}>
        <h2 className={s.nextTitle}>What Happens Next</h2>
        <div className={s.steps}>
          {[
            {
              icon: 'fas fa-envelope-open-text',
              title: 'Confirmation Email',
              desc: 'A submission confirmation with your Proposal ID will be sent to your registered email within 15 minutes.',
            },
            {
              icon: 'fas fa-user-check',
              title: 'Contracting Officer Review',
              desc: 'The Contracting Officer will review submissions and issue evaluation notices within the timeframe specified in Section M.',
            },
            {
              icon: 'fas fa-comments',
              title: 'Clarification Requests',
              desc: 'The Government may issue Evaluation Notices (ENs) requesting clarifications. Monitor your inbox and BidIQ for updates.',
            },
            {
              icon: 'fas fa-trophy',
              title: 'Award Decision',
              desc: 'Award decisions are typically issued 30–90 days after submission close. You will be notified via SAM.gov and BidIQ.',
            },
          ].map((step, i) => (
            <div key={i} className={s.step} style={{ animationDelay: `${i * 80}ms` }}>
              <div className={s.stepIcon}>
                <i className={step.icon} />
              </div>
              <div>
                <div className={s.stepTitle}>{step.title}</div>
                <div className={s.stepDesc}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={s.ctaRow}>
        <Link href="/" className={s.primaryBtn}>
          <i className="fas fa-th-large" /> Return to Dashboard
        </Link>
        <Link href="/bids" className={s.secondaryBtn}>
          View All Bids
        </Link>
      </div>
    </div>
  );
}
