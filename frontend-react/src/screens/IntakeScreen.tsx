import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Label, Textarea } from '../components/ui/Field';
import { Logo } from '../components/ui/Logo';
import { useCreateBrief } from '../api/hooks';

const MIN_LENGTH = 10;
const LOADING_MESSAGES = ['Analizando tu idea...', 'Extrayendo audiencia y etapa...'];

export function IntakeScreen() {
  const navigate = useNavigate();
  const [rawInput, setRawInput] = useState('');
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
  const createBrief = useCreateBrief();
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(timerRef.current), []);

  function handleSubmit() {
    setLoadingMessage(LOADING_MESSAGES[0]);
    timerRef.current = setTimeout(() => setLoadingMessage(LOADING_MESSAGES[1]), 1400);
    createBrief.mutate(rawInput, {
      onSuccess: (brief) => {
        clearTimeout(timerRef.current);
        navigate(`/briefs/${brief.id}/confirm`, {
          state: { clarifyingQuestion: brief.clarifyingQuestion },
        });
      },
      onSettled: () => clearTimeout(timerRef.current),
    });
  }

  const tooShort = rawInput.trim().length < MIN_LENGTH;

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="flex w-full max-w-4xl flex-col items-center gap-10 md:flex-row md:items-start">
        <div className="max-w-sm flex-shrink-0 text-center md:text-left">
          <Logo />
          <div className="mt-4 font-display italic text-accent">Your GTM Co-Founder for Founders</div>
          <div className="mt-2 font-display text-4xl leading-tight text-text">
            From idea
            <br />
            to <em className="text-accent">first user.</em>
          </div>
        </div>

        <Card className="w-full max-w-md">
          <Label>What are you building, and who&apos;s it for?</Label>
          <Textarea
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            placeholder="e.g. AI tool that automatically writes session notes for therapists after each client call, saving 2+ hours per day. I think independent therapists running private practices need this most, but I'm not sure yet."
            className="min-h-[160px]"
          />
          <p className="mt-1 text-xs text-text3">
            {rawInput.trim().length}/{MIN_LENGTH} caracteres mínimos
          </p>

          <Button
            className="mt-4 w-full"
            disabled={tooShort}
            isLoading={createBrief.isPending}
            onClick={handleSubmit}
          >
            {createBrief.isPending ? loadingMessage : 'Map My Network →'}
          </Button>

          {createBrief.isError && (
            <p className="mt-3 text-sm text-warning">
              Error conectando con la API. Inténtalo de nuevo.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
