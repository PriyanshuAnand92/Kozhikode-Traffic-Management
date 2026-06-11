import { useEffect, useMemo, useState } from 'react';
import { X, Plus } from 'lucide-react';
import { EmptyState } from '../components/ui/EmptyState';
import { Panel } from '../components/ui/Panel';
import { MetricCard } from '../components/ui/MetricCard';
import { SkeletonCard } from '../components/ui/Skeleton';
import { AddIncidentModal } from '../components/ui/AddIncidentModal';
import { mockApi } from '../data/mockApi';
import { selectIncident } from '../lib/trafficSelectors';
import { useIncidentStore } from '../store/incident.store';
import { useTrafficStore } from '../store/traffic.store';

export function Incidents() {
  const incidents = useIncidentStore((state) => state.incidents);
  const setIncidents = useIncidentStore((state) => state.setIncidents);
  const addIncident = useIncidentStore((state) => state.addIncident);
  const setSelectedIncidentId = useTrafficStore((state) => state.setSelectedIncidentId);
  const selectedIncidentId = useTrafficStore((state) => state.selectedIncidentId);
  const [loading, setLoading] = useState(true);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    mockApi.getIncidents().then((items) => {
      if (mounted) {
        setIncidents(items);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, [setIncidents]);

  const selectedIncident = useMemo(() => selectIncident(incidents, selectedIncidentId), [incidents, selectedIncidentId]);

  const handleSelect = (id: string) => {
    setSelectedIncidentId(id);
    setMobileDetailOpen(true);
  };

  const severityColor = (sev?: string) =>
    sev === 'critical' ? 'bg-[var(--danger)]' : sev === 'high' ? 'bg-[var(--warn)]' : 'bg-[var(--accent)]';

  const handleAddIncident = (newIncident: any) => {
    addIncident(newIncident);
    setSelectedIncidentId(newIncident.id);
  };

  const handleResolveIncident = (incidentId: string) => {
    const resolveIncident = useIncidentStore.getState().resolveIncident;
    resolveIncident(incidentId);
  };

  const handleUpdateStatus = (incidentId: string, status: 'active' | 'responding' | 'resolved') => {
    const updateIncident = useIncidentStore.getState().updateIncident;
    updateIncident(incidentId, { status });
  };

  // Filter incidents: active and responding first, then show archived
  const activeIncidents = incidents.filter((inc) => inc.status !== 'resolved');
  const resolvedIncidents = incidents.filter((inc) => inc.status === 'resolved');

  return (
    <div className="absolute inset-0 flex gap-3 p-3">
      {/* ── DESKTOP: left panel ── */}
      <div className="pointer-events-none hidden w-[272px] min-w-0 lg:block">
        <Panel title="Incidents" subtitle="Response queue" className="pointer-events-auto h-[calc(100vh-96px)] overflow-y-auto flex flex-col">
          <div className="mb-3 flex gap-2">
            <button
              type="button"
              onClick={() => setAddModalOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 rounded-[6px] bg-[var(--accent)] px-3 py-2 text-[12px] font-semibold text-white hover:opacity-90 transition-opacity"
            >
              <Plus size={16} />
              Add
            </button>
          </div>
          <div className="space-y-2 flex-1 overflow-y-auto">
            {loading ? (
              <div className="space-y-2"><SkeletonCard /><SkeletonCard /></div>
            ) : activeIncidents.length === 0 ? (
              <EmptyState title="No active incidents" description="The response queue is empty right now." />
            ) : (
              <>
                {/* Active and Responding incidents */}
                {activeIncidents.map((incident) => (
                  <button
                    key={incident.id}
                    type="button"
                    onClick={() => setSelectedIncidentId(incident.id)}
                    className={`w-full rounded-[6px] border p-3 text-left text-[12px] ${selectedIncident?.id === incident.id ? 'border-[var(--accent)] bg-[color:color-mix(in_srgb,var(--accent)_8%,transparent)]' : 'border-[var(--border)]'}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`h-1.5 w-1.5 rounded-full ${severityColor(incident.severity)}`} />
                        <span>{incident.title}</span>
                      </div>
                      <span className={`inline-flex rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                        incident.status === 'active' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {incident.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="mt-1 text-[11px] text-[var(--muted)]">{incident.note}</div>
                  </button>
                ))}
              </>
            )}
          </div>
        </Panel>
      </div>

      <div className="flex-1 min-w-0" />

      {/* ── DESKTOP: right control panel ── */}
      <div className="pointer-events-none hidden w-[272px] min-w-0 lg:block">
        <Panel title="Control Panel" subtitle="Incident management" className="pointer-events-auto h-[calc(100vh-96px)] overflow-y-auto flex flex-col">
          <MetricCard label="Active" value={activeIncidents.length.toString()} />
          <MetricCard label="Resolved" value={resolvedIncidents.length.toString()} />
          
          {selectedIncident && (
            <div className="mt-4 space-y-3 flex-1">
              <div className="rounded-[6px] border border-[var(--border)] bg-[var(--surface)] p-3 text-[12px]">
                <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--muted)] mb-2">Selected incident</div>
                <div className="font-medium text-[var(--text)]">{selectedIncident.title}</div>
                <div className="mt-1 text-[var(--muted)]">{selectedIncident.note}</div>
                <div className="mt-2 text-[11px] text-[var(--muted)]">
                  Status: <span className="font-semibold text-[var(--text)]">{selectedIncident.status}</span>
                </div>
              </div>

              <div className="space-y-2">
                {selectedIncident.status === 'active' && (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedIncident.id, 'responding')}
                    className="w-full rounded-[6px] bg-blue-600 px-3 py-2 text-[12px] font-semibold text-white hover:bg-blue-700"
                  >
                    Mark Responding
                  </button>
                )}
                {selectedIncident.status === 'responding' && (
                  <button
                    type="button"
                    onClick={() => handleResolveIncident(selectedIncident.id)}
                    className="w-full rounded-[6px] bg-green-600 px-3 py-2 text-[12px] font-semibold text-white hover:bg-green-700"
                  >
                    Mark Resolved
                  </button>
                )}
                {selectedIncident.status !== 'resolved' && (
                  <button
                    type="button"
                    onClick={() => handleResolveIncident(selectedIncident.id)}
                    className="w-full rounded-[6px] border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[12px] font-semibold text-[var(--text)] hover:bg-[var(--surface)]"
                  >
                    Quick Resolve
                  </button>
                )}
              </div>
            </div>
          )}

          {!selectedIncident && (
            <div className="mt-4 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] p-3 text-[12px] text-[var(--muted)]">
              <div className="text-[11px] uppercase tracking-[0.22em]">No incident selected</div>
              <div className="mt-1">Choose an incident to load the response details.</div>
            </div>
          )}
        </Panel>
      </div>

      {/* ── MOBILE: full-screen list ── */}
      <div className="pointer-events-auto absolute inset-0 flex flex-col bg-[var(--surface)] lg:hidden">
        <div className="border-b border-[var(--border)] px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[14px] font-semibold">Incidents</div>
              <div className="text-[12px] text-[var(--muted)]">Response queue</div>
            </div>
            <button
              type="button"
              onClick={() => setAddModalOpen(true)}
              className="rounded-[6px] bg-[var(--accent)] p-2 text-white hover:opacity-90 transition-opacity"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 pb-24 space-y-2">
          {loading ? (
            <div className="space-y-2"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>
          ) : incidents.length === 0 ? (
            <EmptyState title="No active incidents" description="The response queue is empty right now." />
          ) : (
            incidents.map((incident) => (
              <button
                key={incident.id}
                type="button"
                onClick={() => handleSelect(incident.id)}
                className="w-full rounded-[10px] border border-[var(--border)] p-4 text-left"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 shrink-0 rounded-full ${severityColor(incident.severity)}`} />
                    <span className="text-[13px] font-medium">{incident.title}</span>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${incident.severity === 'critical' ? 'bg-red-100 text-red-700' : incident.severity === 'high' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                    {incident.severity}
                  </span>
                </div>
                <div className="mt-2 text-[12px] text-[var(--muted)]">{incident.note}</div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* ── MOBILE: detail bottom sheet ── */}
      {mobileDetailOpen && selectedIncident && (
        <div className="pointer-events-auto absolute inset-x-0 bottom-0 z-30 flex flex-col rounded-t-2xl border-t border-[var(--border)] bg-[var(--surface)] shadow-2xl lg:hidden" style={{ maxHeight: '70%' }}>
          <div className="flex items-start justify-between border-b border-[var(--border)] p-4">
            <div>
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${severityColor(selectedIncident.severity)}`} />
                <span className="text-[14px] font-semibold">{selectedIncident.title}</span>
              </div>
              <div className="mt-1 text-[12px] text-[var(--muted)]">{selectedIncident.note}</div>
            </div>
            <button type="button" onClick={() => setMobileDetailOpen(false)} className="ml-4 rounded-full p-1 text-[var(--muted)]">
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <MetricCard label="Status" value={selectedIncident.status} />
              <MetricCard label="Severity" value={selectedIncident.severity} />
            </div>
            <div className="space-y-2">
              {selectedIncident.status === 'active' && (
                <button
                  type="button"
                  onClick={() => {
                    handleUpdateStatus(selectedIncident.id, 'responding');
                    setMobileDetailOpen(false);
                  }}
                  className="w-full rounded-[10px] bg-blue-600 py-3 text-[13px] font-semibold text-white hover:bg-blue-700"
                >
                  Mark as Responding
                </button>
              )}
              {selectedIncident.status === 'responding' && (
                <button
                  type="button"
                  onClick={() => {
                    handleResolveIncident(selectedIncident.id);
                    setMobileDetailOpen(false);
                  }}
                  className="w-full rounded-[10px] bg-green-600 py-3 text-[13px] font-semibold text-white hover:bg-green-700"
                >
                  Mark as Resolved
                </button>
              )}
              {selectedIncident.status !== 'resolved' && (
                <button
                  type="button"
                  onClick={() => {
                    handleResolveIncident(selectedIncident.id);
                    setMobileDetailOpen(false);
                  }}
                  className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--bg)] py-3 text-[13px] font-semibold text-[var(--text)]"
                >
                  Quick Resolve
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Incident Modal */}
      <AddIncidentModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAddIncident}
      />
    </div>
  );
}
