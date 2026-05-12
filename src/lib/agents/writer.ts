/**
 * writer.ts — Agent 2: Proposal Writer
 *
 * Input:  Analyst output + contractor profile + optional proposal seed
 * Output: Full 4-section proposal draft
 *
 * SERVER-SIDE ONLY. Never import this in a client component.
 */

import { generate } from '@/lib/gemini';
import type { AnalystOutput } from './analyst';

const SYSTEM_INSTRUCTION = `
You are an expert Federal Proposal Writer with 15 years of experience winning government contracts 
for small businesses. You specialize in writing compliant, compelling proposals for DoD and civilian 
agency solicitations under FAR Part 15 (Best Value) and simplified acquisition procedures.

Your writing is authoritative, specific, and outcome-focused. You avoid vague language and always 
tie contractor capabilities directly to the solicitation's stated requirements. You naturally 
incorporate win themes, quantified past performance metrics, and evaluation factor alignment 
throughout each section.

You produce formal government proposal prose — not marketing copy. Sections should be 300–500 words 
each, written in third person, present tense, structured with clear sub-headings where appropriate.

Output valid JSON only — no markdown, no commentary.
`.trim();

export interface ProposalDraft {
  executiveSummary: string;
  technicalApproach: string;
  managementPlan: string;
  pastPerformance: string;
}

export async function runWriter(
  solicitation: any,
  analystOutput: AnalystOutput,
  contractorProfile: any,
  proposalSeed?: Record<string, string>,
): Promise<ProposalDraft> {

  const winThemes = analystOutput.winThemes.map((t, i) => `${i + 1}. ${t}`).join('\n');
  const requirements = analystOutput.requirements
    .map(r => `[${r.priority}] ${r.section}: ${r.requirement}`)
    .join('\n');

  const pastPerf = contractorProfile.pastPerformance
    .map((pp: any) => `- ${pp.contractTitle} | ${pp.agency} | ${pp.value} | CPARS: ${pp.cparsRating}\n  ${pp.scopeSummary}\n  Key Outcome: ${pp.keyOutcome}`)
    .join('\n\n');

  const personnel = contractorProfile.keyPersonnel
    .map((kp: any) => `- ${kp.name}, ${kp.title} (Clearance: ${kp.clearance}) — ${kp.experienceSummary.slice(0, 200)}…`)
    .join('\n\n');

  const seedContext = proposalSeed
    ? `\nPROPOSAL SEED CONTENT (use as context and expand upon — do not copy verbatim):\n${JSON.stringify(proposalSeed, null, 2)}`
    : '';

  const prompt = `
Write a complete 4-section proposal for the following federal solicitation.

SOLICITATION:
Title: ${solicitation.title}
Agency: ${solicitation.agency}
Type: ${solicitation.type} | Set-Aside: ${solicitation.setAside}
Value: ${solicitation.value} | Due: ${solicitation.dueDate}

KEY REQUIREMENTS:
${requirements}

WIN THEMES TO WEAVE IN:
${winThemes}

CONTRACTOR PROFILE:
Company: ${contractorProfile.company.name}
Certifications: ${contractorProfile.company.businessTypes.join(', ')}
Capability Statement: ${contractorProfile.company.capabilityStatement}

KEY PERSONNEL:
${personnel}

PAST PERFORMANCE:
${pastPerf}
${seedContext}

---

Return a single valid JSON object with exactly this schema:
{
  "executiveSummary": "300-500 word section text",
  "technicalApproach": "400-500 word section text with sub-headings separated by \\n\\n",
  "managementPlan": "300-400 word section text",
  "pastPerformance": "300-400 word section text referencing the 3 past performance entries"
}

Each section must be formal, specific, and directly address the solicitation requirements.
Reference specific CPARS ratings, contract values, and quantified outcomes in pastPerformance.
Do NOT use placeholder text. Return ONLY the JSON object.
`.trim();

  const raw = await generate(prompt, SYSTEM_INSTRUCTION);
  const cleaned = raw.replace(/^```json?\s*/i, '').replace(/```\s*$/i, '').trim();
  return JSON.parse(cleaned) as ProposalDraft;
}
