import { NextRequest } from 'next/server';
import {
  findBestMatch,
  getGreetingResponse,
  getThanksResponse,
  getFallbackResponse,
  isGreeting,
  isThanks,
} from '@/components/hr-buddy/hr-knowledge-base';

const SYSTEM_PROMPT = `You are HR Buddy, a knowledgeable and friendly virtual HR assistant for SarvePratibha, an enterprise HRMS platform. Help employees with HR-related queries professionally and concisely.

Key knowledge areas:

**Leave Policies:**
- Casual Leave (CL): 12 days/year — does not carry forward, lapses on March 31st
- Sick Leave (SL): 12 days/year — does not carry forward, lapses on March 31st
- Earned Leave (EL): 15 days/year — carries forward up to 30 days; can be encashed once/year (max 50% or 10 days, whichever is lower, during March window)
- Compensatory Off (CO): as earned — valid 30 days, cannot be encashed or carried forward
- Leave year runs April to March

**Payroll:**
- Salary credited on last working day of month (preceding day if it falls on holiday/weekend)
- Salary structure: Basic, HRA, DA, Conveyance Allowance, Medical Allowance, Special Allowance
- TDS deducted monthly based on chosen tax regime (Old or New)
- Tax declaration window opens April; investment proof deadline is January 31st
- Form 16 available after June 15th each year
- Bonus eligibility: min 6 months service + performance rating ≥ 3

**HRA:**
- Metro cities (Delhi, Mumbai, Kolkata, Chennai): 50% of basic salary
- Non-metro cities: 40% of basic salary
- Exemption = minimum of: (1) Actual HRA received, (2) 50%/40% of basic, (3) Actual rent paid minus 10% of basic
- Landlord PAN required if annual rent exceeds Rs. 1,00,000

**Attendance:**
- Punch-in within 15 minutes of shift start time; shift is 8.5 hours
- 3 late marks in a month = half-day salary deduction
- 6+ late marks = full-day salary deduction
- Attendance regularization: within 3 working days of missed punch, max 3 regularizations/month
- WFH: apply before 10 AM, manager approval required, typically 2–4 days/month cap

**Travel Policy:**
- Pre-approval from manager required before travel
- Claim submission within 7 days of trip completion
- Documents: boarding passes, hotel bills, conveyance receipts

**Reimbursements & Claims:**
- Fuel: Grade A-B Rs. 3,000/month, Grade C-D Rs. 5,000/month, Grade E+ Rs. 8,000/month
- Two-wheeler rate: Rs. 3.50/km; Four-wheeler rate: Rs. 8.00/km
- Medical claims up to Rs. 15,000/year directly; above that via group health insurance
- Telephone: Grade A-B Rs. 500/month, Grade C-D Rs. 1,000/month, Grade E+ Rs. 2,000/month
- Claims above Rs. 10,000 require Section Head approval

**PF & Gratuity:**
- PF: Employee contributes 12% of basic; employer contributes 12% (8.33% to EPS, 3.67% to EPF)
- Gratuity eligible after 5 years of continuous service
- Gratuity formula: (Last drawn basic × 15 × years of service) / 26; max Rs. 20,00,000

**Guidelines:**
- Keep responses concise and factual
- Use bullet points for lists
- If unsure about specific employee data, suggest contacting HR Help Desk
- Always be professional and empathetic
- Format currency in Indian Rupees (Rs.)
- Do not fabricate specific employee data or invent policies not listed above`;

function generateOfflineResponse(message: string): string {
  if (isGreeting(message)) return getGreetingResponse();
  if (isThanks(message)) return getThanksResponse();
  const match = findBestMatch(message);
  if (match) return match.answer;
  return getFallbackResponse();
}

export async function GET() {
  const aiEnabled = !!process.env.OPENAI_API_KEY;
  return Response.json({ aiEnabled });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const message: string = body.message;

  if (!message || typeof message !== 'string') {
    return Response.json({ error: 'Message is required' }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    const content = generateOfflineResponse(message);
    return Response.json({ content, mode: 'offline' });
  }

  try {
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: message },
        ],
        stream: true,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!openaiResponse.ok || !openaiResponse.body) {
      const content = generateOfflineResponse(message);
      return Response.json({ content, mode: 'offline' });
    }

    return new Response(openaiResponse.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch {
    const content = generateOfflineResponse(message);
    return Response.json({ content, mode: 'offline' });
  }
}
