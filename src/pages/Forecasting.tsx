import { useEffect } from 'react';
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Panel } from '../components/ui/Panel';
import { MetricCard } from '../components/ui/MetricCard';
import { useForecastStore } from '../store/forecast.store';
import { useTrafficStore } from '../store/traffic.store';
import { getForecastSeries } from '../data/mock';

export function Forecasting() {
  const points = useForecastStore((state) => state.points);
  const recompute = useForecastStore((state) => state.recompute);
  const horizon = useForecastStore((state) => state.horizon);
  const setHorizon = useForecastStore((state) => state.setHorizon);
  const eventEnabled = useTrafficStore((state) => state.eventEnabled);
  const forecastCrowd = useTrafficStore((state) => state.forecastCrowd);
  const setForecastCrowd = useTrafficStore((state) => state.setForecastCrowd);
  const setEventEnabled = useTrafficStore((state) => state.setEventEnabled);

  useEffect(() => {
    recompute(eventEnabled, forecastCrowd);
  }, [eventEnabled, forecastCrowd, recompute]);

  const corridorRows = ['Mavoor Road', 'Mini Bypass Road', 'Bank Road', 'SM Street Road', 'M.M Ali Road', 'Palayam Road'];
  const forecastForBand = getForecastSeries(eventEnabled, forecastCrowd);

  const panelContent = (
    <>
      {/* Horizon pills */}
      <div className="flex flex-wrap gap-2 text-[12px]">
        {([5, 10, 15, 20, 25] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setHorizon(value)}
            className={`min-w-0 flex-1 rounded-[6px] border px-3 py-2 ${horizon === value ? 'border-[var(--accent)] bg-[color:color-mix(in_srgb,var(--accent)_12%,transparent)]' : 'border-[var(--border)]'}`}
          >
            +{value}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="mt-4 space-y-3">
        <label className="flex items-center justify-between text-[12px]">
          <span>Simulate event at Stadium Junction</span>
          <input type="checkbox" checked={eventEnabled} onChange={(e) => setEventEnabled(e.target.checked)} />
        </label>
        <label className="block text-[12px]">
          Crowd {forecastCrowd.toLocaleString('en-IN')}
          <input type="range" min={5000} max={50000} step={1000} value={forecastCrowd} onChange={(e) => setForecastCrowd(Number(e.target.value))} className="mt-2 w-full" />
        </label>
      </div>

      {/* Corridor heatmap */}
      <div className="mt-4 overflow-x-auto">
        <div className="min-w-[320px] grid gap-2">
          {corridorRows.map((row) => (
            <div key={row} className="flex items-center gap-2 text-[11px]">
              <div className="w-[100px] shrink-0 truncate text-[var(--muted)]">{row}</div>
              {[0, 1, 2, 3, 4].map((step) => (
                <div key={step} className="h-7 w-7 rounded-[6px] border border-[var(--border)]" style={{ background: `color-mix(in srgb, var(--accent) ${(forecastForBand[step].speed / 60) * 100}%, transparent)` }} />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={points.map((p) => ({ label: `+${p.horizon}m`, predicted: p.speed, upper: p.ci_upper, lower: p.ci_lower }))}>
              <CartesianGrid stroke="var(--border)" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Area type="monotone" dataKey="upper" fill="color-mix(in srgb, var(--accent) 18%, transparent)" stroke="transparent" />
              <Area type="monotone" dataKey="lower" fill="color-mix(in srgb, var(--accent) 6%, transparent)" stroke="transparent" />
              <Line type="monotone" dataKey="predicted" stroke="var(--accent)" strokeWidth={2} dot={{ r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <MetricCard label="Avg predicted speed" value={`${Math.round(points.reduce((s, p) => s + p.speed, 0) / Math.max(points.length, 1))} km/h`} detail={`Horizon +${horizon}m`} tone="default" />
            <MetricCard label="Forecast crowd" value={forecastCrowd.toLocaleString('en-IN')} detail={eventEnabled ? 'Event simulated' : 'Baseline'} tone={eventEnabled ? 'warn' : 'default'} />
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-[12px] text-[var(--muted)]">Forecast band</div>
            <div className="mt-2">
              {points.map((p) => (
                <div key={p.horizon} className="flex items-center justify-between text-sm">
                  <div className="text-[13px]">+{p.horizon}m</div>
                  <div className="text-[13px] font-medium">{p.speed} km/h</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* ── DESKTOP: right-side panel over map ── */}
      <div className="absolute inset-0 hidden lg:flex">
        <div className="w-[55%] min-w-0" />
        <div className="pointer-events-none w-[45%] p-3">
          <Panel title="Predictive Traffic Forecasting" subtitle="Future simulation" className="pointer-events-auto h-[calc(100vh-96px)] overflow-y-auto">
            {panelContent}
          </Panel>
        </div>
      </div>

      {/* ── MOBILE: full-screen scrollable panel ── */}
      <div className="pointer-events-auto absolute inset-0 flex flex-col bg-[var(--surface)] lg:hidden">
        <div className="border-b border-[var(--border)] px-4 py-3">
          <div className="text-[14px] font-semibold">Predictive Forecasting</div>
          <div className="text-[12px] text-[var(--muted)]">Future simulation</div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-3 pb-24">
          {panelContent}
        </div>
      </div>
    </>
  );
}
