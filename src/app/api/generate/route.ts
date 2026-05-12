/**
 * POST /api/generate
 *
 * Triggers Agents 2 + 3 sequentially:
 *   1. Agent 2 (Proposal Writer) — generates full proposal draft
 *   2. Agent 3 (Compliance Reviewer) — audits the draft and returns compliance flags
 *
 * Expects in body: { bidId, analysis } where analysis is the output from /api/analyze.
 * Returns: { proposal, review }
 * SERVER-SIDE ONLY — Gemini API key never leaves the server.
 */

import { NextRequest, NextResponse } from 'next/server';
import solicitations from '@/data/solicitations.json';
import contractorProfileRaw from '@/data/contractor-profile.json';
import proposalSeedsRaw from '@/data/proposal-seeds.json';
import { runWriter } from '@/lib/agents/writer';
import { runReviewer } from '@/lib/agents/reviewer';
import type { AnalystOutput } from '@/lib/agents/analyst';

const contractorProfile = contractorProfileRaw as any;
const proposalSeeds = proposalSeedsRaw as any;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bidId, analysis } = body as { bidId: string; analysis: AnalystOutput };

    if (!bidId || typeof bidId !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid bidId in request body.' },
        { status: 400 },
      );
    }

    if (!analysis || !analysis.requirements) {
      return NextResponse.json(
        { error: 'Missing or invalid analysis object. Run /api/analyze first.' },
        { status: 400 },
      );
    }

    const solicitation = (solicitations as any[]).find((s) => s.id === bidId);
    if (!solicitation) {
      return NextResponse.json(
        { error: `Solicitation with id "${bidId}" not found.` },
        { status: 404 },
      );
    }

    // Find proposal seed for this bid (optional — used as AI context)
    const seedEntry = proposalSeeds.seeds?.find((s: any) => s.bidId === bidId);
    const proposalSeed = seedEntry?.sections ?? undefined;

    // Agent 2: Write proposal
    const proposal = await runWriter(solicitation, analysis, contractorProfile, proposalSeed);

    // Agent 3: Review proposal
    const review = await runReviewer(proposal, analysis, solicitation);

    return NextResponse.json({
      success: true,
      bidId,
      proposal,
      review,
    });

  } catch (err: any) {
    console.error('[/api/generate] Error:', err);
    return NextResponse.json(
      {
        error: 'Generation failed. Check server logs for details.',
        detail: err?.message ?? 'Unknown error',
      },
      { status: 500 },
    );
  }
}
