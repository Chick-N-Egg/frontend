import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { Logo } from '../components/ui/Logo';
import { Badge } from '../components/ui/Badge';
import { NetworkMap } from '../components/map/NetworkMap';
import { CHANNEL_LABELS } from '../components/map/channelColors';
import { useBrief, useGenerateOutreachMutation, useResults } from '../api/hooks';
import type { Result } from '../api/types';

export function MapScreen() {
  const { briefId } = useParams<{ briefId: string }>();
  const navigate = useNavigate();
  const { data: brief } = useBrief(briefId);
  const { data: results, isLoading } = useResults(briefId);
  const generateOutreach = useGenerateOutreachMutation(briefId!);
  const [pendingResultId, setPendingResultId] = useState<string>();

  function goToResult(result: Result) {
    if (result.draftMessage === null) {
      setPendingResultId(result.id);
      generateOutreach.mutate(result.id, {
        onSuccess: () => navigate(`/briefs/${briefId}/results/${result.id}`),
        onSettled: () => setPendingResultId(undefined),
      });
    } else {
      navigate(`/briefs/${briefId}/results/${result.id}`);
    }
  }

  if (isLoading || !results) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const centerLabel = brief?.productSummary
    ? brief.productSummary.slice(0, 60) + (brief.productSummary.length > 60 ? '…' : '')
    : brief?.audienceSegments[0] || 'Your brief';

  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-1 overflow-hidden">
        <div className="w-[300px] flex-shrink-0 overflow-y-auto border-r border-border bg-surface p-5">
          <div className="mb-1 text-xs font-bold uppercase tracking-wider text-accent">
            Top matches
          </div>
          <div className="flex flex-col gap-3">
            {results.map((r, i) => (
              <button
                key={r.id}
                onClick={() => goToResult(r)}
                className="rounded-lg border border-border bg-bg p-3 text-left transition-colors hover:border-accent"
              >
                <div className="mb-1 flex items-center justify-between gap-2">
                  <Badge tone="accent">
                    #{i + 1} match{r.isBestShot ? ' · ★ best shot' : ''}
                  </Badge>
                  <span className="font-display text-lg text-accent">
                    {r.confidenceTotal.toFixed(1)}
                  </span>
                </div>
                <div className="text-sm font-semibold text-text">{r.name}</div>
                <div className="mt-1 text-xs text-text3">
                  {CHANNEL_LABELS[r.channelType]} · {r.source.replace('_', ' ')}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="relative flex flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <Logo size={28} />
            <Button variant="ghost" onClick={() => navigate('/')}>
              ← Start over
            </Button>
          </div>
          <div className="flex items-center justify-center py-2 font-mono text-[11px] uppercase tracking-wide text-text3">
            {results.length} channels found
          </div>
          <div className="flex-1">
            <NetworkMap
              centerLabel={centerLabel}
              results={results}
              onNodeClick={goToResult}
              pendingResultId={pendingResultId}
            />
          </div>
          <div className="pb-4 text-center text-xs text-text3">
            Click a channel to generate its outreach kit
          </div>
        </div>
      </div>
    </div>
  );
}
