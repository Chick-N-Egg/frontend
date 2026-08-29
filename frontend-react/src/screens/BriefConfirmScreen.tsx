import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Label, Select, Textarea, Input } from '../components/ui/Field';
import { Tag } from '../components/ui/Tag';
import { Spinner } from '../components/ui/Spinner';
import { useBrief, useDiscoverMutation, useUpdateBrief } from '../api/hooks';
import type { Stage } from '../api/types';

const STAGE_OPTIONS: { value: Stage; label: string }[] = [
  { value: 'idea', label: '💡 Idea stage' },
  { value: 'mvp', label: '🚀 MVP' },
  { value: 'early-traction', label: '📈 Early traction' },
];

export function BriefConfirmScreen() {
  const { briefId } = useParams<{ briefId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const clarifyingQuestion = (location.state as { clarifyingQuestion?: string | null } | null)
    ?.clarifyingQuestion;

  const { data: brief, isLoading } = useBrief(briefId);
  const updateBrief = useUpdateBrief(briefId!);
  const discover = useDiscoverMutation(briefId!);

  const [productSummary, setProductSummary] = useState('');
  const [audienceSegments, setAudienceSegments] = useState<string[]>([]);
  const [stage, setStage] = useState<Stage>('idea');
  const [newSegment, setNewSegment] = useState('');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (brief && !hydrated) {
      setProductSummary(brief.productSummary);
      setAudienceSegments(brief.audienceSegments);
      setStage(brief.stage);
      setHydrated(true);
    }
  }, [brief, hydrated]);

  function addSegment() {
    const value = newSegment.trim();
    if (value && !audienceSegments.includes(value)) {
      setAudienceSegments((prev) => [...prev, value]);
    }
    setNewSegment('');
  }

  function removeSegment(segment: string) {
    setAudienceSegments((prev) => prev.filter((s) => s !== segment));
  }

  function handleConfirm() {
    const isDirty =
      brief &&
      (productSummary !== brief.productSummary ||
        stage !== brief.stage ||
        JSON.stringify(audienceSegments) !== JSON.stringify(brief.audienceSegments));

    const runDiscover = () => discover.mutate(undefined, { onSuccess: () => navigate(`/briefs/${briefId}/map`) });

    if (isDirty) {
      updateBrief.mutate({ productSummary, audienceSegments, stage }, { onSuccess: runDiscover });
    } else {
      runDiscover();
    }
  }

  if (isLoading || !hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const isBusy = updateBrief.isPending || discover.isPending;

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16">
      <Card className="w-full max-w-lg">
        <div className="mb-1 text-xs font-bold uppercase tracking-wider text-accent">
          Confirma tu brief
        </div>
        <p className="mb-5 text-sm text-text3">
          Esto es tu hipótesis de partida, no un hecho confirmado — ajústala si algo no encaja.
        </p>

        {clarifyingQuestion && (
          <div className="mb-5 rounded-lg border-l-[3px] border-accent bg-surface2 px-4 py-3">
            <div className="mb-1 font-mono text-[10px] font-bold uppercase tracking-wide text-accent">
              La IA necesita una aclaración
            </div>
            <p className="text-sm text-text2">{clarifyingQuestion}</p>
          </div>
        )}

        <Label>Resumen del producto</Label>
        <Textarea value={productSummary} onChange={(e) => setProductSummary(e.target.value)} />

        <div className="mt-4">
          <Label>Segmentos de audiencia</Label>
          <div className="mb-2 flex flex-wrap gap-2">
            {audienceSegments.map((segment) => (
              <Tag key={segment} onRemove={() => removeSegment(segment)}>
                {segment}
              </Tag>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newSegment}
              onChange={(e) => setNewSegment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSegment();
                }
              }}
              placeholder="+ Add segment"
            />
            <Button variant="ghost" type="button" onClick={addSegment}>
              Add
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <Label>Etapa</Label>
          <Select value={stage} onChange={(e) => setStage(e.target.value as Stage)}>
            {STAGE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>

        <Button className="mt-6 w-full" isLoading={isBusy} onClick={handleConfirm}>
          {isBusy ? 'Buscando canales y evaluando encaje...' : 'Confirmar y descubrir →'}
        </Button>
      </Card>
    </div>
  );
}
