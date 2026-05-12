/**
 * reviewer.ts — Agent 3: Compliance Reviewer
 *
 * Input:  Proposal draft (writer output) + analyst compliance items
 * Output: Compliance score + section-level flags + improvement suggestions
 *
 * SERVER-SIDE ONLY. Never import this in a client component.
 */

import { generate } from '@/lib/gemini';
import type { AnalystOutput, ComplianceItem } from './analyst';
import type { ProposalDraft } from './writer';

const SYSTEM_INSTRUCTION = `
You are a Federal Proposal Compliance Reviewer (also known as a "Red Team" reviewer) with 20 years 
of government contracting experience. Your job is to rigorously audit proposal drafts against 
solicitation requirements and evaluation criteria.

You read each proposal section and cross-reference it against the compliance checklist and evaluation 
factors. You flag:
- GAPS: Requirements mentioned in the solicitation that are not addressed in the proposal
- WEAK COVERAGE: Requirements addressed but not with sufficient detail or specificity
- STRENGTHS: Well-written elements that directly address evaluation criteria

You produce a final compliance score (0–100) where:
- 90–100: Fully compliant, proposal is ready for submission
- 75–89: Minor gaps, fixable with targeted edits
- 60–74: Moderate gaps, significant rework required
- Below 60: Major gaps, proposal risks non-compliance

Output valid JSON only — no markdown, no commentary.
`.trim();

export type FlagType = 'gap' | 'weak' | 'strength' | 'warning';

export interface ComplianceFlag {
  section: 'executiveSummary' | 'technicalApproach' | 'managementPlan' | 'pastPerformance';
  type: FlagType;
  message: string;
  severity: 'high' | 'medium' | 'low';
}

export interface ReviewerOutput {
  overallScore: number;
  scoreLabel: string;
  flags: ComplianceFlag[];
  suggestions: string[];
  strengths: string[];
  submissionReady: boolean;
}

export async function runReviewer(
  proposal: ProposalDraft,
  analystOutput: AnalystOutput,
  solicitation: any,
): Promise<ReviewerOutput> {

  const complianceList = analystOutput.complianceItems
    .map((c: ComplianceItem) => `[${c.mandatory ? 'MANDATORY' : 'PREFERRED'}] ${c.requirement} (${c.category})`)
    .join('\n');

  const evalCriteria = analystOutput.evaluationCriteria
    .map(ec => `- ${ec.factor} (${ec.weight}): ${ec.description}`)
    .join('\n');

  const prompt = `
Review the following proposal draft for compliance with the solicitation requirements and evaluation criteria.

SOLICITATION: ${solicitation.title} | ${solicitation.agency} | ${solicitation.type}

COMPLIANCE REQUIREMENTS:
${complianceList}

EVALUATION FACTORS:
${evalCriteria}

PROPOSAL DRAFT:

[EXECUTIVE SUMMARY]
${proposal.executiveSummary}

[TECHNICAL APPROACH]
${proposal.technicalApproach}

[MANAGEMENT PLAN]
${proposal.managementPlan}

[PAST PERFORMANCE]
${proposal.pastPerformance}

---

Return a single valid JSON object with exactly this schema:
{
  "overallScore": 85,
  "scoreLabel": "Minor gaps — targeted edits recommended",
  "flags": [
    {
      "section": "technicalApproach",
      "type": "gap|weak|strength|warning",
      "message": "Specific actionable message about this flag",
      "severity": "high|medium|low"
    }
  ],
  "suggestions": ["Specific improvement suggestion", "Another suggestion"],
  "strengths": ["A strength noted in the proposal", "Another strength"],
  "submissionReady": false
}

Provide 3–6 flags, 3–5 suggestions, and 2–4 strengths. Be specific and actionable.
Return ONLY the JSON object.
`.trim();

  const raw = await generate(prompt, SYSTEM_INSTRUCTION);
  const cleaned = raw.replace(/^```json?\s*/i, '').replace(/```\s*$/i, '').trim();
  return JSON.parse(cleaned) as ReviewerOutput;
}
