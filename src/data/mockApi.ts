import {
  demandCurve,
  events,
  forecastSeries,
  incidents,
  junctions,
  liveSnapshot,
  liveTrafficMatrix,
  recommendations,
  roads,
  signalPlans,
  systemMetrics,
} from './trafficNetwork';

const pause = (ms: number) => new Promise((resolve) => globalThis.setTimeout(resolve, ms));

export const mockApi = {
  async getLiveTraffic() {
    await pause(120);
    return { snapshot: liveSnapshot, junctions, roads: liveTrafficMatrix };
  },
  async getForecast() {
    await pause(140);
    return { forecastSeries, demandCurve };
  },
  async getIncidents() {
    await pause(110);
    return incidents.map((inc) => {
      const mappedStatus: 'active' | 'responding' | 'resolved' = inc.status === 'investigating' || inc.status === 'open' ? 'active' : inc.status === 'mitigated' ? 'responding' : 'resolved';
      return {
      id: inc.id,
      type: 'roadblock' as const,
      severity: inc.severity,
      node_id: inc.junctionId,
      affected_links: [],
      status: mappedStatus,
      reported_at: Date.parse(inc.reportedAt || ''),
      title: inc.title,
      note: inc.description || '',
      };
    });
  },
  async getEvents() {
    await pause(110);
    return events;
  },
  async getRecommendations() {
    await pause(130);
    return recommendations;
  },
  async getSignals() {
    await pause(90);
    return signalPlans;
  },
  async getSystemMetrics() {
    await pause(90);
    return systemMetrics;
  },
};
