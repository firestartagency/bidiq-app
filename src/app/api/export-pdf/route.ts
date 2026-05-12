/**
 * POST /api/export-pdf
 *
 * Accepts a proposal payload, renders it through ProposalDocument.tsx,
 * and returns a binary PDF response.
 * CLIENT RECEIVES ONLY the finished PDF binary — no API keys, no AI calls in browser.
 */

import { NextRequest, NextResponse } from 'next/server';
import contractorProfileRaw from '@/data/contractor-profile.json';
import { renderProposalPDF } from '@/lib/pdf/ProposalDocument';

const contractorProfile = contractorProfileRaw as any;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { solicitation, proposal, proposalId } = body;

    if (!proposal || !solicitation) {
      return NextResponse.json(
        { error: 'Missing proposal or solicitation in request body.' },
        { status: 400 },
      );
    }

    const submittedDate = new Date().toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric',
    });

    const pdfBuffer = await renderProposalPDF({
      solicitation,
      proposal,
      contractor: {
        name: contractorProfile.company.name,
        uei: contractorProfile.company.uei,
        cageCode: contractorProfile.company.cageCode,
        businessTypes: contractorProfile.company.businessTypes,
      },
      pastPerformanceEntries: contractorProfile.pastPerformance,
      proposalId: proposalId ?? `BIQ-${solicitation.solicitationNumber}-001`,
      submittedDate,
    });

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Proposal_${solicitation.solicitationNumber}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });

  } catch (err: any) {
    console.error('[/api/export-pdf] Error:', err);
    return NextResponse.json(
      { error: 'PDF generation failed.', detail: err?.message ?? 'Unknown error' },
      { status: 500 },
    );
  }
}
