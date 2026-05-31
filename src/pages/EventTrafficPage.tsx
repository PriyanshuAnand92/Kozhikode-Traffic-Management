import { useEffect, useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, X } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { TrafficMap } from '../components/map/TrafficMap';
import { MetricCard } from '../components/ui/MetricCard';
import { Panel } from '../components/ui/Panel';
import { events, junctions } from '../data/trafficNetwork';
import { mockApi } from '../data/mockApi';
import { useEventStore } from '../store/event.store';
import { selectEvent } from '../lib/trafficSelectors';
import { useTrafficStore } from '../store/useTrafficStore';

export function EventTrafficPage() {
  const eventList = useEventStore((s) => s.events);
  const addEvent = useEventStore((s) => s.addEvent);
  const selectedEventId = useTrafficStore((state) => state.selectedEventId);
  const setSelectedEventId = useTrafficStore((state) => state.setSelectedEventId);

  useEffect(() => {
    mockApi.getEvents().then((items) => {
      items.forEach((it) => addEvent(it));
    });
  }, []);

  const selectedEvent = selectEvent(eventList, selectedEventId);

  const [showAdd, setShowAdd] = useState(false);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [mobileSheetExpanded, setMobileSheetExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<{
    id: string; name: string;
    category: 'sports' | 'vip' | 'rally' | 'festival' | 'religious';
    venue: string; impactRadiusKm: number; attendance: number;
    startTime: string; endTime: string;
    state: 'scheduled' | 'live' | 'completed';
  }>({ id: '', name: '', category: 'sports', venue: '', impactRadiusKm: 1.0, attendance: 0, startTime: '', endTime: '', state: 'scheduled' });

  const onAdd = () => {
    setError(null);
    if (!form.id || !form.name) return setError('Provide id and name');
    if (eventList.some((e) => e.id === form.id)) return setError('An event with this id already exists');
    const startMs = form.startTime ? Date.parse(form.startTime) : NaN;
    const endMs = form.endTime ? Date.parse(form.endTime) : NaN;
    if (isNaN(startMs) || isNaN(endMs)) return setError('Start and end must be valid date/time');
    if (endMs < startMs) return setError('End time must be after start time');
    if (form.attendance < 0 || form.attendance > 1000000) return setError('Attendance must be between 0 and 1,000,000');
    addEvent({ ...form });
    setShowAdd(false);
    setForm({ id: '', name: '', category: 'sports', venue: '', impactRadiusKm: 1.0, attendance: 0, startTime: '', endTime: '', state: 'scheduled' });
  };

  const crowdSeries = [
    { zone: 'Gate A', crowd: 82, parking: 74, busLoad: 62 },
    { zone: 'Gate B', crowd: 68, parking: 58, busLoad: 70 },
    { zone: 'South lot', crowd: 44, parking: 82, busLoad: 39 },
    { zone: 'North corridor', crowd: 76, parking: 61, busLoad: 88 },
  ];

  const sheetHeight = mobileSheetExpanded ? 'h-[80%]' : 'h-[42%]';

  return (
    <>
      {/* ── DESKTOP layout (unchanged) ── */}
      <div className="pointer-events-auto hidden space-y-5 lg:block">
        <section className="grid gap-4 md:grid-cols-4">
          {[
            { label: 'Planned events', value: `${eventList.length}`, detail: 'Live and scheduled special operations' },
            { label: 'Venue pressure', value: 'High', detail: 'Stadium Junction and corridor overlap', tone: 'warning' as const },
            { label: 'Parking overflow', value: '76%', detail: 'Requires temporary corridor control' },
            { label: 'Bus priority', value: 'Enabled', detail: 'Transit-first response mode', tone: 'success' as const },
          ].map((item) => (
            <MetricCard key={item.label} {...item} />
          ))}
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
          <Panel title="Event traffic management" eyebrow="Special event operations" className="pointer-events-auto">
            <div className="flex items-center justify-between">
              <div className="text-sm text-[var(--muted)]">Interactive event map and operational controls.</div>
              <button type="button" onClick={() => setShowAdd(true)} className="rounded-full border px-3 py-1 text-sm">Add event</button>
            </div>
            <div className="mt-3">
              <TrafficMap className="h-[520px] rounded-lg" />
            </div>
          </Panel>

          <div className="space-y-5">
            <Panel title="Event scenarios" eyebrow="Simulation control" className="pointer-events-auto">
              <div className="space-y-3">
                {eventList.map((event) => (
                  <button
                    key={event.id}
                    type="button"
                    onClick={() => setSelectedEventId(event.id)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${event.id === selectedEventId ? 'border-blue-200 bg-blue-50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">{event.category}</p>
                        <h3 className="mt-2 text-base font-semibold text-slate-950">{event.name}</h3>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${event.state === 'live' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                        {event.state}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{event.venue}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">Impact radius {event.impactRadiusKm} km · Attendance {event.attendance || 'flow only'}</p>
                  </button>
                ))}
              </div>
            </Panel>

            <Panel title={selectedEvent?.name ?? 'Event overview'} eyebrow="Operational simulation" className="pointer-events-auto">
              <div className="grid gap-4 md:grid-cols-2">
                <MetricCard label="Crowd movement" value="Forecasted" detail="Arrival wave front mapped to transit release" />
                <MetricCard label="Parking overflow" value="High risk" detail="Temporary overflow zone required" tone="warning" />
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <button type="button" className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">Activate diversion plan</button>
                <button type="button" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Prioritize buses</button>
                <button type="button" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Simulate parking overflow</button>
              </div>
            </Panel>

            <Panel title="Crowd and parking outlook" eyebrow="Simulation outputs" className="pointer-events-auto">
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={crowdSeries}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="zone" tick={{ fill: '#64748b', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="crowd" fill="#2563eb" radius={[10, 10, 0, 0]} />
                    <Bar dataKey="parking" fill="#0f766e" radius={[10, 10, 0, 0]} />
                    <Bar dataKey="busLoad" fill="#f97316" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Panel>
          </div>
        </section>
      </div>

      {/* ── MOBILE: map full screen + bottom sheet ── */}
      <div className="absolute inset-0 flex flex-col lg:hidden">
        {/* Add event button floating top-right */}
        <div className="absolute top-3 right-3 z-30 pointer-events-auto">
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="rounded-full bg-[var(--surface)] border border-[var(--border)] px-4 py-2 text-[13px] font-medium shadow-md"
          >
            + Add event
          </button>
        </div>

        {/* Bottom sheet */}
        <div
          className={`pointer-events-auto absolute inset-x-0 bottom-0 flex flex-col rounded-t-2xl border-t border-[var(--border)] bg-[var(--surface)] shadow-2xl transition-all duration-300 ${sheetHeight}`}
        >
          {/* Handle */}
          <button
            type="button"
            onClick={() => setMobileSheetExpanded((v) => !v)}
            className="flex w-full flex-col items-center gap-1 px-4 pt-3 pb-2"
          >
            <div className="h-1 w-10 rounded-full bg-[var(--border)]" />
            <div className="flex w-full items-center justify-between">
              <span className="text-[13px] font-semibold">Events ({eventList.length})</span>
              {mobileSheetExpanded ? <ChevronDown size={16} className="text-[var(--muted)]" /> : <ChevronUp size={16} className="text-[var(--muted)]" />}
            </div>
          </button>

          <div className="flex-1 overflow-y-auto px-3 pb-24 space-y-2">
            {eventList.map((event) => (
              <button
                key={event.id}
                type="button"
                onClick={() => { setSelectedEventId(event.id); setMobileSheetOpen(true); }}
                className={`w-full rounded-[10px] border p-3 text-left ${event.id === selectedEventId ? 'border-[var(--accent)] bg-[color:color-mix(in_srgb,var(--accent)_8%,transparent)]' : 'border-[var(--border)]'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-medium">{event.name}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${event.state === 'live' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                    {event.state}
                  </span>
                </div>
                <div className="mt-1 text-[11px] text-[var(--muted)]">{event.venue} · {event.impactRadiusKm}km radius</div>
              </button>
            ))}
          </div>
        </div>

        {/* Event detail overlay */}
        {mobileSheetOpen && selectedEvent && (
          <div className="pointer-events-auto absolute inset-0 z-40 flex flex-col bg-[var(--surface)]">
            <div className="flex items-center gap-3 border-b border-[var(--border)] p-4">
              <button type="button" onClick={() => setMobileSheetOpen(false)}>
                <ArrowLeft size={20} className="text-[var(--text)]" />
              </button>
              <div>
                <div className="text-[14px] font-semibold">{selectedEvent.name}</div>
                <div className="text-[11px] text-[var(--muted)]">{selectedEvent.venue}</div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <MetricCard label="Crowd movement" value="Forecasted" />
                <MetricCard label="Parking overflow" value="High risk" tone="warning" />
              </div>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={crowdSeries}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="zone" tick={{ fill: '#64748b', fontSize: 10 }} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="crowd" fill="#2563eb" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="parking" fill="#0f766e" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col gap-2 pt-2">
                <button type="button" className="w-full rounded-[10px] bg-[var(--accent)] py-3 text-[13px] font-semibold text-white">Activate diversion plan</button>
                <button type="button" className="w-full rounded-[10px] border border-[var(--border)] py-3 text-[13px] font-semibold">Prioritize buses</button>
                <button type="button" className="w-full rounded-[10px] border border-[var(--border)] py-3 text-[13px] font-semibold">Simulate parking overflow</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add event modal — fully responsive bottom sheet on mobile, centered on desktop */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-end pointer-events-auto lg:items-center lg:justify-center" style={{ paddingBottom: "4rem" }}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAdd(false)} />

          {/* Sheet — slides up from bottom on mobile, floats centered on desktop */}
          <div className="relative z-50 w-full lg:max-w-lg lg:mx-4">
            <div className="rounded-t-2xl lg:rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl flex flex-col overflow-hidden" style={{ maxHeight: "calc(100dvh - 9rem)" }}>

              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
                <div>
                  <div className="h-1 w-10 rounded-full bg-[var(--border)] mx-auto mb-3 lg:hidden" />
                  <h3 className="text-[16px] font-semibold text-[var(--text)]">Add Event</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="rounded-full p-2 text-[var(--muted)] hover:bg-[var(--border)]"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable form body */}
              <div className="flex-1 overflow-y-auto px-5 pb-8 flex flex-col gap-4">

                {/* ID */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-medium text-[var(--muted)] uppercase tracking-[0.16em]">ID (unique)</label>
                  <input
                    placeholder="eg. event-2026-parade"
                    value={form.id}
                    onChange={(e) => setForm({ ...form, id: e.target.value.trim() })}
                    className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg)] px-3 py-3 text-[14px] text-[var(--text)] outline-none focus:border-[var(--accent)] placeholder:text-[var(--muted)]"
                  />
                </div>

                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-medium text-[var(--muted)] uppercase tracking-[0.16em]">Name</label>
                  <input
                    placeholder="Event name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg)] px-3 py-3 text-[14px] text-[var(--text)] outline-none focus:border-[var(--accent)] placeholder:text-[var(--muted)]"
                  />
                </div>

                {/* Category + Venue — stacked on mobile, side by side on lg */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-medium text-[var(--muted)] uppercase tracking-[0.16em]">Category</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                      className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg)] px-3 py-3 text-[14px] text-[var(--text)] outline-none focus:border-[var(--accent)]"
                    >
                      {['sports','vip','rally','festival','religious'].map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-medium text-[var(--muted)] uppercase tracking-[0.16em]">Venue</label>
                    <select
                      value={form.venue}
                      onChange={(e) => setForm({ ...form, venue: e.target.value })}
                      className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg)] px-3 py-3 text-[14px] text-[var(--text)] outline-none focus:border-[var(--accent)]"
                    >
                      <option value="">— choose junction —</option>
                      {junctions.map((j) => <option key={j.id} value={j.name}>{j.name} — {j.zone}</option>)}
                    </select>
                  </div>
                </div>

                {/* Start + End — always stacked on mobile */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-medium text-[var(--muted)] uppercase tracking-[0.16em]">Start</label>
                    <input
                      type="datetime-local"
                      value={form.startTime}
                      onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                      className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg)] px-3 py-3 text-[14px] text-[var(--text)] outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-medium text-[var(--muted)] uppercase tracking-[0.16em]">End</label>
                    <input
                      type="datetime-local"
                      value={form.endTime}
                      onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                      className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg)] px-3 py-3 text-[14px] text-[var(--text)] outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                </div>

                {/* Attendance + Impact + State — each full width stacked */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-medium text-[var(--muted)] uppercase tracking-[0.16em]">Attendance</label>
                    <input
                      type="number" min={0} max={1000000}
                      placeholder="0"
                      value={form.attendance}
                      onChange={(e) => setForm({ ...form, attendance: Number(e.target.value || 0) })}
                      className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg)] px-3 py-3 text-[14px] text-[var(--text)] outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-medium text-[var(--muted)] uppercase tracking-[0.16em]">Impact radius (km)</label>
                    <input
                      type="number" step="0.1" min={0} max={20}
                      placeholder="1.0"
                      value={form.impactRadiusKm}
                      onChange={(e) => setForm({ ...form, impactRadiusKm: Number(e.target.value || 1) })}
                      className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg)] px-3 py-3 text-[14px] text-[var(--text)] outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-medium text-[var(--muted)] uppercase tracking-[0.16em]">Status</label>
                    <select
                      value={form.state}
                      onChange={(e) => setForm({ ...form, state: e.target.value as any })}
                      className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg)] px-3 py-3 text-[14px] text-[var(--text)] outline-none focus:border-[var(--accent)]"
                    >
                      {['scheduled','live','completed'].map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="rounded-[8px] bg-red-50 border border-red-200 px-3 py-2 text-[13px] text-red-600">
                    {error}
                  </div>
                )}

                {/* Actions — full width on mobile */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAdd(false)}
                    className="w-full rounded-[10px] border border-[var(--border)] py-3 text-[14px] font-medium text-[var(--text)]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={onAdd}
                    className="w-full rounded-[10px] bg-[var(--accent)] py-3 text-[14px] font-semibold text-white"
                  >
                    Add Event
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
