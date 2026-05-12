'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import s from './page.module.css';

/* ---- config ---- */
const STEP_DURATION_MS = 12000;

const STEPS = [
  { id: 1, label: 'Analyzing Requirements', icon: 'fas fa-search' },
  { id: 2, label: 'Drafting Proposal',       icon: 'fas fa-file-signature' },
  { id: 3, label: 'Reviewing Compliance',    icon: 'fas fa-shield-alt' },
];

const STEP1_LOGS = [
  'Parsing solicitation document...',
  'Identifying PWS requirements and deliverables...',
  'Extracting evaluation criteria from Section M...',
  'Cross-referencing NAICS codes against contractor profile...',
  'Evaluating 8(a) set-aside eligibility...',
  'Assessing clearance requirements for key personnel...',
  '✓ Requirements extraction complete.',
];

const STEP2_LOGS = [
  'Loading contractor capability statement...',
  'Injecting past performance context (3 references)...',
  'Drafting Executive Summary...',
  'Drafting Technical Approach — Workstreams 1–4...',
  'Drafting Management Plan and Quality Control approach...',
  'Mapping past performance to solicitation requirements...',
  '✓ Proposal draft complete.',
];

const STEP3_LOGS = [
  'Running Section L compliance check...',
  'Running Section M evaluation alignment check...',
  'Checking CMMC Level 2 posture...',
  '⚠ Flagging CMMC Level 2 gap — POA&M not yet complete.',
  'Verifying key personnel clearance levels...',
  '✓ Compliance review complete. 1 item requires human review.',
];

const REQUIREMENTS = [
  { section: 'PWS §1', requirement: '24/7 SOC monitoring with IDS/IPS',         priority: 'Critical', match: true },
  { section: 'PWS §2', requirement: 'Cloud migration to FedRAMP High',           priority: 'High',     match: true },
  { section: 'PWS §3', requirement: 'Monthly ACAS vulnerability scans',          priority: 'High',     match: true },
  { section: 'PWS §4', requirement: 'DoD STIG-compliant system configuration',   priority: 'Critical', match: true },
  { section: 'Sec L',  requirement: 'Top Secret/SCI cleared key personnel',      priority: 'Critical', match: true },
  { section: 'Sec L',  requirement: 'Active facility clearance (Secret minimum)', priority: 'Critical', match: true },
  { section: 'Sec M',  requirement: 'CMMC Level 2 certification',                priority: 'High',     match: false },
];

const COMPLIANCE_MATRIX = [
  { requirement: '8(a) Certification',       status: 'met',     note: 'Active through 2028' },
  { requirement: 'Secret Facility Clearance',status: 'met',     note: 'Active' },
  { requirement: 'CMMC Level 2',             status: 'partial', note: 'POA&M in progress — add timeline' },
  { requirement: 'NAICS 541512 Experience',  status: 'met',     note: 'Primary NAICS code' },
  { requirement: 'DoD STIG Compliance',      status: 'met',     note: 'Demonstrated in past performance' },
  { requirement: 'FedRAMP Cloud Experience', status: 'met',     note: 'VA GovCloud migration ($2.75M)' },
];

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default function AnalyzePage({ params }: { params: { id: string } }) {
  const [runKey, setRunKey]                     = useState(0);
  const [currentStep, setCurrentStep]           = useState(1);
  const [done, setDone]                         = useState(false);
  const [progress, setProgress]                 = useState(0);
  const [visibleLogs, setVisibleLogs]           = useState<string[]>([]);
  const [showReqTable, setShowReqTable]         = useState(false);
  const [showCompMatrix, setShowCompMatrix]     = useState(false);
  const logEndRef                               = useRef<HTMLDivElement>(null);
  const cancelledRef                            = useRef(false);

  /* ---- reset + re-run ---- */
  function rerun() {
    cancelledRef.current = true;          // cancel any in-flight sequence
    setTimeout(() => {
      cancelledRef.current = false;
      setCurrentStep(1);
      setDone(false);
      setProgress(0);
      setVisibleLogs([]);
      setShowReqTable(false);
      setShowCompMatrix(false);
      setRunKey(k => k + 1);             // increment → triggers useEffect
    }, 50);
  }

  /* ---- auto-scroll log ---- */
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [visibleLogs]);

  /* ---- single orchestrated sequence — runs once on mount ---- */
  useEffect(() => {
    cancelledRef.current = false;

    async function runSequence() {
      // Helper: stream log lines for one step
      async function streamLogs(lines: string[]) {
        const interval = Math.floor(STEP_DURATION_MS / (lines.length + 1));
        for (const line of lines) {
          if (cancelledRef.current) return;
          await sleep(interval);
          if (cancelledRef.current) return;
          setVisibleLogs(prev => [...prev, line]);
        }
        // Pad remaining time after last log
        const remaining = STEP_DURATION_MS - interval * lines.length;
        if (remaining > 0 && !cancelledRef.current) await sleep(remaining);
      }

      // Helper: animate progress bar for one step
      function startProgress() {
        setProgress(0);
        const start = Date.now();
        let raf: ReturnType<typeof requestAnimationFrame>;
        function tick() {
          if (cancelledRef.current) return;
          const pct = Math.min(((Date.now() - start) / STEP_DURATION_MS) * 100, 100);
          setProgress(pct);
          if (pct < 100) raf = requestAnimationFrame(tick);
        }
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
      }

      /* --- Step 1 --- */
      let stopProgress = startProgress();
      await streamLogs(STEP1_LOGS);
      stopProgress();
      if (cancelledRef.current) return;

      setShowReqTable(true);
      setCurrentStep(2);

      /* --- Step 2 --- */
      stopProgress = startProgress();
      await streamLogs(STEP2_LOGS);
      stopProgress();
      if (cancelledRef.current) return;

      setCurrentStep(3);

      /* --- Step 3 --- */
      stopProgress = startProgress();
      await streamLogs(STEP3_LOGS);
      stopProgress();
      if (cancelledRef.current) return;

      setShowCompMatrix(true);
      setDone(true);
    }

    runSequence();
    return () => { cancelledRef.current = true; };
  }, [runKey]); // re-runs whenever runKey increments

  return (
    <div className={s.page}>

      {/* Breadcrumb */}
      <div className={s.breadcrumb}>
        <Link href="/bids">← Active Bids</Link>
        <span>/</span>
        <Link href={`/bids/${params.id}`}>{params.id.toUpperCase()}</Link>
        <span>/</span>
        <span>Analysis</span>
      </div>

      {/* Progress stepper */}
      <div className={s.progressCard}>
        <div className={s.progressHeader}>
          <div>
            <h1 className={s.pageTitle}>AI Bid Analysis</h1>
            <p className={s.pageSub}>Gemini processes the solicitation and generates a structured proposal draft</p>
          </div>
          {done && <span className={s.allDoneBadge}><i className="fas fa-check-circle" /> Analysis Complete</span>}
          {done && (
            <button className={s.rerunBtn} onClick={rerun} title="Re-run analysis from scratch">
              <i className="fas fa-redo" /> Re-run Analysis
            </button>
          )}
        </div>

        <div className={s.steps}>
          {STEPS.map((step, i) => {
            const isCompleted = done ? true : step.id < currentStep;
            const isActive    = !done && step.id === currentStep;
            const isPending   = !done && step.id > currentStep;
            return (
              <div key={step.id} className={s.stepRow}>
                <div className={`${s.stepDot} ${isCompleted ? s.dotDone : ''} ${isActive ? s.dotActive : ''}`}>
                  {isCompleted
                    ? <i className="fas fa-check" />
                    : isActive
                    ? <span className={s.spinner} />
                    : <span>{step.id}</span>
                  }
                </div>
                <div className={s.stepInfo}>
                  <span className={`${s.stepLabel} ${isCompleted || isActive ? s.stepLabelActive : ''}`}>
                    {step.label}
                  </span>
                  {isActive && (
                    <div className={s.progressBarWrap}>
                      <div className={s.progressBar} style={{ width: `${progress}%` }} />
                    </div>
                  )}
                  {isCompleted && <span className={s.stepDoneText}>Complete</span>}
                  {isPending   && <span className={s.stepPendingText}>Pending</span>}
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`${s.connector} ${isCompleted ? s.connectorDone : ''}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Agent log */}
      <div className={s.streamCard}>
        <div className={s.streamHeader}>
          <h2 className={s.streamTitle}>
            <i className="fas fa-terminal" /> Agent Log
          </h2>
          {done
            ? <span className={s.doneTag}><i className="fas fa-check-circle" /> Complete</span>
            : <span className={s.thinkingTag}><span className={s.pulse} /> Thinking…</span>
          }
        </div>
        <div className={s.streamBody}>
          {visibleLogs.map((line, i) => (
            <div
              key={i}
              className={`${s.streamLine} ${line.startsWith('✓') ? s.streamSuccess : ''} ${line.startsWith('⚠') ? s.streamWarn : ''}`}
            >
              {line}
            </div>
          ))}
          <div ref={logEndRef} />
        </div>
      </div>

      {/* Requirements table — reveals after step 1 */}
      {showReqTable && (
        <div className={`${s.card} ${s.fadeIn}`}>
          <h2 className={s.cardTitle} style={{ marginBottom: 20 }}>Requirements Extraction</h2>
          <div className={s.tableScroll}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th>Section</th><th>Requirement</th><th>Priority</th><th>Capability Match</th>
                </tr>
              </thead>
              <tbody>
                {REQUIREMENTS.map((req, i) => (
                  <tr key={i}>
                    <td><span className={s.sectionTag}>{req.section}</span></td>
                    <td>{req.requirement}</td>
                    <td>
                      <span className={`${s.priorityBadge} ${req.priority === 'Critical' ? s.critical : s.high}`}>
                        {req.priority}
                      </span>
                    </td>
                    <td>
                      {req.match
                        ? <span className={s.matchYes}><i className="fas fa-check-circle" /> Yes</span>
                        : <span className={s.matchPartial}><i className="fas fa-exclamation-circle" /> Partial</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Compliance matrix — reveals after step 3 */}
      {showCompMatrix && (
        <div className={`${s.card} ${s.fadeIn}`}>
          <h2 className={s.cardTitle} style={{ marginBottom: 20 }}>Compliance Matrix</h2>
          <div className={s.tableScroll}>
            <table className={s.table}>
              <thead>
                <tr><th>Requirement</th><th>Status</th><th>Notes</th></tr>
              </thead>
              <tbody>
                {COMPLIANCE_MATRIX.map((row, i) => (
                  <tr key={i}>
                    <td>{row.requirement}</td>
                    <td>
                      {row.status === 'met'
                        ? <span className={s.matchYes}><i className="fas fa-check-circle" /> Met</span>
                        : <span className={s.matchPartial}><i className="fas fa-exclamation-circle" /> Partial</span>
                      }
                    </td>
                    <td style={{ color: '#6B7280', fontSize: 13 }}>{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className={s.ctaRow}>
        <Link href={`/bids/${params.id}`} className={s.secondaryBtn}>
          ← Back to Bid
        </Link>
        {done ? (
          <Link href={`/bids/${params.id}/proposal`} className={s.primaryBtn}>
            <i className="fas fa-file-alt" /> View Proposal Draft
          </Link>
        ) : (
          <button className={s.primaryBtnDisabled} disabled>
            <i className="fas fa-spinner fa-spin" /> Generating…
          </button>
        )}
      </div>

    </div>
  );
}
