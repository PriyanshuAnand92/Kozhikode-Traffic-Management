import { useMemo } from 'react';
import { Polyline } from 'react-leaflet';
import { buildLinkPath } from '../../lib/traffic';
import { junctions } from '../../data/trafficNetwork';
import type { LinkState, RoadLink } from '../../types/traffic';

type HoverMetric = { label: string; value: string };
type HoverPayload = { title: string; body?: string; metrics?: HoverMetric[]; x: number; y: number };

const nodeMap = Object.fromEntries(junctions.map((node) => [node.id, node]));

export function LinkPolyline({ link, state, onHover, onSelect }: { link: RoadLink; state: LinkState; onHover: (payload: HoverPayload | null) => void; onSelect: (id: string) => void }) {
  const path = useMemo(() => buildLinkPath(link, nodeMap), [link]);
  const hoverMetrics = [
    { label: 'Speed', value: `${state.speed.toFixed(1)} km/h` },
    { label: 'Volume', value: `${Math.round(state.volume)} veh/hr` },
    { label: 'Queue', value: `${Math.round(state.queue)} m` },
    { label: 'LOS', value: state.los },
    { label: 'Pred +15m', value: `${Math.round(state.predicted_speed_15m)} km/h` },
    { label: 'AI conf.', value: `${Math.round(state.ai_confidence * 100)}%` },
  ];

  return (
    <Polyline
      positions={path}
      pathOptions={{
        color: '#f97316',
        weight: 7,
        opacity: 0.92,
        lineCap: 'round',
        lineJoin: 'round',
      }}
      eventHandlers={{
        click: () => onSelect(link.id),
        mouseover: (event) => {
          const point = event.target._map.latLngToContainerPoint(event.latlng);
          onHover({ title: link.corridor, body: link.name, x: point.x, y: point.y, metrics: hoverMetrics });
        },
        mousemove: (event) => {
          const point = event.target._map.latLngToContainerPoint(event.latlng);
          onHover({ title: link.corridor, body: link.name, x: point.x, y: point.y, metrics: hoverMetrics });
        },
        mouseout: () => onHover(null),
      }}
    />
  );
}
