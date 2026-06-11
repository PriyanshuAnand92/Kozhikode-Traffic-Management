import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { junctions as baseJunctions, roads as baseRoads } from '../../data/trafficNetwork';
import { useThemeStore } from '../../store/theme.store';
import { useTrafficStore } from '../../store/traffic.store';
import { useIncidentStore } from '../../store/incident.store';
import { LinkPolyline } from './LinkPolyline';
import { LayerControl } from './LayerControl';
import { NodeMarker } from './NodeMarker';
import { LinkTooltip } from './LinkTooltip';
import { IncidentMarker } from './IncidentMarker';
import { Badge } from '../ui/Badge';
import { Panel } from '../ui/Panel';

const CENTER: [number, number] = [11.2588, 75.7804];
const TILE_URLS = {
  light: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  dark: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  satellite: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
} as const;

function MapEffects({ tileRef }: { tileRef: React.RefObject<L.TileLayer | null> }) {
  const theme = useThemeStore((state) => state.theme);
  const hiddenMap = useTrafficStore((state) => state.hiddenMap);
  const map = useMap();

  useEffect(() => {
    const url = TILE_URLS[theme];
    tileRef.current?.setUrl(url);
  }, [theme, tileRef]);

  useEffect(() => {
    if (hiddenMap) {
      map.getContainer().style.display = 'none';
    } else {
      map.getContainer().style.display = 'block';
    }
  }, [hiddenMap, map]);

  useEffect(() => {
    map.scrollWheelZoom.enable();
    map.dragging.enable();
    map.doubleClickZoom.enable();
    map.touchZoom.enable();
  }, [map]);

  return null;
}

type HoverMetric = { label: string; value: string };

export function KUTISMap({ hidden = false }: { hidden?: boolean }) {
  const tileRef = useRef<L.TileLayer | null>(null);
  const theme = useThemeStore((state) => state.theme);
  const layers = useTrafficStore((state) => state.layers);
  const setSelectedNodeId = useTrafficStore((state) => state.setSelectedNodeId);
  const setSelectedLinkId = useTrafficStore((state) => state.setSelectedLinkId);
  const setSelectedIncidentId = useTrafficStore((state) => state.setSelectedIncidentId);
  const selectedLinkId = useTrafficStore((state) => state.selectedLinkId);
  const linkStates = useTrafficStore((state) => state.linkStates);
  const incidents = useIncidentStore((state) => state.incidents);

  const ready = Object.keys(linkStates).length >= baseRoads.length;

  const [hover, setHover] = useState<{ title: string; body?: string; metrics?: HoverMetric[]; x: number; y: number } | null>(null);
  const mapClasses = hidden ? 'hidden' : 'block';
  const selectedLink = baseRoads.find((link) => link.id === selectedLinkId);
  const selectedLinkState = selectedLink ? linkStates[selectedLink.id] : null;

  return (
    <div className={`absolute inset-0 z-0 overflow-hidden ${mapClasses}`}>
      <MapContainer center={CENTER} zoom={14} zoomControl={false} scrollWheelZoom dragging doubleClickZoom touchZoom className="h-full w-full" preferCanvas>
        <TileLayer ref={tileRef} url={TILE_URLS[theme]} />
        <MapEffects tileRef={tileRef} />

        <LayerControl />

        {ready && layers.traffic &&
          baseRoads.map((link) => {
            const state = linkStates[link.id];
            return <LinkPolyline key={link.id} link={link} state={state} onHover={setHover} onSelect={setSelectedLinkId} />;
          })}

        {ready && layers.nodes &&
          baseJunctions.map((node) => {
            return <NodeMarker key={node.id} node={node} onSelect={setSelectedNodeId} onHover={setHover} />;
          })}

        {ready && layers.incidents &&
          incidents
            .filter((incident) => incident.status !== 'resolved')
            .map((incident) => {
              return <IncidentMarker key={incident.id} incident={incident} onSelect={setSelectedIncidentId} />;
            })}
      </MapContainer>

      {!hidden && (
        <>
          <div className="absolute top-3 left-1/2 z-20 -translate-x-1/2">
            <Badge tone="accent">Network: {Math.round(Object.values(linkStates).reduce((sum, link) => sum + link.speed, 0) / Object.values(linkStates).length)} · Fair</Badge>
          </div>
          {selectedLink && selectedLinkState ? (
            <div className="absolute bottom-4 left-4 z-20 w-[min(320px,calc(100vw-2rem))]">
              <Panel title={selectedLink.corridor} subtitle={selectedLink.name} className="bg-slate-950/95 text-slate-100 shadow-lg shadow-black/30">
                <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 text-[12px] leading-5 text-slate-300">
                  <span>Speed</span><span className="font-medium text-slate-100">{selectedLinkState.speed.toFixed(1)} km/h</span>
                  <span>Volume</span><span className="font-medium text-slate-100">{Math.round(selectedLinkState.volume)} veh/hr</span>
                  <span>Queue</span><span className="font-medium text-slate-100">{Math.round(selectedLinkState.queue)} m</span>
                  <span>LOS</span><span className="font-medium text-slate-100">{selectedLinkState.los}</span>
                  <span>Pred +15m</span><span className="font-medium text-slate-100">{Math.round(selectedLinkState.predicted_speed_15m)} km/h</span>
                  <span>AI conf.</span><span className="font-medium text-slate-100">{Math.round(selectedLinkState.ai_confidence * 100)}%</span>
                </div>
              </Panel>
            </div>
          ) : null}
          {hover ? <LinkTooltip title={hover.title} body={hover.body} x={hover.x} y={hover.y} /> : null}
        </>
      )}
    </div>
  );
}
