import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Panel } from '../components/ui/Panel';
import { MetricCard } from '../components/ui/MetricCard';
import { NODES } from '../data/nodes';
import { LINKS } from '../data/links';
import { useTrafficStore } from '../store/traffic.store';

const cellColors = ['#22c55e', '#84cc16', '#f59e0b', '#f97316', '#ef4444', '#7f1d1d'];

export function Analytics() {
  const linkStates = useTrafficStore((state) => state.linkStates);
  const totalVehicles = Object.values(linkStates).reduce((sum, link) => sum + link.volume, 0);
  const avgSpeed = Object.values(linkStates).reduce((sum, link) => sum + link.speed, 0) / Math.max(1, Object.values(linkStates).length);
  const congestionScore = Object.values(linkStates).reduce((sum, link) => sum + link.congestion_index, 0) / Math.max(1, Object.values(linkStates).length);

  const hourly = Array.from({ length: 24 }, (_, hour) => {
    const peak = (hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 20);
    const evening = hour >= 17 ? 1.2 : 1;
    return { hour: `${hour.toString().padStart(2, '0')}`, vehicles: Math.round(150 + (peak ? 220 : 90) * evening), speed: Math.round(32 - (peak ? 10 : 2)) };
  });

  const ranking = NODES.map((node) => ({ name: node.id, score: Math.round((linkStates[LINKS.find((link) => link.from === node.id || link.to === node.id)?.id ?? LINKS[0].id]?.congestion_index ?? 0) * 10) })).sort((a, b) => b.score - a.score);

  const heatRows = ['Mavoor Road', 'Mini Bypass Road', 'Bank Road', 'SM Street Road', 'Stadium Link Road', 'M.M Ali Road', 'Palayam Road', 'Jail Road'];

  return (
    <div className="pointer-events-auto absolute inset-0 h-full min-h-full overflow-y-auto bg-[var(--bg)] p-3">
      <div className="flex gap-3 overflow-x-auto pb-2">
        <div className="min-w-[12rem]"><MetricCard label="Total vehicles" value={totalVehicles.toLocaleString('en-IN')} /></div>
        <div className="min-w-[12rem]"><MetricCard label="Avg speed" value={`${Math.round(avgSpeed)} km/h`} /></div>
        <div className="min-w-[12rem]"><MetricCard label="Incidents resolved" value="18" /></div>
        <div className="min-w-[12rem]"><MetricCard label="AI accept %" value="87%" /></div>
        <div className="min-w-[12rem]"><MetricCard label="Congestion score" value={`${Math.round(congestionScore * 10)}/10`} /></div>
        <div className="min-w-[12rem]"><MetricCard label="Signal efficiency" value="81%" /></div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <Panel title="Volume trend" subtitle="24-hour movement">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourly}>
                <CartesianGrid stroke="var(--border)" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="vehicles" stroke="var(--accent)" fill="color-mix(in srgb, var(--accent) 20%, transparent)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Junction ranking" subtitle="By congestion">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ranking} layout="vertical">
                <CartesianGrid stroke="var(--border)" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={100} />
                <Tooltip />
                <Bar dataKey="score" fill="var(--danger)">
                  {ranking.map((entry, index) => <Cell key={entry.name} fill={cellColors[index % cellColors.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <div className="mt-3 overflow-hidden rounded-[10px] border border-[var(--border)] bg-[var(--surface)]">
        <div className="overflow-x-auto">
        <div className="grid grid-cols-[90px_repeat(24,minmax(0,1fr))] border-b border-[var(--border)] text-[11px] text-[var(--muted)]">
          <div className="p-2">Corridor</div>
          {Array.from({ length: 24 }, (_, hour) => <div key={hour} className="p-2 text-center">{hour}</div>)}
        </div>
        {heatRows.map((row, rowIndex) => (
          <div key={row} className="grid grid-cols-[90px_repeat(24,minmax(0,1fr))] border-b border-[var(--border)] last:border-b-0 text-[11px]">
            <div className="p-2 text-[var(--muted)]">{row}</div>
            {Array.from({ length: 24 }, (_, hour) => {
              const value = (rowIndex * 3 + hour) % 6;
              return <div key={hour} className="h-7 border-l border-[var(--border)]" style={{ background: cellColors[value] }} />;
            })}
          </div>
        ))}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <Panel title="LOS distribution" subtitle="Service levels">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={[{ name: 'A', value: 12 }, { name: 'B', value: 16 }, { name: 'C', value: 20 }, { name: 'D', value: 18 }, { name: 'E', value: 19 }, { name: 'F', value: 15 }]} dataKey="value" innerRadius={70} outerRadius={105}>
                  {cellColors.map((color) => <Cell key={color} fill={color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Model accuracy" subtitle="Prediction quality by horizon">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[5, 10, 15, 20, 25].map((horizon, index) => ({ horizon: `+${horizon}m`, r2: [0.94, 0.92, 0.89, 0.85, 0.82][index] }))}>
                <CartesianGrid stroke="var(--border)" />
                <XAxis dataKey="horizon" />
                <YAxis domain={[0.8, 1]} />
                <Tooltip />
                <Line type="monotone" dataKey="r2" stroke="var(--accent)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>
    </div>
  );
}
