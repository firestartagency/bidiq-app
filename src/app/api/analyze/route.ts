/**
 * POST /api/analyze
 *
 * Triggers Agent 1 (Solicitation Analyst) for a given bid ID.
 * Returns structured analysis JSON.
 * SERVER-SIDE ONLY — Gemini API key never leaves the server.
 */

import { NextRequest, NextResponse } from 'next/server';
import solicitations from '@/data/solicitations.json';
import { runAnalyst } from '@/lib/agents/analyst';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bidId } = body;

    if (!bidId || typeof bidId !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid bidId in request body.' },
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

    const analysis = await runAnalyst(solicitation);

    return NextResponse.json({ success: true, bidId, analysis });
  } catch (err: any) {
    console.error('[/api/analyze] Error:', err);
    return NextResponse.json(
      { error: 'Analysis failed. Check server logs for details.', detail: err?.message ?? 'Unknown error' },
      { status: 500 },
    );
  }
}
