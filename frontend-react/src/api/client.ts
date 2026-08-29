import type {
  Attempt,
  Brief,
  BriefCreationResponse,
  DashboardResponse,
  LogAttemptPayload,
  Result,
  UpdateBriefPayload,
} from './types';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiFetch<T>(path: string, init?: Omit<RequestInit, 'body'> & { body?: unknown }): Promise<T> {
  const res = await fetch(`/api${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    body: init?.body !== undefined ? JSON.stringify(init.body) : undefined,
  });

  if (!res.ok) {
    throw new ApiError(res.status, await res.text());
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  createBrief: (rawInput: string) =>
    apiFetch<BriefCreationResponse>('/briefs', { method: 'POST', body: { rawInput } }),
  getBrief: (id: string) => apiFetch<Brief>(`/briefs/${id}`),
  updateBrief: (id: string, payload: UpdateBriefPayload) =>
    apiFetch<Brief>(`/briefs/${id}`, { method: 'PATCH', body: payload }),
  discover: (briefId: string) => apiFetch<Result[]>(`/briefs/${briefId}/discover`, { method: 'POST' }),
  getResults: (briefId: string) => apiFetch<Result[]>(`/briefs/${briefId}/results`),
  generateOutreach: (resultId: string) =>
    apiFetch<Result>(`/results/${resultId}/outreach`, { method: 'POST' }),
  logAttempt: (resultId: string, payload: LogAttemptPayload) =>
    apiFetch<Attempt>(`/results/${resultId}/attempts`, { method: 'POST', body: payload }),
  getAttempts: (resultId: string) => apiFetch<Attempt[]>(`/attempts?resultId=${resultId}`),
  getDashboard: () => apiFetch<DashboardResponse>('/dashboard'),
  health: () => apiFetch<{ status: string }>('/health'),
};
