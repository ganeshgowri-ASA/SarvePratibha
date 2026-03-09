import { apiGet, apiPost } from './client';
import type {
  AIScreeningSessionSummary,
  AIScreeningSessionDetail,
  AIScreeningAnalytics,
  VoiceCallSummary,
  VoiceCallDetail,
  AIAssistantConfigData,
  ScreeningTemplateData,
  CandidateAIScoreData,
} from '@sarve-pratibha/shared';
import type {
  InitiateScreeningInput,
  EvaluateScreeningInput,
  InitiateVoiceCallInput,
  AIAssistantConfigInput,
  ScreeningTemplateInput,
  ResumeParseInput,
  CandidateRankInput,
} from '@sarve-pratibha/shared';

// ─── Screening Sessions ──────────────────────────────────────────

export async function initiateScreening(data: InitiateScreeningInput) {
  return apiPost<any>('/api/ai/screening/initiate', data);
}

export async function getScreeningSession(id: string) {
  return apiGet<any>(`/api/ai/screening/session/${id}`);
}

export async function evaluateScreening(data: EvaluateScreeningInput) {
  return apiPost<any>('/api/ai/screening/evaluate', data);
}

export async function getScreeningResults(candidateId: string) {
  return apiGet<any>(`/api/ai/screening/results/${candidateId}`);
}

// ─── Templates ───────────────────────────────────────────────────

export async function createTemplate(data: ScreeningTemplateInput) {
  return apiPost<ScreeningTemplateData>('/api/ai/screening/template/create', data);
}

export async function getTemplates() {
  return apiGet<ScreeningTemplateData[]>('/api/ai/screening/templates');
}

// ─── Voice Calls ─────────────────────────────────────────────────

export async function initiateVoiceCall(data: InitiateVoiceCallInput) {
  return apiPost<any>('/api/ai/voice/call/initiate', data);
}

export async function getVoiceCallStatus(id: string) {
  return apiGet<any>(`/api/ai/voice/call/${id}/status`);
}

export async function getVoiceCallTranscript(id: string) {
  return apiGet<VoiceCallDetail>(`/api/ai/voice/call/${id}/transcript`);
}

export async function endVoiceCall(id: string) {
  return apiPost<any>(`/api/ai/voice/call/${id}/end`);
}

export async function getVoiceCalls(params?: { candidateId?: string; status?: string; page?: number }) {
  const searchParams = new URLSearchParams();
  if (params?.candidateId) searchParams.set('candidateId', params.candidateId);
  if (params?.status) searchParams.set('status', params.status);
  if (params?.page) searchParams.set('page', String(params.page));
  return apiGet<any>(`/api/ai/voice/calls?${searchParams.toString()}`);
}

// ─── AI Assistant Config ─────────────────────────────────────────

export async function saveAssistantConfig(data: AIAssistantConfigInput) {
  return apiPost<AIAssistantConfigData>('/api/ai/assistant/config', data);
}

export async function getAssistantConfig() {
  return apiGet<AIAssistantConfigData>('/api/ai/assistant/config');
}

// ─── Analytics ───────────────────────────────────────────────────

export async function getScreeningAnalytics() {
  return apiGet<AIScreeningAnalytics>('/api/ai/analytics/screening-effectiveness');
}

// ─── Resume & Ranking ────────────────────────────────────────────

export async function parseResume(data: ResumeParseInput) {
  return apiPost<any>('/api/ai/resume/parse', data);
}

export async function rankCandidates(data: CandidateRankInput) {
  return apiPost<CandidateAIScoreData[]>('/api/ai/candidate/rank', data);
}
