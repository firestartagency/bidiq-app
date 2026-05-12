'use client';

import { useState } from 'react';
import profile from '@/data/contractor-profile.json';
import s from './page.module.css';

const company  = profile.company  as any;
const pastPerf = profile.pastPerformance as any[];
const keyPers  = profile.keyPersonnel    as any[];

const CERT_STATUS: Record<string, { cls: string; icon: string }> = {
  'Active':               { cls: 'certActive',  icon: 'fas fa-check-circle' },
  'In Progress (POA&M active)': { cls: 'certPartial', icon: 'fas fa-clock'        },
};

const BIZ_COLORS: Record<string, string> = {
  '8(a) Participant (Active through 2028)': '#7C3AED',
  'Service-Disabled Veteran-Owned Small Business (SDVOSB)': '#059669',
  'HUBZone Certified': '#D97706',
  'Small Business': '#2563EB',
  'Limited Liability Company (LLC)': '#374151',
};

const CPARS_COLOR: Record<string, string> = {
  'Exceptional': '#059669',
  'Very Good':   '#2563EB',
  'Satisfactory':'#D97706',
};

export default function ProfilePage() {
  const [capExpanded, setCapExpanded] = useState(false);
  const capLines = company.capabilityStatement.split('\n').filter(Boolean);
  const capPreview = capLines.slice(0, 2).join('\n');

  return (
    <div className={s.page}>

      {/* ---- Company Banner ---- */}
      <div className={s.banner}>
        <div className={s.bannerLeft}>
          <div className={s.companyAvatar}>
            <span>AF</span>
          </div>
          <div>
            <h1 className={s.companyName}>{company.name}</h1>
            <div className={s.companyMeta}>
              <span><i className="fas fa-map-marker-alt" /> {company.headquarters}</span>
              <span className={s.metaDot}>·</span>
              <span><i className="fas fa-globe" /> {company.website}</span>
              <span className={s.metaDot}>·</span>
              <span><i className="fas fa-calendar-alt" /> Est. {company.founded}</span>
              <span className={s.metaDot}>·</span>
              <span><i className="fas fa-users" /> {company.employees} employees</span>
            </div>
          </div>
        </div>
        <div className={s.samTag}>
          <i className="fas fa-shield-alt" /> {company.samRegistration}
        </div>
      </div>

      {/* ---- Business Type Badges ---- */}
      <div className={s.bizBadges}>
        {company.businessTypes.map((bt: string, i: number) => (
          <span key={i} className={s.bizBadge} style={{ background: (BIZ_COLORS[bt] ?? '#374151') + '15', color: BIZ_COLORS[bt] ?? '#374151', borderColor: (BIZ_COLORS[bt] ?? '#374151') + '40' }}>
            <i className="fas fa-check" /> {bt}
          </span>
        ))}
      </div>

      {/* ---- Main 2-col grid ---- */}
      <div className={s.mainGrid}>

        {/* Left column */}
        <div className={s.leftCol}>

          {/* Registry IDs */}
          <div className={s.card}>
            <div className={s.cardTitle}><i className="fas fa-id-card" /> Registry IDs</div>
            <div className={s.idGrid}>
              {[
                { label: 'UEI',         val: company.uei },
                { label: 'CAGE Code',   val: company.cageCode },
                { label: 'EIN',         val: company.ein },
                { label: 'Clearance',   val: company.facilitySecurityClearance },
              ].map((row, i) => (
                <div key={i} className={s.idRow}>
                  <span className={s.idLabel}>{row.label}</span>
                  <span className={s.idVal}>{row.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className={s.card}>
            <div className={s.cardTitle}><i className="fas fa-certificate" /> Certifications</div>
            <div className={s.certList}>
              {company.certifications.map((cert: any, i: number) => {
                const st = CERT_STATUS[cert.status] ?? { cls: 'certPartial', icon: 'fas fa-circle' };
                return (
                  <div key={i} className={s.certRow}>
                    <div className={s.certLeft}>
                      <i className={`${st.icon} ${s[st.cls]}`} />
                      <div>
                        <div className={s.certName}>{cert.name}</div>
                        <div className={s.certIssuer}>{cert.issuedBy}</div>
                      </div>
                    </div>
                    <div className={s.certRight}>
                      <span className={`${s.certStatusBadge} ${s[st.cls]}`}>{cert.status}</span>
                      {cert.expires && <span className={s.certExpiry}>Exp: {cert.expires}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* NAICS Codes */}
          <div className={s.card}>
            <div className={s.cardTitle}><i className="fas fa-tag" /> NAICS Codes</div>
            <div className={s.naicsList}>
              {company.naicsCodes.map((n: any, i: number) => (
                <div key={i} className={`${s.naicsRow} ${n.primary ? s.naicsPrimary : ''}`}>
                  <div>
                    <span className={s.naicsCode}>{n.code}</span>
                    {n.primary && <span className={s.primaryTag}>Primary</span>}
                  </div>
                  <span className={s.naicsDesc}>{n.description}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right column — Capability Statement */}
        <div className={s.rightCol}>
          <div className={s.card} style={{ flex: 1 }}>
            <div className={s.cardTitle}><i className="fas fa-file-alt" /> Capability Statement</div>
            <div className={s.capBody}>
              {(capExpanded ? capLines : capPreview.split('\n')).map((para: string, i: number) => (
                <p key={i} className={s.capPara}>{para}</p>
              ))}
            </div>
            <button className={s.expandBtn} onClick={() => setCapExpanded(!capExpanded)}>
              {capExpanded
                ? <><i className="fas fa-chevron-up" /> Show Less</>
                : <><i className="fas fa-chevron-down" /> Read Full Capability Statement</>
              }
            </button>
          </div>
        </div>

      </div>

      {/* ---- Key Personnel ---- */}
      <div className={s.sectionHeader}>
        <h2 className={s.sectionTitle}><i className="fas fa-user-tie" /> Key Personnel</h2>
        <span className={s.sectionSub}>{keyPers.length} proposed key personnel</span>
      </div>
      <div className={s.personnelGrid}>
        {keyPers.map((kp: any, i: number) => (
          <div key={i} className={s.personnelCard}>
            <div className={s.personnelHead}>
              <div className={s.personnelAvatar}>
                {kp.name.split(' ').slice(0, 2).map((w: string) => w[0]).join('')}
              </div>
              <div>
                <div className={s.personnelName}>{kp.name}</div>
                <div className={s.personnelTitle}>{kp.title}</div>
              </div>
              <span className={s.clearanceBadge}><i className="fas fa-lock" /> {kp.clearance}</span>
            </div>
            <div className={s.personnelBody}>
              <p className={s.personnelSummary}>{kp.experienceSummary}</p>
              <div className={s.personnelFooter}>
                <div className={s.certTags}>
                  {kp.certifications.map((c: string, ci: number) => (
                    <span key={ci} className={s.certTag}>{c}</span>
                  ))}
                </div>
                <span className={s.expBadge}><i className="fas fa-briefcase" /> {kp.yearsExperience} yrs exp</span>
              </div>
              <div className={s.eduLine}><i className="fas fa-graduation-cap" /> {kp.education}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ---- Past Performance ---- */}
      <div className={s.sectionHeader}>
        <h2 className={s.sectionTitle}><i className="fas fa-trophy" /> Past Performance</h2>
        <span className={s.sectionSub}>{pastPerf.length} contract references</span>
      </div>
      <div className={s.ppList}>
        {pastPerf.map((pp: any, i: number) => {
          const cparsColor = CPARS_COLOR[pp.cparsRating] ?? '#374151';
          return (
            <div key={i} className={s.ppCard}>
              <div className={s.ppHead}>
                <div className={s.ppLeft}>
                  <h3 className={s.ppTitle}>{pp.contractTitle}</h3>
                  <div className={s.ppAgency}>{pp.agency}</div>
                </div>
                <div className={s.ppRight}>
                  <span className={s.cparsTag} style={{ color: cparsColor, background: cparsColor + '12', borderColor: cparsColor + '35' }}>
                    <i className="fas fa-star" /> CPARS: {pp.cparsRating}
                  </span>
                </div>
              </div>
              <div className={s.ppMeta}>
                <span><i className="fas fa-hashtag" /> {pp.contractNumber}</span>
                <span><i className="fas fa-dollar-sign" /> {pp.value}</span>
                <span><i className="fas fa-calendar" /> {pp.periodOfPerformance}</span>
                <span><i className="fas fa-tag" /> {pp.setAside}</span>
              </div>
              <div className={s.ppGrid}>
                <div className={s.ppSection}>
                  <div className={s.ppSectionTitle}>Scope</div>
                  <p className={s.ppText}>{pp.scopeSummary}</p>
                </div>
                <div className={s.ppSection}>
                  <div className={s.ppSectionTitle}>Key Outcomes</div>
                  <p className={s.ppText}>{pp.keyOutcome}</p>
                </div>
              </div>
              <div className={s.ppFooter}>
                <span className={s.ppCO}>
                  <i className="fas fa-user" /> CO: {pp.contractingOfficer} — <a href={`mailto:${pp.coEmail}`} className={s.coEmail}>{pp.coEmail}</a>
                </span>
                <span className={s.ppLocation}><i className="fas fa-map-marker-alt" /> {pp.agencyLocation}</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
