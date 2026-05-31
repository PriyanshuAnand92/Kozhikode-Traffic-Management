import { useTrafficStore } from '../../store/traffic.store';
import { Badge } from '../ui/Badge';

const items = [
  { key: 'traffic', label: 'Traffic' },
  { key: 'nodes', label: 'Nodes' },
  { key: 'heatmap', label: 'Heatmap' },
  { key: 'aiOverlays', label: 'AI Overlays' },
  { key: 'incidents', label: 'Incidents' },
] as const;

export function LayerControl() {
  const layers = useTrafficStore((state) => state.layers);
  const toggleLayer = useTrafficStore((state) => state.toggleLayer);

  return (
    <div className="absolute left-3 top-3 z-30 w-56 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] p-3 text-[12px]">
      <div className="flex items-center justify-between">
        <div className="text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">Layers</div>
        <Badge tone="accent">Live</Badge>
      </div>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <button key={item.key} type="button" onClick={() => toggleLayer(item.key)} className="flex w-full items-center justify-between rounded-[6px] border border-[var(--border)] px-3 py-2 text-left">
            <span>{item.label}</span>
            <span className={`h-2.5 w-2.5 rounded-full ${layers[item.key] ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'}`} />
          </button>
        ))}
      </div>
    </div>
  );
}
