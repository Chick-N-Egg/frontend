import type { FunnelStage } from '../api/types';

const STAGE_LABELS: Record<FunnelStage['stage'], string> = {
  attempts: 'Attempts',
  interested: 'Interested',
  signed_up: 'Signed up',
  paying: 'Paying',
};

export function FunnelChart({ stages }: { stages: FunnelStage[] }) {
  const max = Math.max(1, ...stages.map((s) => s.count));

  return (
    <div className="flex flex-col gap-3">
      {stages.map((stage, i) => {
        const prev = stages[i - 1];
        const dropOff = prev && prev.count > 0 ? 1 - stage.count / prev.count : null;
        return (
          <div key={stage.stage}>
            <div className="mb-1 flex items-center justify-between text-xs text-text2">
              <span className="font-semibold">{STAGE_LABELS[stage.stage]}</span>
              <span>
                {stage.count}
                {dropOff !== null && (
                  <span className="ml-2 text-text3">-{Math.round(dropOff * 100)}%</span>
                )}
              </span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-surface2">
              <div
                className="h-full rounded-full bg-accent"
                style={{ width: `${(stage.count / max) * 100}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
