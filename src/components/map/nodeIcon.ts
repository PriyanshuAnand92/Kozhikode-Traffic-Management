import L from 'leaflet';
import type { JunctionNode } from '../../types/traffic';

const colorBySignalClass: Record<JunctionNode['signalClass'], string> = {
  signalized: '#2563eb',
  connector: '#0f766e',
  bottleneck: '#dc2626',
  transit: '#7c3aed',
  'event-aware': '#d97706',
};

export const createNodeIcon = (signalClass: JunctionNode['signalClass']) => {
  const color = colorBySignalClass[signalClass];

  return L.divIcon({
    className: '',
    iconSize: [36, 48],
    iconAnchor: [18, 44],
    popupAnchor: [0, -40],
    html: `
      <div style="position:relative;width:36px;height:48px;transform:translateY(-4px);">
        <div style="position:absolute;left:50%;top:1px;width:30px;height:30px;transform:translateX(-50%);border-radius:9999px;background:${color};border:3px solid rgba(255,255,255,0.98);box-shadow:0 14px 24px rgba(15,23,42,0.28);"></div>
        <div style="position:absolute;left:50%;top:10px;width:11px;height:11px;transform:translateX(-50%);border-radius:9999px;background:rgba(255,255,255,0.98);"></div>
        <div style="position:absolute;left:50%;bottom:0;width:0;height:0;transform:translateX(-50%);border-left:10px solid transparent;border-right:10px solid transparent;border-top:14px solid ${color};filter:drop-shadow(0 5px 8px rgba(15,23,42,0.16));"></div>
      </div>
    `,
  });
};