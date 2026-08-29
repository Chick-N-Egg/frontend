import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Label, Select, Textarea, Input } from '../components/ui/Field';
import { Badge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';
import { ScoreGrid } from '../components/ScoreGrid';
import { CHANNEL_LABELS } from '../components/map/channelColors';
import {
  useAttempts,
  useGenerateOutreachMutation,
  useLogAttemptMutation,
  useResult,
} from '../api/hooks';
import type { AttemptOutcome } from '../api/types';
import { formatRelativeDate } from '../lib/format';

const OUTCOME_OPTIONS: { value: AttemptOutcome; label: string }[] = [
  { value: 'no_response', label: 'No response' },
  { value: 'declined', label: 'Declined' },
  { value: 'interested', label: 'Interested' },
  { value: 'signed_up', label: 'Signed up' },
  { value: 'paying', label: 'Paying customer' },
];

export function OutreachScreen() {
  const { briefId, resultId } = useParams<{ briefId: string; resultId: string }>();
  const navigate = useNavigate();
  const { data: result, isLoading } = useResult(briefId, resultId);
  const generateOutreach = useGenerateOutreachMutation(briefId!);
  const logAttempt = useLogAttemptMutation(resultId!);
  const { data: attempts } = useAttempts(resultId);

  const [messageSent, setMessageSent] = useState('');
  const [outcome, setOutcome] = useState<AttemptOutcome>('no_response');
  const [revenue, setRevenue] = useState('');
  const [notes, setNotes] = useState('');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (result?.draftMessage && !hydrated) {
      setMessageSent(result.draftMessage);
      setHydrated(true);
    }
  }, [result, hydrated]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-text2">No se encontró este resultado — vuelve al mapa.</p>
        <Button onClick={() => navigate('/')}>Ir al inicio</Button>
      </div>
    );
  }

  function handleSave() {
    logAttempt.mutate(
      {
        messageSent,
        outcome,
        revenue: outcome === 'paying' && revenue ? Number(revenue) : undefined,
        notes: notes || undefined,
      },
      { onSuccess: () => navigate('/dashboard') },
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="font-display text-2xl text-text">{result.name}</div>
          <Badge tone="accent">{CHANNEL_LABELS[result.channelType]}</Badge>
        </div>
        <Button variant="ghost" onClick={() => navigate(`/briefs/${briefId}/map`)}>
          ← Back to map
        </Button>
      </div>

      <Card className="mb-4">
        <div className="mb-3 text-xs font-bold uppercase tracking-wider text-accent">Why it fits</div>
        <p className="text-sm text-text2">{result.whyItFits}</p>
      </Card>

      <Card className="mb-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-accent">Confidence</div>
          <div className="font-display text-2xl text-accent">{result.confidenceTotal.toFixed(1)}/5</div>
        </div>
        <ScoreGrid
          reachScore={result.reachScore}
          receptivenessScore={result.receptivenessScore}
          warmthScore={result.warmthScore}
        />
      </Card>

      {result.draftMessage === null ? (
        <Card className="mb-4">
          <Button isLoading={generateOutreach.isPending} onClick={() => generateOutreach.mutate(result.id)}>
            Generar outreach
          </Button>
        </Card>
      ) : (
        <>
          <Card className="mb-4">
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-accent">
              Suggested approach
            </div>
            <p className="text-sm text-text2">{result.suggestedApproach}</p>
          </Card>

          <Card className="mb-4">
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-accent">
              Draft message
            </div>
            <Textarea
              value={messageSent}
              onChange={(e) => setMessageSent(e.target.value)}
              className="min-h-[160px]"
            />
          </Card>

          <Card className="mb-4">
            <div className="mb-4 text-xs font-bold uppercase tracking-wider text-accent">
              Registrar intento
            </div>

            <Label>Resultado</Label>
            <Select value={outcome} onChange={(e) => setOutcome(e.target.value as AttemptOutcome)}>
              {OUTCOME_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>

            {outcome === 'paying' && (
              <div className="mt-4">
                <Label>Revenue</Label>
                <Input
                  type="number"
                  min={0}
                  value={revenue}
                  onChange={(e) => setRevenue(e.target.value)}
                  placeholder="0"
                />
              </div>
            )}

            <div className="mt-4">
              <Label>Notas (opcional)</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="min-h-[70px]" />
            </div>

            <Button className="mt-5 w-full" isLoading={logAttempt.isPending} onClick={handleSave}>
              Guardar y ver dashboard →
            </Button>
          </Card>

          {attempts && attempts.length > 0 && (
            <Card>
              <div className="mb-3 text-xs font-bold uppercase tracking-wider text-accent">
                Intentos previos
              </div>
              <div className="flex flex-col gap-2">
                {attempts.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center justify-between rounded-lg bg-surface2 px-3 py-2 text-sm"
                  >
                    <Badge>{a.outcome.replace('_', ' ')}</Badge>
                    <span className="text-text3">{formatRelativeDate(a.loggedAt)}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
