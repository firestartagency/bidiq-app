import Link from 'next/link';
import s from './page.module.css';

/* ---------- data ---------- */
const stats = [
  {
    label: 'Active Bids',
    value: '12',
    change: '+2',
    changeType: 'up',
    changePeriod: 'This month',
  },
  {
    label: 'Proposals Generated',
    value: '8',
    change: '+3',
    changeType: 'up',
    changePeriod: 'This month',
  },
  {
    label: 'Total Contract Value',
    value: '$47.2M',
    change: '+12.4%',
    changeType: 'up',
    changePeriod: 'This month',
  },
  {
    label: 'Pending Approvals',
    value: '3',
    change: '-1',
    changeType: 'down',
    changePeriod: 'This month',
  },
];

const deadlines = [
  { title: 'IT Modernization',   agency: 'DISA',  status: 'urgent' },
  { title: 'Admin Support',      agency: 'GSA',   status: 'urgent' },
  { title: 'Facility Ops & M',   agency: 'USACE', status: 'pending' },
  { title: 'Cyber Services',     agency: 'DoD',   status: 'pending' },
  { title: 'Data Analytics',     agency: 'HHS',   status: 'done' },
];

const chartBars = [
  { label: 'January',  mainH: 95, secH: 70 },
  { label: 'February', mainH: 50, secH: 35 },
  { label: 'March',    mainH: 80, secH: 60 },
  { label: 'April',    mainH: 30, secH: 20 },
  { label: 'May',      mainH: 60, secH: 45 },
  { label: 'June',     mainH: 70, secH: 55 },
];

const solicitations = [
  {
    id: 'bid-001',
    solNum: 'DISA-HC-2026-R-0042',
    agency: 'DISA',
    title: 'IT Infrastructure Modernization & Managed Security Services',
    naics: '541512',
    value: '$4.2M',
    due: 'Jun 15, 2026',
    status: 'In Review',
    statusType: 'interview',
  },
  {
    id: 'bid-002',
    solNum: '47QRAA26Q0118',
    agency: 'GSA',
    title: 'Administrative and Program Management Support',
    naics: '541611',
    value: '$1.1M',
    due: 'Jul 02, 2026',
    status: 'Proposal Ready',
    statusType: 'hired',
  },
  {
    id: 'bid-003',
    solNum: 'W912DY-26-SS-007',
    agency: 'USACE',
    title: 'Facility Operations & Maintenance',
    naics: '236220',
    value: 'TBD',
    due: 'Jun 28, 2026',
    status: 'New',
    statusType: 'new',
  },
];

/* ---------- helpers ---------- */
function ChangePill({ change, type }: { change: string; type: string }) {
  if (type === 'up')
    return (
      <span className={`${s.pill} ${s.pillUp}`}>
        <i className="fas fa-arrow-up" style={{ fontSize: 10 }} /> {change}
      </span>
    );
  if (type === 'down')
    return (
      <span className={`${s.pill} ${s.pillDown}`}>
        <i className="fas fa-arrow-down" style={{ fontSize: 10 }} /> {change}
      </span>
    );
  return <span className={`${s.pill} ${s.pillNeutral}`}>{change}</span>;
}

function StatusBadge({ status, type }: { status: string; type: string }) {
  const cls =
    type === 'hired'
      ? s.statusHired
      : type === 'new'
      ? s.statusNew
      : s.statusInterview;
  return <span className={`${s.statusBadge} ${cls}`}>{status}</span>;
}

/* Agency initials avatar */
function AgencyAvatar({ agency }: { agency: string }) {
  const colors: Record<string, string> = {
    DISA:  '#1E3A8A',
    GSA:   '#065F46',
    USACE: '#78350F',
    DoD:   '#581C87',
    HHS:   '#9F1239',
  };
  return (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        background: colors[agency] ?? '#374151',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: 11,
        fontWeight: 700,
        flexShrink: 0,
      }}
    >
      {agency.slice(0, 2)}
    </div>
  );
}

/* ---------- page ---------- */
export default function DashboardPage() {
  return (
    <div className={s.dashboard}>

      {/* ---- Stats ---- */}
      <div className={s.statsGrid}>
        {stats.map((stat) => (
          <div key={stat.label} className={s.statCard}>
            <div className={s.statCardHeader}>
              <span className={s.statLabel}>
                {stat.label}{' '}
                <i className="fas fa-info-circle" style={{ fontSize: 11, color: '#D1D5DB' }} />
              </span>
              <button className={s.dotsBtn}><i className="fas fa-ellipsis-h" /></button>
            </div>
            <div className={s.statValue}>{stat.value}</div>
            <div className={s.statFooter}>
              <ChangePill change={stat.change} type={stat.changeType} />
              <span className={s.statPeriod}>{stat.changePeriod}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ---- Middle: Chart + Deadlines ---- */}
      <div className={s.middleGrid}>

        {/* Chart card */}
        <div className={s.chartCard}>
          <div className={s.chartHeader}>
            <div>
              <h2 className={s.cardTitle}>
                Bid Pipeline Activity{' '}
                <i className="fas fa-info-circle" style={{ fontSize: 12, color: '#D1D5DB', fontWeight: 400 }} />
              </h2>
              <p className={s.cardSub}>Monthly bids analyzed and proposals generated</p>
            </div>
            <div className={s.selectWrap}>
              <select className={s.select}>
                <option>This Year</option>
                <option>Last Year</option>
              </select>
              <i className={`fas fa-chevron-down ${s.selectChevron}`} />
            </div>
          </div>

          <div className={s.chartBody}>
            <div className={s.chartArea}>
              <div className={s.yAxis}>
                {['12','9','6','3','0'].map(v => <span key={v}>{v}</span>)}
              </div>
              <div className={s.barsWrap}>
                <div className={s.gridLines}>
                  {[0,1,2,3].map(i => <div key={i} className={s.gridLine} />)}
                </div>
                <div className={s.bars}>
                  {chartBars.map((bar) => (
                    <div key={bar.label} className={s.barGroup} style={{ height: `${bar.mainH}%` }}>
                      <div className={s.barMain} style={{ height: '100%' }} />
                      <div className={s.barSec} style={{ height: `${bar.secH}%` }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className={s.xAxis}>
              {chartBars.map(b => <span key={b.label}>{b.label}</span>)}
            </div>

            <div className={s.legend}>
              <div className={s.legendItem}>
                <span className={`${s.legendDot} ${s.dotDark}`} />
                <div>
                  <div className={s.legendValue}>47</div>
                  <div className={s.legendLabel}>Bids Analyzed</div>
                </div>
              </div>
              <div className={s.legendItem}>
                <span className={`${s.legendDot} ${s.dotLight}`} />
                <div>
                  <div className={s.legendValue}>31</div>
                  <div className={s.legendLabel}>Proposals Sent</div>
                </div>
              </div>
              <button className={s.reportBtn}>Full Report</button>
            </div>
          </div>
        </div>

        {/* Upcoming Deadlines card */}
        <div className={s.positionsCard}>
          <h2 className={s.cardTitle} style={{ marginBottom: 24 }}>
            Upcoming Deadlines{' '}
            <i className="fas fa-info-circle" style={{ fontSize: 12, color: '#D1D5DB', fontWeight: 400 }} />
          </h2>
          <div className={s.posTable}>
            <div className={s.posHeader}>
              <span>Solicitation</span>
              <span>Agency</span>
              <span style={{ textAlign: 'right' }}>Status</span>
            </div>
            {deadlines.map((item, i) => (
              <div key={i} className={s.posRow}>
                <span className={s.posTitle}>{item.title}</span>
                <span className={s.posDept}>{item.agency}</span>
                <span style={{ textAlign: 'right' }}>
                  {item.status === 'done'
                    ? <i className="far fa-check-circle" style={{ color: '#10B981', fontSize: 18 }} />
                    : item.status === 'urgent'
                    ? <i className="fas fa-exclamation-circle" style={{ color: '#EF4444', fontSize: 18 }} />
                    : <i className="far fa-clock" style={{ color: '#3B82F6', fontSize: 18 }} />
                  }
                </span>
              </div>
            ))}
          </div>
          <div className={s.viewAll}>
            <a href="/bids">View All <i className="fas fa-arrow-right" /></a>
          </div>
        </div>

      </div>

      {/* ---- Active Solicitations Table ---- */}
      <div className={s.tableCard}>
        <div className={s.tableHeader}>
          <div className={s.tableHeaderLeft}>
            <h2 className={s.cardTitle}>
              Active Solicitations{' '}
              <i className="fas fa-info-circle" style={{ fontSize: 12, color: '#D1D5DB', fontWeight: 400 }} />
            </h2>
            <span className={s.employeeCount}>4 Active</span>
          </div>
          <div className={s.tableHeaderRight}>
            <button className={s.exportBtn}>
              <i className="fas fa-download" /> Export
            </button>
            <button className={s.addBtn}>
              <i className="fas fa-plus" /> Import Bid
            </button>
          </div>
        </div>

        <div className={s.tableScroll}>
          <table className={s.table}>
            <thead>
              <tr>
                {['Solicitation #', 'Agency', 'Title', 'NAICS', 'Value', 'Due Date', 'Status', ''].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {solicitations.map((item, i) => (
                <tr key={i}>
                  <td>
                    <div className={s.nameCell}>
                      <AgencyAvatar agency={item.agency} />
                      <span>{item.solNum}</span>
                    </div>
                  </td>
                  <td>{item.agency}</td>
                  <td style={{ maxWidth: 240 }}>{item.title}</td>
                  <td>{item.naics}</td>
                  <td style={{ fontWeight: 600 }}>{item.value}</td>
                  <td>{item.due}</td>
                  <td><StatusBadge status={item.status} type={item.statusType} /></td>
                  <td>
                    <Link href={`/bids/${item.id}`} className={s.analyzeLink}>
                      Analyze Bid →
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
