import { motion } from 'framer-motion';
import { useTrafficStore } from '../../store/traffic.store';
import { Badge } from '../ui/Badge';

export function NodeBottomSheet() {
  const selectedNodeId = useTrafficStore((state) => state.selectedNodeId);
  const node = useTrafficStore((state) => state.nodeStates[selectedNodeId]);

  if (!node) return null;

  return (
    <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.22 }} className="absolute bottom-3 left-1/2 z-40 h-[220px] w-[min(820px,calc(100vw-24px))] -translate-x-1/2 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">Node detail</div>
          <div className="mt-1 text-[15px] font-medium">{selectedNodeId}</div>
        </div>
        <Badge tone="accent">{node.phase.toUpperCase()}</Badge>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-3 text-[12px]">
        <div className="rounded-[6px] border border-[var(--border)] p-3">N {node.q_n}</div>
        <div className="rounded-[6px] border border-[var(--border)] p-3">S {node.q_s}</div>
        <div className="rounded-[6px] border border-[var(--border)] p-3">E {node.q_e}</div>
        <div className="rounded-[6px] border border-[var(--border)] p-3">W {node.q_w}</div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3 text-[12px] text-[var(--muted)]">
        <div>Cycle {node.cycle}s</div>
        <div>Throughput {node.throughput}</div>
        <div>Countdown {node.phase_remaining}s</div>
      </div>
    </motion.div>
  );
}
