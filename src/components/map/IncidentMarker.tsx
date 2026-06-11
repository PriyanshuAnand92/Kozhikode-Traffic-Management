import { CircleMarker, Popup, Tooltip } from 'react-leaflet';
import type { Incident } from '../../types/traffic';
import { NODES } from '../../data/nodes';
import { AlertTriangle, AlertCircle, Shield, Waves } from 'lucide-react';

interface IncidentMarkerProps {
  incident: Incident;
  onSelect: (incidentId: string) => void;
}

export function IncidentMarker({ incident, onSelect }: IncidentMarkerProps) {
  const node = NODES.find((n) => n.id === incident.node_id);
  if (!node) return null;

  const iconByType: Record<Incident['type'], JSX.Element> = {
    accident: <AlertTriangle size={16} />,
    breakdown: <AlertCircle size={16} />,
    roadblock: <AlertTriangle size={16} />,
    vip: <Shield size={16} />,
    flooding: <Waves size={16} />,
  };

  const colorBySeverity: Record<Incident['severity'], string> = {
    critical: '#FF3B30',
    high: '#FF9500',
    medium: '#FFCC00',
    low: '#34C759',
  };

  const colorByStatus: Record<Incident['status'], number> = {
    active: 1,
    responding: 0.7,
    resolved: 0.3,
  };

  const color = colorBySeverity[incident.severity];
  const opacity = colorByStatus[incident.status];

  return (
    <CircleMarker
      center={[node.lat, node.lng]}
      radius={12}
      fillColor={color}
      color={color}
      weight={2}
      opacity={opacity}
      fillOpacity={0.6 * opacity}
      eventHandlers={{
        click: () => onSelect(incident.id),
      }}
    >
      <Tooltip
        direction="top"
        offset={[0, -10]}
        opacity={0.9}
      >
        <div className="text-sm font-semibold">{incident.title}</div>
        <div className="text-xs text-gray-600">{incident.note}</div>
      </Tooltip>

      <Popup maxWidth={280}>
        <div className="space-y-2 p-2">
          <div className="flex items-center gap-2">
            <span className={`inline-flex rounded px-2 py-1 text-xs font-semibold text-white ${
              incident.severity === 'critical' ? 'bg-red-600' :
              incident.severity === 'high' ? 'bg-orange-600' :
              incident.severity === 'medium' ? 'bg-yellow-600' :
              'bg-green-600'
            }`}>
              {incident.severity.toUpperCase()}
            </span>
            <span className={`inline-flex rounded px-2 py-1 text-xs font-semibold ${
              incident.status === 'active' ? 'bg-red-100 text-red-800' :
              incident.status === 'responding' ? 'bg-blue-100 text-blue-800' :
              'bg-green-100 text-green-800'
            }`}>
              {incident.status}
            </span>
          </div>
          <div>
            <div className="font-semibold text-sm">{incident.title}</div>
            <div className="text-xs text-gray-600 mt-1">{incident.note}</div>
          </div>
          <div className="text-xs text-gray-500">
            Type: {incident.type} • Junction: {node.name}
          </div>
        </div>
      </Popup>
    </CircleMarker>
  );
}
