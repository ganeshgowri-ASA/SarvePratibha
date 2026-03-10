export interface FaqEntry {
  keywords: string[];
  question: string;
  answer: string;
  category: string;
}

export const FAQ_CATEGORIES = [
  'Payroll',
  'Attendance',
  'HRA',
  'Vehicle & Fuel',
  'Claims & Reimbursements',
  'Leave Policy',
  'General HR',
] as const;

export type FaqCategory = (typeof FAQ_CATEGORIES)[number];

export const QUICK_ACTIONS = [
  { label: 'My Salary Slip', query: 'How do I download my salary slip?' },
  { label: 'Leave Balance', query: 'What is my leave balance?' },
  { label: 'HRA Details', query: 'How is HRA calculated?' },
  { label: 'Fuel Claim Process', query: 'How do I claim fuel reimbursement?' },
  { label: 'Pending Claims', query: 'How do I check my pending claims?' },
  { label: 'Attendance Summary', query: 'How do I check my attendance summary?' },
] as const;

export const KNOWLEDGE_BASE: FaqEntry[] = [
  // ── Payroll ──────────────────────────────────────────────
  {
    category: 'Payroll',
    keywords: ['salary', 'slip', 'download', 'payslip', 'pay slip'],
    question: 'How do I download my salary slip?',
    answer:
      'You can download your salary slip from the Payroll section. Navigate to My Payroll > Salary Slips, select the month, and click the Download PDF button. Salary slips are available from the 1st of each month for the previous month.',
  },
  {
    category: 'Payroll',
    keywords: ['salary', 'credit', 'date', 'when', 'paid', 'payment'],
    question: 'When is salary credited?',
    answer:
      'Salaries are credited on the last working day of every month. If the last day falls on a holiday or weekend, the salary is credited on the preceding working day. You will receive an email notification once the salary is processed.',
  },
  {
    category: 'Payroll',
    keywords: ['tax', 'declaration', 'investment', '80c', 'proof'],
    question: 'How do I submit tax declarations?',
    answer:
      'Tax declarations can be submitted through My Payroll > Tax Declarations. You can declare investments under Section 80C, 80D, HRA, and other sections. The declaration window opens in April and proof submission is required by January 31st. Upload supporting documents in PDF format.',
  },
  {
    category: 'Payroll',
    keywords: ['form 16', 'form16', 'tax certificate'],
    question: 'How do I get Form 16?',
    answer:
      'Form 16 is available for download from My Payroll > Tax Documents after June 15th each year. You will receive an email notification when it is ready. Form 16 Part A is generated from TRACES and Part B includes your salary details and tax computation.',
  },
  {
    category: 'Payroll',
    keywords: ['tds', 'tax deducted', 'tax deduction'],
    question: 'How is TDS calculated?',
    answer:
      'TDS is calculated based on your declared investments and the applicable tax regime (Old or New). Your annual income is estimated, declared deductions are applied, and tax is distributed equally across remaining months. You can view your TDS breakup in My Payroll > Tax Computation.',
  },
  {
    category: 'Payroll',
    keywords: ['bonus', 'eligible', 'eligibility', 'performance bonus'],
    question: 'Am I eligible for a bonus?',
    answer:
      'Bonus eligibility depends on your grade, tenure, and performance rating. Generally, employees who have completed at least 6 months of service and have a performance rating of 3 or above are eligible. Bonuses are typically announced during the annual appraisal cycle. Check with your manager or HR for your specific eligibility.',
  },

  // ── Attendance ───────────────────────────────────────────
  {
    category: 'Attendance',
    keywords: ['punch', 'in', 'out', 'check in', 'check out', 'clock'],
    question: 'What are the punch in/out rules?',
    answer:
      'Punch-in should be done within the first 15 minutes of your shift start time. Punch-out should be after completing your minimum shift hours (8.5 hours for general shift). You can punch in/out from the Attendance module on the dashboard or through the biometric system at office.',
  },
  {
    category: 'Attendance',
    keywords: ['late', 'mark', 'penalty', 'late coming'],
    question: 'What is the late mark policy?',
    answer:
      'A late mark is recorded if you punch in more than 15 minutes after shift start time. Three late marks in a month result in a half-day salary deduction. Six or more late marks lead to a full-day deduction. You can view your late mark count in Attendance > My Attendance.',
  },
  {
    category: 'Attendance',
    keywords: ['regularize', 'regularization', 'forgot', 'missed', 'correction'],
    question: 'How do I regularize attendance?',
    answer:
      'If you missed a punch or need to correct attendance, go to Attendance > Regularization and submit a request with the correct time and reason. Your manager needs to approve the request. Regularization requests must be submitted within 3 working days of the missed punch. Maximum 3 regularizations are allowed per month.',
  },
  {
    category: 'Attendance',
    keywords: ['wfh', 'work from home', 'remote', 'home'],
    question: 'How does WFH attendance work?',
    answer:
      'For Work From Home days, you must apply for WFH through the Attendance module before 10 AM. Your manager needs to approve the request. Once approved, you should still punch in and out through the web portal. WFH days are capped at the limit set by your department policy (typically 2-4 days per month).',
  },

  // ── HRA ──────────────────────────────────────────────────
  {
    category: 'HRA',
    keywords: ['hra', 'calculation', 'formula', 'how much', 'calculated'],
    question: 'How is HRA calculated?',
    answer:
      'HRA exemption is calculated as the minimum of: (1) Actual HRA received, (2) 50% of basic salary for metro cities or 40% for non-metro cities, (3) Actual rent paid minus 10% of basic salary. The lowest of these three values is your HRA exemption. You can view the detailed calculation in My Payroll > HRA Details.',
  },
  {
    category: 'HRA',
    keywords: ['hra', 'exemption', 'exempt', 'tax free'],
    question: 'What is HRA exemption?',
    answer:
      'HRA exemption reduces your taxable income. To claim it, you must be living in rented accommodation, pay rent, and receive HRA as part of your salary. Submit your rent receipts and rental agreement through My Payroll > Tax Declarations > HRA section before the proof submission deadline.',
  },
  {
    category: 'HRA',
    keywords: ['rent', 'receipt', 'submit', 'upload', 'rental'],
    question: 'How do I submit rent receipts?',
    answer:
      'Upload rent receipts through My Payroll > Tax Declarations > HRA. You need to provide: monthly rent receipts with revenue stamp (for rent > Rs. 5000), landlord PAN (if annual rent exceeds Rs. 1,00,000), and a copy of your rental agreement. Receipts should be submitted quarterly.',
  },
  {
    category: 'HRA',
    keywords: ['metro', 'non-metro', 'city', 'rate', 'percentage'],
    question: 'What are metro vs non-metro HRA rates?',
    answer:
      'For metro cities (Delhi, Mumbai, Kolkata, Chennai), HRA exemption is calculated at 50% of basic salary. For non-metro cities, it is 40% of basic salary. Your city classification is based on your office location as per company records. If you need a change, raise a request through HR Help Desk.',
  },

  // ── Vehicle & Fuel ───────────────────────────────────────
  {
    category: 'Vehicle & Fuel',
    keywords: ['fuel', 'limit', 'grade', 'allowance', 'petrol', 'diesel'],
    question: 'What is the fuel limit per grade?',
    answer:
      'Fuel reimbursement limits vary by grade: Grade A-B: Rs. 3,000/month, Grade C-D: Rs. 5,000/month, Grade E and above: Rs. 8,000/month. These limits are for official travel and commute. Check your grade-specific limit in Claims > Fuel Reimbursement.',
  },
  {
    category: 'Vehicle & Fuel',
    keywords: ['fuel', 'claim', 'process', 'how', 'reimbursement', 'submit'],
    question: 'How do I claim fuel reimbursement?',
    answer:
      'To claim fuel reimbursement: (1) Go to Claims > Fuel Reimbursement, (2) Enter the bill date, amount, and distance traveled, (3) Upload scanned fuel bills, (4) Submit for manager approval. Claims must be submitted within 30 days of the bill date. Approved claims are reimbursed in the next salary cycle.',
  },
  {
    category: 'Vehicle & Fuel',
    keywords: ['document', 'required', 'proof', 'fuel bill', 'vehicle'],
    question: 'What documents are required for fuel claims?',
    answer:
      'Required documents for fuel claims: (1) Original fuel bills with vehicle number, (2) Valid driving license copy (one-time upload), (3) Vehicle RC copy (one-time upload), (4) Odometer reading photo for distance verification. All bills must be in the employee\'s or spouse\'s name.',
  },
  {
    category: 'Vehicle & Fuel',
    keywords: ['two wheeler', 'four wheeler', 'two-wheeler', 'four-wheeler', 'bike', 'car', 'rate'],
    question: 'What are two-wheeler vs four-wheeler rates?',
    answer:
      'Reimbursement rates: Two-wheeler: Rs. 3.50/km, Four-wheeler: Rs. 8.00/km. These rates are applicable for official travel claims. For monthly fuel allowance, the limit is grade-based and vehicle-type independent. Rates are revised annually based on fuel price index.',
  },
  {
    category: 'Vehicle & Fuel',
    keywords: ['monthly', 'cap', 'maximum', 'limit', 'fuel'],
    question: 'What is the monthly fuel cap?',
    answer:
      'Monthly fuel cap is based on your employment grade and cannot be exceeded. Unused amounts do not carry forward. If you have exceptional travel requirements, get prior approval from your department head. The cap is pro-rated for mid-month joiners.',
  },

  // ── Claims & Reimbursements ──────────────────────────────
  {
    category: 'Claims & Reimbursements',
    keywords: ['medical', 'claim', 'health', 'hospital', 'medicine'],
    question: 'How do I submit a medical claim?',
    answer:
      'Submit medical claims through Claims > Medical Reimbursement. Upload original bills, prescriptions, and hospital discharge summary (if applicable). Claims up to Rs. 15,000 per year are reimbursed directly. Claims above this amount should be routed through your group health insurance via the Insurance portal.',
  },
  {
    category: 'Claims & Reimbursements',
    keywords: ['travel', 'claim', 'trip', 'business travel', 'ta', 'da'],
    question: 'How do I submit a travel claim?',
    answer:
      'For business travel claims: (1) Get travel pre-approval from your manager, (2) After the trip, go to Claims > Travel Reimbursement, (3) Fill in trip details including dates, destinations, and expenses, (4) Upload boarding passes, hotel bills, and conveyance receipts, (5) Submit within 7 days of trip completion.',
  },
  {
    category: 'Claims & Reimbursements',
    keywords: ['telephone', 'phone', 'mobile', 'reimbursement'],
    question: 'How does telephone reimbursement work?',
    answer:
      'Telephone reimbursement is available based on your grade. Submit monthly phone bills through Claims > Telephone Reimbursement. Limits: Grade A-B: Rs. 500/month, Grade C-D: Rs. 1,000/month, Grade E+: Rs. 2,000/month. Bills must be in the employee\'s name.',
  },
  {
    category: 'Claims & Reimbursements',
    keywords: ['approval', 'flow', 'workflow', 'who approves', 'pending approval'],
    question: 'What is the claim approval flow?',
    answer:
      'Claims follow this approval flow: Employee submits claim > Reporting Manager reviews > Section Head approves (for claims > Rs. 10,000) > Finance team processes payment. You can track your claim status in Claims > My Claims. Each approver has 3 working days to take action.',
  },
  {
    category: 'Claims & Reimbursements',
    keywords: ['pending', 'status', 'track', 'where', 'my claims'],
    question: 'How do I check pending claims?',
    answer:
      'Go to Claims > My Claims to see all your submitted claims and their status. Filter by status (Pending, Approved, Rejected, Paid) or by date range. You can also click on any claim to see the detailed approval timeline and any comments from approvers.',
  },

  // ── Leave Policy ─────────────────────────────────────────
  {
    category: 'Leave Policy',
    keywords: ['leave', 'balance', 'remaining', 'how many', 'available'],
    question: 'How do I check my leave balance?',
    answer:
      'Your leave balance is visible on the Dashboard home page and in Leave > My Leave Balance. Casual Leave: 12 days/year, Sick Leave: 12 days/year, Earned Leave: 15 days/year, Compensatory Off: as earned. Balances reset on April 1st each year except Earned Leave which can carry forward.',
  },
  {
    category: 'Leave Policy',
    keywords: ['encashment', 'encash', 'cash', 'leave cash'],
    question: 'How does leave encashment work?',
    answer:
      'Earned Leave can be encashed once per year during the encashment window (March). Maximum 50% of your EL balance or 10 days (whichever is lower) can be encashed. Encashment is calculated on basic salary. Go to Leave > Encashment to submit your request. The amount is credited with the next month salary.',
  },
  {
    category: 'Leave Policy',
    keywords: ['carry', 'forward', 'carryforward', 'next year', 'lapse'],
    question: 'What are the carry forward rules?',
    answer:
      'Leave carry forward rules: Casual Leave - does not carry forward, lapses on March 31st. Sick Leave - does not carry forward, lapses on March 31st. Earned Leave - carries forward up to a maximum of 30 days. Compensatory Off - valid for 30 days from the date of earning.',
  },
  {
    category: 'Leave Policy',
    keywords: ['comp off', 'compensatory', 'comp-off', 'weekend', 'holiday work'],
    question: 'What are comp-off rules?',
    answer:
      'Compensatory Off (Comp-Off) is granted when you work on a holiday or weekend with prior approval. Apply for comp-off through Leave > Apply Comp-Off within 15 days of working. Your manager must approve both the extra work and the comp-off request. Comp-offs are valid for 30 days and cannot be carried forward or encashed.',
  },

  // ── General HR ───────────────────────────────────────────
  {
    category: 'General HR',
    keywords: ['confirmation', 'letter', 'probation', 'confirm'],
    question: 'How do I get my confirmation letter?',
    answer:
      'Your confirmation letter is issued after successful completion of the probation period (typically 6 months). Your manager and HR will initiate the confirmation process. Once confirmed, you can download the letter from My Profile > Documents. If your probation has ended but you haven\'t received the letter, raise a request via HR Help Desk.',
  },
  {
    category: 'General HR',
    keywords: ['experience', 'letter', 'relieving', 'employment letter'],
    question: 'How do I request an experience letter?',
    answer:
      'Experience letters and employment verification letters can be requested through HR Help Desk > Document Request. Select the document type, purpose, and language. Standard processing time is 3-5 working days. For urgent requests, mark it as priority and it will be processed within 1 working day.',
  },
  {
    category: 'General HR',
    keywords: ['pf', 'provident fund', 'epf', 'withdrawal', 'pf balance'],
    question: 'How do I withdraw PF?',
    answer:
      'PF withdrawal can be done for specific purposes: home purchase, medical emergency, education, or marriage. Partial withdrawal is allowed after 5 years of service. Submit your request through the EPFO portal (member.epfindia.gov.in) using your UAN. For full withdrawal, you can apply after 2 months of leaving the organization. Contact HR for assistance with the process.',
  },
  {
    category: 'General HR',
    keywords: ['gratuity', 'eligible', 'eligibility', 'years', 'service'],
    question: 'Am I eligible for gratuity?',
    answer:
      'Gratuity is payable to employees who have completed 5 or more years of continuous service. The formula is: (Last drawn basic salary x 15 x Years of service) / 26. Maximum gratuity payable is Rs. 20,00,000. Gratuity is automatically calculated and paid at the time of separation from the organization.',
  },
];

const GREETING_PATTERNS = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'];

const THANKS_PATTERNS = ['thank', 'thanks', 'thank you', 'appreciate'];

export function findBestMatch(query: string): FaqEntry | null {
  const normalizedQuery = query.toLowerCase().trim();

  // Check for greetings
  if (GREETING_PATTERNS.some((g) => normalizedQuery.includes(g))) {
    return null; // Signal to return greeting response
  }

  // Check for thanks
  if (THANKS_PATTERNS.some((t) => normalizedQuery.includes(t))) {
    return null; // Signal to return thanks response
  }

  let bestMatch: FaqEntry | null = null;
  let bestScore = 0;

  for (const entry of KNOWLEDGE_BASE) {
    let score = 0;
    const queryWords = normalizedQuery.split(/\s+/);

    for (const keyword of entry.keywords) {
      const keywordLower = keyword.toLowerCase();
      if (normalizedQuery.includes(keywordLower)) {
        score += 3;
      } else {
        for (const word of queryWords) {
          if (keywordLower.includes(word) || word.includes(keywordLower)) {
            score += 1;
          }
        }
      }
    }

    // Boost score if category name appears in query
    if (normalizedQuery.includes(entry.category.toLowerCase())) {
      score += 2;
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  return bestScore >= 2 ? bestMatch : null;
}

export function getGreetingResponse(): string {
  return "Hello! I'm HR Buddy, your virtual HR assistant. I can help you with queries about payroll, attendance, HRA, leave policies, claims, and more. How can I assist you today?";
}

export function getThanksResponse(): string {
  return "You're welcome! Feel free to ask if you have any other HR-related questions. I'm always here to help.";
}

export function getFallbackResponse(): string {
  return "I'm not sure I have an answer for that specific query. I can help with payroll, attendance, HRA, vehicle & fuel claims, reimbursements, leave policies, and general HR topics. Could you try rephrasing your question, or would you like to connect with an HR executive for personalized assistance?";
}

export function isGreeting(query: string): boolean {
  const normalized = query.toLowerCase().trim();
  return GREETING_PATTERNS.some((g) => normalized.includes(g));
}

export function isThanks(query: string): boolean {
  const normalized = query.toLowerCase().trim();
  return THANKS_PATTERNS.some((t) => normalized.includes(t));
}
