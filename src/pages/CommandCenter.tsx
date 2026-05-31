import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useTrafficStore } from '../store/traffic.store';
import { useIncidentStore } from '../store/incident.store';
import { Panel } from '../components/ui/Panel';
import { MetricCard } from '../components/ui/MetricCard';
import { Badge } from '../components/ui/Badge';
import { NODES } from '../data/nodes';
import { LINKS } from '../data/links';
import { NodeTicker } from '../components/ui/NodeTicker';

export function CommandCenter() {
  const layers = useTrafficStore((state) => state.layers);
  const toggleLayer = useTrafficStore((state) => state.toggleLayer);
  const nodeStates = useTrafficStore((state) => state.nodeStates);
  const incidents = useIncidentStore((state) => state.incidents);
  const selectedNodeId = useTrafficStore((state) => state.selectedNodeId);
  const selectedNode = nodeStates[selectedNodeId] ?? nodeStates[Object.keys(nodeStates)[0]];

  const signalGrid = useMemo(() => NODES.map((node) => ({ node, state: nodeStates[node.id] })), [nodeStates]);

  // Mobile bottom sheet state: 'collapsed' | 'peek' | 'expanded'
  const [sheetState, setSheetState] = useState<'collapsed' | 'peek' | 'expanded'>('peek');

  const toggleSheet = () => {
    setSheetState((prev) =>
      prev === 'collapsed' ? 'peek' : prev === 'peek' ? 'expanded' : 'collapsed'
    );
  };

  const sheetHeight = sheetState === 'collapsed' ? 'h-10' : sheetState === 'peek' ? 'h-[38%]' : 'h-[80%]';

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* ── DESKTOP layout (unchanged) ── */}
      <div className="pointer-events-none absolute inset-y-3 left-3 hidden w-[280px] overflow-hidden pr-1 lg:block">
        <div className="flex h-full flex-col gap-3 overflow-y-auto pb-20 pr-1">
          <Panel title="KUTIS" subtitle="Kozhikode Urban Traffic Intelligence System" className="pointer-events-auto">
            <div className="text-[12px] leading-5 text-[var(--muted)]">Production traffic command center. Real data geometry. No decorative effects.</div>
            <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
              <Badge tone="accent">v1.0</Badge>
              <Badge tone="success">Live</Badge>
              <Badge tone="warn">ST-GNN</Badge>
            </div>
          </Panel>

          <Panel title="Layers" subtitle="Visibility controls" className="pointer-events-auto">
            <div className="space-y-2">
              {Object.entries(layers).map(([key, enabled]) => (
                <button key={key} type="button" onClick={() => toggleLayer(key as keyof typeof layers)} className="flex w-full items-center justify-between rounded-[6px] border border-[var(--border)] px-3 py-2 text-[12px]">
                  <span>{key}</span>
                  <span className={`h-2.5 w-2.5 rounded-full ${enabled ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'}`} />
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Weather" subtitle="City conditions" className="pointer-events-auto">
            <div className="text-[12px] leading-6 text-[var(--muted)]">
              Kozhikode<br />31°C · humid · light haze<br />24h format · live operational view
            </div>
          </Panel>

          <Panel title="Network stats" subtitle="Quick view" className="pointer-events-auto">
            <div className="grid gap-2">
              <MetricCard label="Nodes" value={`${NODES.length}`} detail="Exact corridor graph" />
              <MetricCard label="Links" value={`${LINKS.length}`} detail="Directed road segments" />
              <MetricCard label="Selected node" value={selectedNodeId} detail={`Queue ${selectedNode?.q_n ?? 0}/${selectedNode?.q_s ?? 0}/${selectedNode?.q_e ?? 0}/${selectedNode?.q_w ?? 0}`} />
            </div>
          </Panel>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-y-3 right-3 hidden w-[320px] overflow-hidden pr-1 lg:block">
        <div className="flex h-full flex-col gap-3 overflow-y-auto pb-20 pr-1">
          <Panel title={`Live Incidents (${incidents.length})`} subtitle="Operational alerts" className="pointer-events-auto">
            <div className="space-y-2">
              {incidents.map((incident) => (
                <div key={incident.id} className="rounded-[6px] border border-[var(--border)] p-3">
                  <div className="flex items-center gap-2 text-[12px] font-medium">
                    <span className={`h-2 w-2 rounded-full ${incident.severity === 'critical' ? 'bg-[var(--danger)]' : incident.severity === 'high' ? 'bg-[var(--warn)]' : 'bg-[var(--accent)]'}`} />
                    {incident.title}
                  </div>
                  <div className="mt-1 text-[11px] text-[var(--muted)]">{incident.note}</div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="AI Queue" subtitle="Pending measures" className="pointer-events-auto">
            <div className="space-y-2">
              {['Increase green phase by 20 seconds', 'Divert traffic via alternate corridor', 'Activate emergency priority mode'].map((item) => (
                <div key={item} className="rounded-[6px] border border-[var(--border)] p-3 text-[12px] leading-5">
                  <div className="flex items-center justify-between gap-2">
                    <span>{item}</span>
                    <Badge tone="warn">Pending</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Signal Grid" subtitle={`${NODES.length} nodes`} className="pointer-events-auto">
            <div className="grid grid-cols-3 gap-2">
              {signalGrid.map(({ node, state }) => (
                <div key={node.id} className="rounded-[6px] border border-[var(--border)] p-2 text-[11px] leading-4">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${state.phase === 'green' ? 'bg-[var(--success)]' : state.phase === 'amber' ? 'bg-[var(--warn)]' : 'bg-[var(--danger)]'}`} />
                    <span className="truncate">{node.id}</span>
                  </div>
                  <div className="mt-1 text-[10px] text-[var(--muted)] tabular-nums">{state.phase_remaining}s</div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      {/* Desktop selected node bar */}
      <div className="pointer-events-none absolute left-1/2 bottom-4 hidden w-[min(820px,calc(100vw-620px))] -translate-x-1/2 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] p-3 text-[12px] shadow-lg shadow-black/10 lg:block">
        Selected node: {selectedNodeId} · Phase {selectedNode?.phase?.toUpperCase()} · Queue {selectedNode?.q_n}/{selectedNode?.q_s}/{selectedNode?.q_e}/{selectedNode?.q_w}
      </div>

      {/* ── MOBILE bottom sheet ── */}
      <div
        className={`pointer-events-auto absolute inset-x-0 bottom-16 flex flex-col rounded-t-2xl border-t border-[var(--border)] bg-[var(--surface)] shadow-2xl transition-all duration-300 ease-in-out lg:hidden ${sheetHeight}`}
      >
        {/* Drag handle + toggle */}
        <button
          type="button"
          onClick={toggleSheet}
          className="flex w-full flex-col items-center gap-1 px-4 pt-3 pb-2"
        >
          <div className="h-1 w-10 rounded-full bg-[var(--border)]" />
          <div className="flex w-full items-center justify-between">
            <span className="text-[12px] font-medium text-[var(--text)]">
              {selectedNodeId} · Phase <span className={`font-bold ${selectedNode?.phase === 'green' ? 'text-[var(--success)]' : selectedNode?.phase === 'amber' ? 'text-[var(--warn)]' : 'text-[var(--danger)]'}`}>{selectedNode?.phase?.toUpperCase()}</span>
            </span>
            {sheetState === 'expanded' ? <ChevronDown size={16} className="text-[var(--muted)]" /> : <ChevronUp size={16} className="text-[var(--muted)]" />}
          </div>
        </button>

        {/* Sheet content — scrollable */}
        {sheetState !== 'collapsed' && (
          <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-3">
            {/* Queue summary */}
            <div className="grid grid-cols-4 gap-2">
              {(['q_n', 'q_s', 'q_e', 'q_w'] as const).map((dir, i) => (
                <div key={dir} className="rounded-[8px] border border-[var(--border)] p-2 text-center">
                  <div className="text-[10px] text-[var(--muted)]">{['N', 'S', 'E', 'W'][i]}</div>
                  <div className="text-[14px] font-semibold tabular-nums">{selectedNode?.[dir] ?? 0}</div>
                </div>
              ))}
            </div>

            {/* Incidents */}
            <div>
              <div className="mb-2 text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">Live Incidents</div>
              <div className="space-y-2">
                {incidents.slice(0, 3).map((incident) => (
                  <div key={incident.id} className="flex items-start gap-2 rounded-[8px] border border-[var(--border)] p-3">
                    <span className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${incident.severity === 'critical' ? 'bg-[var(--danger)]' : incident.severity === 'high' ? 'bg-[var(--warn)]' : 'bg-[var(--accent)]'}`} />
                    <div>
                      <div className="text-[12px] font-medium">{incident.title}</div>
                      <div className="text-[11px] text-[var(--muted)]">{incident.note}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Signal grid — compact */}
            <div>
              <div className="mb-2 text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">Signal Grid</div>
              <div className="grid grid-cols-4 gap-2">
                {signalGrid.slice(0, 8).map(({ node, state }) => (
                  <div key={node.id} className="rounded-[6px] border border-[var(--border)] p-2 text-[10px] overflow-hidden">
                    <div className="flex items-center gap-1.5">
                      <span className={`h-2 w-2 shrink-0 rounded-full ${state.phase === 'green' ? 'bg-[var(--success)]' : state.phase === 'amber' ? 'bg-[var(--warn)]' : 'bg-[var(--danger)]'}`} />
                      <NodeTicker id={node.id} />
                    </div>
                    <div className="mt-1 tabular-nums text-[var(--muted)]">{state.phase_remaining}s</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Layer toggles */}
            <div>
              <div className="mb-2 text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">Layers</div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(layers).map(([key, enabled]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleLayer(key as keyof typeof layers)}
                    className={`rounded-full border px-3 py-1.5 text-[11px] font-medium transition-colors ${enabled ? 'border-[var(--accent)] bg-[color:color-mix(in_srgb,var(--accent)_14%,transparent)] text-[var(--accent)]' : 'border-[var(--border)] text-[var(--muted)]'}`}
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
