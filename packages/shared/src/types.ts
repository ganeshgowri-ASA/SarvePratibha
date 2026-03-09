// ─── User Roles ─────────────────────────────────────────────────────

export type UserRole = 'EMPLOYEE' | 'MANAGER' | 'SECTION_HEAD' | 'IT_ADMIN';

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  image?: string;
  employeeId?: string;
}

// ─── API Response ───────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ─── Menu & Navigation ─────────────────────────────────────────────

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  roles?: UserRole[];
  children?: MenuItem[];
}

// ─── Dashboard Widgets ──────────────────────────────────────────────

export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  pendingLeaves: number;
  pendingApprovals: number;
  todayPresent: number;
  todayAbsent: number;
}

export interface QuickLink {
  label: string;
  href: string;
  icon: string;
  description?: string;
}

export interface BirthdayAnniversary {
  employeeId: string;
  name: string;
  image?: string;
  type: 'birthday' | 'work_anniversary';
  date: string;
  years?: number;
}

// ─── Attendance ─────────────────────────────────────────────────────

export interface PunchStatus {
  isPunchedIn: boolean;
  lastPunchTime?: string;
  todayHours?: number;
}

// ─── Leave ──────────────────────────────────────────────────────────

export interface LeaveBalanceSummary {
  leaveType: string;
  code: string;
  allocated: number;
  used: number;
  balance: number;
}

// ─── AI Screening ──────────────────────────────────────────────────

export type ScreeningSessionStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'FAILED';
export type VoiceCallStatus = 'QUEUED' | 'RINGING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'NO_ANSWER' | 'BUSY';
export type VoiceProvider = 'VAPI' | 'RETELL' | 'ELEVENLABS' | 'SARVAM';
export type AIRecommendation = 'STRONG_SHORTLIST' | 'SHORTLIST' | 'HOLD' | 'REJECT';
export type ScreeningQuestionType = 'TECHNICAL' | 'BEHAVIORAL' | 'SITUATIONAL' | 'CULTURAL_FIT' | 'COMMUNICATION';
export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';

export interface AIScreeningSessionSummary {
  id: string;
  candidateName: string;
  candidateEmail: string;
  status: ScreeningSessionStatus;
  jobTitle: string;
  overallScore: number | null;
  recommendation: AIRecommendation | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
}

export interface AIScreeningSessionDetail extends AIScreeningSessionSummary {
  candidatePhone: string | null;
  language: string;
  summary: string | null;
  questions: AIScreeningQuestionItem[];
  responses: AIScreeningResponseItem[];
  scores: AIScreeningScoreItem[];
  voiceCalls: VoiceCallSummary[];
}

export interface AIScreeningQuestionItem {
  id: string;
  questionText: string;
  questionType: ScreeningQuestionType;
  difficulty: DifficultyLevel;
  orderIndex: number;
  expectedAnswer: string | null;
  maxScore: number;
  timeLimit: number | null;
}

export interface AIScreeningResponseItem {
  id: string;
  questionId: string;
  responseText: string | null;
  audioUrl: string | null;
  duration: number | null;
  score: number | null;
  sentiment: string | null;
  confidence: number | null;
  feedback: string | null;
}

export interface AIScreeningScoreItem {
  id: string;
  category: string;
  score: number;
  maxScore: number;
  details: string | null;
}

export interface VoiceCallSummary {
  id: string;
  provider: VoiceProvider;
  candidateName: string;
  candidatePhone: string;
  status: VoiceCallStatus;
  direction: string;
  startedAt: string | null;
  endedAt: string | null;
  duration: number | null;
  recordingUrl: string | null;
  createdAt: string;
}

export interface VoiceCallDetail extends VoiceCallSummary {
  transcripts: VoiceCallTranscriptItem[];
  costCents: number | null;
  errorMessage: string | null;
}

export interface VoiceCallTranscriptItem {
  id: string;
  speaker: string;
  text: string;
  timestamp: number;
  confidence: number | null;
}

export interface AIAssistantConfigData {
  id: string;
  name: string;
  voiceProvider: VoiceProvider;
  voiceId: string | null;
  personality: string | null;
  companyContext: string | null;
  language: string;
  supportedLanguages: string[];
  maxCallDuration: number;
  evaluationCriteria: Record<string, unknown> | null;
  isActive: boolean;
}

export interface ScreeningTemplateData {
  id: string;
  name: string;
  description: string | null;
  roleTitle: string | null;
  department: string | null;
  questions: ScreeningTemplateQuestion[];
  isActive: boolean;
  createdAt: string;
}

export interface ScreeningTemplateQuestion {
  text: string;
  type: ScreeningQuestionType;
  difficulty: DifficultyLevel;
  expectedAnswer?: string;
  maxScore: number;
}

export interface CandidateAIScoreData {
  id: string;
  applicationId: string;
  candidateName: string;
  technicalScore: number | null;
  communicationScore: number | null;
  culturalFitScore: number | null;
  confidenceScore: number | null;
  overallScore: number | null;
  resumeScore: number | null;
  ranking: number | null;
  recommendation: AIRecommendation | null;
  reasoning: string | null;
}

export interface AIScreeningAnalytics {
  totalSessions: number;
  completedSessions: number;
  avgScore: number;
  shortlistRate: number;
  avgDuration: number;
  providerBreakdown: Record<string, number>;
  scoreDistribution: { range: string; count: number }[];
  topCandidates: AIScreeningSessionSummary[];
}

// ─── Notification ───────────────────────────────────────────────────

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'ACTION_REQUIRED' | 'APPROVAL' | 'SYSTEM';
  link?: string;
  isRead: boolean;
  createdAt: string;
}
