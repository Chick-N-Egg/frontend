import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from './client';
import type { LogAttemptPayload, Result, UpdateBriefPayload } from './types';

export function useBrief(briefId: string | undefined) {
  return useQuery({
    queryKey: ['brief', briefId],
    queryFn: () => api.getBrief(briefId!),
    enabled: !!briefId,
  });
}

export function useResults(briefId: string | undefined) {
  return useQuery({
    queryKey: ['results', briefId],
    queryFn: () => api.getResults(briefId!),
    enabled: !!briefId,
  });
}

export function useResult(briefId: string | undefined, resultId: string | undefined) {
  const query = useResults(briefId);
  return {
    ...query,
    data: query.data?.find((r) => r.id === resultId),
  };
}

export function useAttempts(resultId: string | undefined) {
  return useQuery({
    queryKey: ['attempts', resultId],
    queryFn: () => api.getAttempts(resultId!),
    enabled: !!resultId,
  });
}

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.getDashboard(),
  });
}

export function useCreateBrief() {
  return useMutation({
    mutationFn: (rawInput: string) => api.createBrief(rawInput),
  });
}

export function useUpdateBrief(briefId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateBriefPayload) => api.updateBrief(briefId, payload),
    onSuccess: (brief) => queryClient.setQueryData(['brief', briefId], brief),
  });
}

export function useDiscoverMutation(briefId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.discover(briefId),
    onSuccess: (results) => queryClient.setQueryData(['results', briefId], results),
  });
}

export function useGenerateOutreachMutation(briefId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (resultId: string) => api.generateOutreach(resultId),
    onSuccess: (updated) => {
      queryClient.setQueryData<Result[]>(['results', briefId], (prev) =>
        prev?.map((r) => (r.id === updated.id ? updated : r)),
      );
    },
  });
}

export function useLogAttemptMutation(resultId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: LogAttemptPayload) => api.logAttempt(resultId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attempts', resultId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
