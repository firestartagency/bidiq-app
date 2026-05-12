/**
 * ProposalDocument.tsx — Master PDF Component
 *
 * Renders a professionally styled federal proposal PDF using @react-pdf/renderer.
 * Designed to pass as a real government proposal document.
 *
 * SERVER-SIDE ONLY — rendered via renderToBuffer() in API routes.
 */

import React from 'react';
import {
  Document, Page, Text, View, StyleSheet, Font,
  pdf as renderPdf,
} from '@react-pdf/renderer';
import path from 'path';

/* ---- Font Registration ---- */
const FONT_DIR = path.resolve(process.cwd(), 'src/assets/fonts');

Font.register({
  family: 'Inter',
  fonts: [
    { src: `${FONT_DIR}/Inter-Regular.ttf`, fontWeight: 'normal' },
    { src: `${FONT_DIR}/Inter-Bold.ttf`,    fontWeight: 'bold'   },
  ],
});

/* ---- Design Tokens ---- */
const NAVY  = '#1E3A8A';
const GOLD  = '#B8860B';
const LIGHT = '#F8FAFC';
const TEXT  = '#1F2937';
const MUTED = '#6B7280';
const WHITE = '#FFFFFF';

/* ---- Styles ---- */
const s = StyleSheet.create({
  page: {
    fontFamily: 'Inter',
    fontSize: 10,
    color: TEXT,
    backgroundColor: WHITE,
    paddingTop: 72,
    paddingBottom: 60,
    paddingHorizontal: 60,
  },

  /* Cover */
  coverPage: {
    fontFamily: 'Inter',
    backgroundColor: NAVY,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
  coverTop: {
    backgroundColor: NAVY,
    flex: 1,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 60,
    paddingTop: 80,
  },
  coverBottom: {
    backgroundColor: GOLD,
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 60,
  },
  coverLogo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: WHITE,
    letterSpacing: 1,
    marginBottom: 48,
  },
  coverLogoAccent: {
    color: '#93C5FD',
  },
  coverLabel: {
    fontSize: 10,
    color: '#93C5FD',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 12,
  },
  coverTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: WHITE,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 1.4,
  },
  coverDivider: {
    width: 60,
    height: 2,
    backgroundColor: GOLD,
    marginVertical: 24,
  },
  coverMeta: {
    display: 'flex',
    flexDirection: 'row',
    gap: 48,
    marginTop: 8,
  },
  coverMetaItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  },
  coverMetaLabel: { fontSize: 9, color: '#93C5FD', textTransform: 'uppercase', letterSpacing: 1 },
  coverMetaValue: { fontSize: 12, fontWeight: 'bold', color: WHITE },
  coverBottomText: { fontSize: 9, color: WHITE },
  coverBottomBold: { fontSize: 10, fontWeight: 'bold', color: WHITE },

  /* Header bar on body pages */
  pageHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 10,
    backgroundColor: NAVY,
  },
  pageHeaderGold: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: GOLD,
  },

  /* Footer */
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 60,
    right: 60,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: '#E5E7EB',
    paddingTop: 8,
  },
  footerText: { fontSize: 8, color: MUTED },
  footerCenter: { fontSize: 8, color: MUTED, fontWeight: 'bold' },

  /* TOC */
  tocTitle: { fontSize: 18, fontWeight: 'bold', color: NAVY, marginBottom: 24 },
  tocRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E7EB',
  },
  tocSection: { fontSize: 11, color: TEXT },
  tocPage: { fontSize: 11, color: MUTED },

  /* Section header */
  sectionMarker: {
    width: 4,
    height: 24,
    backgroundColor: GOLD,
    marginRight: 10,
  },
  sectionHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: NAVY,
  },
  sectionSubtitle: {
    fontSize: 9,
    color: MUTED,
    marginBottom: 20,
    marginLeft: 14,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: NAVY,
    marginBottom: 20,
    opacity: 0.2,
  },

  /* Body text */
  paragraph: {
    fontSize: 10,
    lineHeight: 1.8,
    color: TEXT,
    marginBottom: 12,
  },

  /* Past performance cards */
  ppCard: {
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
    borderRadius: 4,
    padding: 14,
    marginBottom: 12,
    backgroundColor: LIGHT,
  },
  ppCardTitle: { fontSize: 11, fontWeight: 'bold', color: NAVY, marginBottom: 6 },
  ppCardRow: { display: 'flex', flexDirection: 'row', gap: 8, marginBottom: 4 },
  ppCardLabel: { fontSize: 9, color: MUTED, width: 80, flexShrink: 0 },
  ppCardValue: { fontSize: 9, color: TEXT, flex: 1 },
  ppCpars: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  cparsTag: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#059669',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
  },
});

/* ---- Components ---- */

function PageFooter({ company, pageNum }: { company: string; pageNum: number }) {
  return (
    <View style={s.footer} fixed>
      <Text style={s.footerText}>{company}</Text>
      <Text style={s.footerCenter}>PROPRIETARY AND CONFIDENTIAL</Text>
      <Text style={s.footerText}>Page {pageNum}</Text>
    </View>
  );
}

function SectionPage({
  sectionNum,
  title,
  subtitle,
  content,
  company,
  pageNum,
}: {
  sectionNum: string;
  title: string;
  subtitle: string;
  content: string;
  company: string;
  pageNum: number;
}) {
  const paragraphs = content
    .split('\n')
    .map(p => p.trim())
    .filter(p => p.length > 0);

  return (
    <Page size="LETTER" style={s.page}>
      <View style={s.pageHeader} fixed />
      <View style={s.pageHeaderGold} fixed />

      <View style={s.sectionHeader}>
        <View style={s.sectionMarker} />
        <Text style={s.sectionTitle}>
          {sectionNum}. {title}
        </Text>
      </View>
      <Text style={s.sectionSubtitle}>{subtitle}</Text>
      <View style={s.sectionDivider} />

      {paragraphs.map((para, i) => (
        <Text key={i} style={s.paragraph}>{para}</Text>
      ))}

      <PageFooter company={company} pageNum={pageNum} />
    </Page>
  );
}

/* ---- Main Document ---- */

export interface ProposalDocumentProps {
  solicitation: {
    solicitationNumber: string;
    title: string;
    agency: string;
    type: string;
    value: string;
    dueDateDisplay: string;
  };
  proposal: {
    executiveSummary: string;
    technicalApproach: string;
    managementPlan: string;
    pastPerformance: string;
  };
  contractor: {
    name: string;
    uei: string;
    cageCode: string;
    businessTypes: string[];
  };
  pastPerformanceEntries: Array<{
    contractTitle: string;
    agency: string;
    value: string;
    periodOfPerformance: string;
    scopeSummary: string;
    keyOutcome: string;
    cparsRating: string;
  }>;
  proposalId: string;
  submittedDate: string;
}

export function ProposalDocument({
  solicitation,
  proposal,
  contractor,
  pastPerformanceEntries,
  proposalId,
  submittedDate,
}: ProposalDocumentProps) {
  const TOC_ITEMS = [
    { section: '1. Executive Summary',   page: 3 },
    { section: '2. Technical Approach',  page: 4 },
    { section: '3. Management Plan',     page: 5 },
    { section: '4. Past Performance',    page: 6 },
    { section: 'Appendix A — Past Performance Reference Cards', page: 7 },
  ];

  return (
    <Document
      title={`Proposal — ${solicitation.solicitationNumber}`}
      author={contractor.name}
      subject={solicitation.title}
    >
      {/* ---- COVER PAGE ---- */}
      <Page size="LETTER" style={s.coverPage}>
        <View style={s.coverTop}>
          <Text style={s.coverLogo}>
            Bid<Text style={s.coverLogoAccent}>IQ</Text>
          </Text>

          <Text style={s.coverLabel}>Technical and Management Proposal</Text>
          <Text style={s.coverTitle}>{solicitation.title}</Text>

          <View style={s.coverDivider} />

          <View style={s.coverMeta}>
            <View style={s.coverMetaItem}>
              <Text style={s.coverMetaLabel}>Submitted To</Text>
              <Text style={s.coverMetaValue}>{solicitation.agency}</Text>
            </View>
            <View style={s.coverMetaItem}>
              <Text style={s.coverMetaLabel}>Solicitation #</Text>
              <Text style={s.coverMetaValue}>{solicitation.solicitationNumber}</Text>
            </View>
            <View style={s.coverMetaItem}>
              <Text style={s.coverMetaLabel}>Contract Value</Text>
              <Text style={s.coverMetaValue}>{solicitation.value}</Text>
            </View>
          </View>
        </View>

        <View style={s.coverBottom}>
          <Text style={s.coverBottomBold}>{contractor.name}</Text>
          <Text style={s.coverBottomText}>
            UEI: {contractor.uei} | CAGE: {contractor.cageCode} | {contractor.businessTypes.slice(0, 2).join(' | ')}
          </Text>
          <Text style={s.coverBottomText}>
            Proposal ID: {proposalId} | Submitted: {submittedDate}
          </Text>
        </View>
      </Page>

      {/* ---- TABLE OF CONTENTS ---- */}
      <Page size="LETTER" style={s.page}>
        <View style={s.pageHeader} fixed />
        <View style={s.pageHeaderGold} fixed />

        <Text style={s.tocTitle}>Table of Contents</Text>
        {TOC_ITEMS.map((item, i) => (
          <View key={i} style={s.tocRow}>
            <Text style={s.tocSection}>{item.section}</Text>
            <Text style={s.tocPage}>{item.page}</Text>
          </View>
        ))}

        <PageFooter company={contractor.name} pageNum={2} />
      </Page>

      {/* ---- SECTION 1: EXECUTIVE SUMMARY ---- */}
      <SectionPage
        sectionNum="1"
        title="Executive Summary"
        subtitle="Offeror's high-level value proposition and qualification summary"
        content={proposal.executiveSummary}
        company={contractor.name}
        pageNum={3}
      />

      {/* ---- SECTION 2: TECHNICAL APPROACH ---- */}
      <SectionPage
        sectionNum="2"
        title="Technical Approach"
        subtitle="Detailed methodology, workstreams, and solution architecture"
        content={proposal.technicalApproach}
        company={contractor.name}
        pageNum={4}
      />

      {/* ---- SECTION 3: MANAGEMENT PLAN ---- */}
      <SectionPage
        sectionNum="3"
        title="Management Plan"
        subtitle="Program management structure, key personnel, and quality control"
        content={proposal.managementPlan}
        company={contractor.name}
        pageNum={5}
      />

      {/* ---- SECTION 4: PAST PERFORMANCE ---- */}
      <SectionPage
        sectionNum="4"
        title="Past Performance"
        subtitle="Relevant prior federal contracts demonstrating capability and track record"
        content={proposal.pastPerformance}
        company={contractor.name}
        pageNum={6}
      />

      {/* ---- APPENDIX A: PAST PERFORMANCE REFERENCE CARDS ---- */}
      <Page size="LETTER" style={s.page}>
        <View style={s.pageHeader} fixed />
        <View style={s.pageHeaderGold} fixed />

        <View style={s.sectionHeader}>
          <View style={s.sectionMarker} />
          <Text style={s.sectionTitle}>Appendix A — Past Performance Reference Cards</Text>
        </View>
        <Text style={s.sectionSubtitle}>Contract references available for CPARS verification</Text>
        <View style={s.sectionDivider} />

        {pastPerformanceEntries.map((pp, i) => (
          <View key={i} style={s.ppCard}>
            <Text style={s.ppCardTitle}>{pp.contractTitle}</Text>
            <View style={s.ppCardRow}>
              <Text style={s.ppCardLabel}>Agency</Text>
              <Text style={s.ppCardValue}>{pp.agency}</Text>
            </View>
            <View style={s.ppCardRow}>
              <Text style={s.ppCardLabel}>Contract Value</Text>
              <Text style={s.ppCardValue}>{pp.value}</Text>
            </View>
            <View style={s.ppCardRow}>
              <Text style={s.ppCardLabel}>Period</Text>
              <Text style={s.ppCardValue}>{pp.periodOfPerformance}</Text>
            </View>
            <View style={s.ppCardRow}>
              <Text style={s.ppCardLabel}>Scope</Text>
              <Text style={s.ppCardValue}>{pp.scopeSummary}</Text>
            </View>
            <View style={s.ppCardRow}>
              <Text style={s.ppCardLabel}>Key Outcome</Text>
              <Text style={s.ppCardValue}>{pp.keyOutcome}</Text>
            </View>
            <View style={s.ppCpars}>
              <Text style={s.ppCardLabel}>CPARS Rating</Text>
              <Text style={s.cparsTag}>{pp.cparsRating}</Text>
            </View>
          </View>
        ))}

        <PageFooter company={contractor.name} pageNum={7} />
      </Page>
    </Document>
  );
}

/* ---- Render Helper ---- */
export async function renderProposalPDF(props: ProposalDocumentProps): Promise<Buffer> {
  const instance = renderPdf(<ProposalDocument {...props} />);
  const blob = await instance.toBlob();
  const arrayBuffer = await blob.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
