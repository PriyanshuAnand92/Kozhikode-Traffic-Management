import { Marker, Popup } from 'react-leaflet';
import type { JunctionNode } from '../../types/traffic';
import { createNodeIcon } from './nodeIcon';

export function NodeMarker({
  node,
  onSelect,
  onHover,
}: {
  node: JunctionNode;
  onSelect: (id: string) => void;
  onHover: (payload: { title: string; body: string; x: number; y: number } | null) => void;
}) {
  const hoverBody = `${node.zone} · ${node.type} · ${node.signalClass === 'bottleneck' ? 'Hotspot' : node.signalClass === 'transit' ? 'Transit hub' : node.signalClass === 'event-aware' ? 'Event-sensitive' : 'Signalized'} · Queue ${node.queueLength} m · Speed ${Math.round(node.speed)} km/h · Delay ${Math.round(node.delay)} s`;

  return (
    <Marker
      position={[node.lat, node.lng]}
      icon={createNodeIcon(node.signalClass)}
      eventHandlers={{
        click: () => onSelect(node.id),
        mouseover: (event) => {
          const point = event.target._map.latLngToContainerPoint(event.latlng);
          onHover({
            title: node.name,
            body: `${hoverBody} · Risk ${Math.round(node.predictedRisk * 100)}%`,
            x: point.x,
            y: point.y,
          });
        },
        mousemove: (event) => {
          const point = event.target._map.latLngToContainerPoint(event.latlng);
          onHover({
            title: node.name,
            body: `${hoverBody} · Risk ${Math.round(node.predictedRisk * 100)}%`,
            x: point.x,
            y: point.y,
          });
        },
        mouseout: () => onHover(null),
      }}
    >
      <Popup>
        <div className="text-[13px] leading-5 text-[var(--text)]">
          <div className="font-semibold">📍 {node.name}</div>
          <div className="text-[var(--muted)]">{node.zone}</div>
          <div className="text-[var(--muted)]">{hoverBody}</div>
        </div>
      </Popup>
    </Marker>
  );
}
