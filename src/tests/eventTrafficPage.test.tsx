import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('recharts', () => {
  const passthrough = ({ children }: { children?: unknown }) => <>{children}</>;

  return {
    Bar: passthrough,
    BarChart: passthrough,
    CartesianGrid: passthrough,
    Legend: passthrough,
    ResponsiveContainer: passthrough,
    Tooltip: passthrough,
    XAxis: passthrough,
    YAxis: passthrough,
  };
});

vi.mock('../components/map/TrafficMap', () => ({
  TrafficMap: () => <div data-testid="traffic-map">traffic map</div>,
}));

import { EventTrafficPage } from '../pages/EventTrafficPage';

describe('event traffic page', () => {
  it('renders the event dashboard and seeded event content', () => {
    const html = renderToStaticMarkup(<EventTrafficPage />);

    expect(html).toContain('Event traffic management');
    expect(html).toContain('EMS Stadium football match');
    expect(html).toContain('traffic map');
  });
});