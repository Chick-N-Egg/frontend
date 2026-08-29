import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';
import { Logo } from '../components/ui/Logo';
import { StatsStrip } from '../components/StatsStrip';
import { GrowthSparkline } from '../components/GrowthSparkline';
import { FunnelChart } from '../components/FunnelChart';
import { ChannelPerformanceTable } from '../components/ChannelPerformanceTable';
import { DarkInsightCard } from '../components/DarkInsightCard';
import { CHANNEL_LABELS } from '../components/map/channelColors';
import { useDashboard } from '../api/hooks';
import { formatCurrency, formatPercent, formatRelativeDate } from '../lib/format';

const REFINEMENT_MIN_ATTEMPTS = 3;

export function DashboardScreen() {
  const navigate = useNavigate();
  const { data: dashboard, isLoading } = useDashboard();

  if (isLoading || !dashboard) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <Logo size={28} />
        <Button variant="ghost" onClick={() => navigate('/')}>
          + New brief
        </Button>
      </div>

      <StatsStrip
        stats={[
          { label: 'Total attempts', value: String(dashboard.totalAttempts) },
          { label: 'Response rate', value: formatPercent(dashboard.responseRate) },
          { label: 'Sign-ups', value: String(dashboard.signUps) },
          { label: 'Revenue', value: formatCurrency(dashboard.revenue) },
        ]}
      />

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <div className="mb-3 text-xs font-bold uppercase tracking-wider text-accent">
            Growth over time
          </div>
          <GrowthSparkline points={dashboard.growthOverTime} />
        </Card>

        <Card>
          <div className="mb-3 text-xs font-bold uppercase tracking-wider text-accent">Funnel</div>
          <FunnelChart stages={dashboard.funnel} />
        </Card>
      </div>

      <Card className="mt-4">
        <div className="mb-3 text-xs font-bold uppercase tracking-wider text-accent">
          Performance by channel
        </div>
        <ChannelPerformanceTable rows={dashboard.performanceByChannel} />
      </Card>

      <Card className="mt-4">
        <div className="mb-3 text-xs font-bold uppercase tracking-wider text-accent">
          Recent attempts
        </div>
        {dashboard.recentAttempts.length === 0 ? (
          <p className="text-sm text-text3">Aún no hay intentos registrados.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {dashboard.recentAttempts.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between rounded-lg bg-surface2 px-3 py-2 text-sm"
              >
                <span className="font-semibold text-text">{CHANNEL_LABELS[a.channelType]}</span>
                <Badge>{a.outcome.replace('_', ' ')}</Badge>
                <span className="text-text3">{formatRelativeDate(a.loggedAt)}</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="mt-4">
        <DarkInsightCard>
          {dashboard.refinementInsight ??
            `Registra ${REFINEMENT_MIN_ATTEMPTS}+ intentos de outreach para desbloquear insights de refinamiento — llevas ${dashboard.totalAttempts}/${REFINEMENT_MIN_ATTEMPTS}.`}
        </DarkInsightCard>
      </div>
    </div>
  );
}
