import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { NODES } from '../../data/nodes';
import { LINKS } from '../../data/links';
import type { Incident } from '../../types/traffic';

interface AddIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (incident: Incident) => void;
}

export function AddIncidentModal({ isOpen, onClose, onAdd }: AddIncidentModalProps) {
  const [formData, setFormData] = useState({
    type: 'accident' as const,
    severity: 'high' as const,
    node_id: NODES[0]?.id || '',
    title: '',
    note: '',
  });

  const [affectedLinks, setAffectedLinks] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('Please enter an incident title');
      return;
    }

    const newIncident: Incident = {
      id: `INC-${Date.now()}`,
      type: formData.type,
      severity: formData.severity,
      node_id: formData.node_id,
      affected_links: affectedLinks,
      status: 'active',
      reported_at: Date.now(),
      title: formData.title,
      note: formData.note,
    };

    onAdd(newIncident);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setFormData({
      type: 'accident',
      severity: 'high',
      node_id: NODES[0]?.id || '',
      title: '',
      note: '',
    });
    setAffectedLinks([]);
  };

  const handleLinkToggle = (linkId: string) => {
    setAffectedLinks((prev) =>
      prev.includes(linkId) ? prev.filter((id) => id !== linkId) : [...prev, linkId]
    );
  };

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    // Only close if clicking the overlay itself, not the modal content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 pointer-events-auto"
      onClick={handleOverlayClick}
    >
      <div className="relative w-full max-w-md rounded-lg bg-[var(--surface)] p-6 shadow-lg pointer-events-auto" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-[var(--muted)] hover:text-[var(--text)] pointer-events-auto"
        >
          <X size={20} />
        </button>

        <h2 className="mb-4 text-lg font-semibold">Report New Incident</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-1">
              Incident Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Vehicle breakdown on MG Road"
              className="w-full rounded border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-1">
              Incident Type
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value as any,
                })
              }
              className="w-full rounded border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
            >
              <option value="accident">Accident</option>
              <option value="breakdown">Breakdown</option>
              <option value="roadblock">Roadblock</option>
              <option value="vip">VIP Movement</option>
              <option value="flooding">Flooding</option>
            </select>
          </div>

          {/* Severity */}
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-1">
              Severity
            </label>
            <select
              value={formData.severity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  severity: e.target.value as any,
                })
              }
              className="w-full rounded border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
            >
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Junction/Node */}
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-1">
              Affected Junction
            </label>
            <select
              value={formData.node_id}
              onChange={(e) => setFormData({ ...formData, node_id: e.target.value })}
              className="w-full rounded border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
            >
              {NODES.map((node) => (
                <option key={node.id} value={node.id}>
                  {node.name}
                </option>
              ))}
            </select>
          </div>

          {/* Affected Links */}
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-2">
              Affected Links (optional)
            </label>
            <div className="max-h-32 overflow-y-auto space-y-1 rounded border border-[var(--border)] p-2">
              {LINKS.slice(0, 8).map((link) => (
                <label key={link.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={affectedLinks.includes(link.id)}
                    onChange={() => handleLinkToggle(link.id)}
                    className="rounded"
                  />
                  <span className="text-sm text-[var(--text)]">{link.id}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Note/Description */}
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-1">
              Notes
            </label>
            <textarea
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              placeholder="Additional details about the incident..."
              rows={3}
              className="w-full rounded border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                onClose();
                resetForm();
              }}
              className="flex-1 rounded border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-sm font-medium text-[var(--text)] hover:bg-[var(--surface)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Report Incident
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
