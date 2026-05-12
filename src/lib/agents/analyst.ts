/**
 * analyst.ts — Agent 1: Solicitation Analyst
 *
 * Input:  A solicitation object from solicitations.json
 * Output: Structured analysis: requirements, evaluation criteria, compliance matrix, deliverables
 *
 * SERVER-SIDE ONLY. Never import this in a client component.
 */

import { generate } from '@/lib/gemini';

const SYSTEM_INSTRUCTION = `
You are a Senior Federal Procurement Analyst with 20 years of experience in U.S. Government contracting.
Your specialty is analyzing solicitation documents (RFPs, RFQs, Sources Sought) and extracting actionable, 
structured intelligence for small business contractors pursuing government contracts.

You are precise, formal, and deeply familiar with FAR/DFARS regulations, DoD acquisition processes,
NAICS codes, set-aside categories, and common proposal evaluation methodologies (Best Value, LPTA, SSEB).

When analyzing a solicitation, you extract ONLY what is explicitly stated or clearly implied in the document.
You do not invent requirements. You output valid JSON only — no markdown, no commentary.
`.trim();

export interface Requirement {
  section: string;
  requirement: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  source: string;
}

export interface EvaluationCriterion {
  factor: string;
  weight: string;
  description: string;
}

export interface ComplianceItem {
  requirement: string;
  category: 'Certification' | 'Clearance' | 'Technical' | 'Administrative';
  mandatory: boolean;
}

export interface AnalystOutput {
  requirements: Requirement[];
  evaluationCriteria: EvaluationCriterion[];
  complianceItems: ComplianceItem[];
  keyDeliverables: string[];
  winThemes: string[];
  riskFlags: string[];
}

export async function runAnalyst(solicitation: any): Promise<AnalystOutput> {
  const prompt = `
Analyze the following federal solicitation and return a structured JSON object.

SOLICITATION DETAILS:
- Solicitation Number: ${solicitation.solicitationNumber}
- Title: ${solicitation.title}
- Agency: ${solicitation.agency}
- Type: ${solicitation.type}
- NAICS: ${solicitation.naics} — ${solicitation.naicsDescription}
- Set-Aside: ${solicitation.setAside}
- Contract Value: ${solicitation.value}
- Due Date: ${solicitation.dueDate}
- Place of Performance: ${solicitation.placeOfPerformance}
- Period of Performance: ${solicitation.periodOfPerformance}

SYNOPSIS:
${solicitation.synopsis}

PERFORMANCE WORK STATEMENT (PWS):
${solicitation.pwsExcerpt}

SECTION L — INSTRUCTIONS TO OFFERORS:
${solicitation.sectionL}

SECTION M — EVALUATION CRITERIA:
${solicitation.sectionM}

COMPLIANCE REQUIREMENTS:
${solicitation.complianceRequirements?.join('\n') ?? 'None listed'}

KEY DELIVERABLES:
${solicitation.keyDeliverables?.join('\n') ?? 'None listed'}

---

Return a single valid JSON object with this exact schema:
{
  "requirements": [
    { "section": "PWS §1", "requirement": "string", "priority": "Critical|High|Medium|Low", "source": "PWS|Section L|Section M|Synopsis" }
  ],
  "evaluationCriteria": [
    { "factor": "string", "weight": "string", "description": "string" }
  ],
  "complianceItems": [
    { "requirement": "string", "category": "Certification|Clearance|Technical|Administrative", "mandatory": true }
  ],
  "keyDeliverables": ["string"],
  "winThemes": ["string - 3 to 5 high-impact win themes for this specific solicitation"],
  "riskFlags": ["string - any risks or unusual requirements a small business should note"]
}

Return ONLY the JSON object. No markdown code fences. No commentary.
`.trim();

  const raw = await generate(prompt, SYSTEM_INSTRUCTION);

  // Strip any markdown fences if model wraps output anyway
  const cleaned = raw.replace(/^```json?\s*/i, '').replace(/```\s*$/i, '').trim();

  return JSON.parse(cleaned) as AnalystOutput;
}
