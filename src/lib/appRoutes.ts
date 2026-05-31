export const appRoutes = {
  commandCenter: '/command-center',
  measures: '/measures',
  forecasting: '/forecasting',
  analytics: '/analytics',
  incidents: '/incidents',
  events: '/events',
  systemAdmin: '/system-admin',
} as const;

export const topNavRoutes = [
  { to: appRoutes.commandCenter, label: 'Command Center' },
  { to: appRoutes.measures, label: 'Measures' },
  { to: appRoutes.forecasting, label: 'Forecasting' },
  { to: appRoutes.analytics, label: 'Analytics' },
  { to: appRoutes.incidents, label: 'Incidents' },
  { to: appRoutes.events, label: 'Events' },
  { to: appRoutes.systemAdmin, label: 'System Admin' },
] as const;

export const sidebarRoutes = [
  { to: appRoutes.commandCenter, label: 'Live Command Center', short: 'Command' },
  { to: appRoutes.measures, label: 'Measures', short: 'Measures' },
  { to: appRoutes.forecasting, label: 'Forecasting', short: 'Forecast' },
  { to: appRoutes.analytics, label: 'Analytics & Insights', short: 'Insights' },
  { to: appRoutes.incidents, label: 'Incidents', short: 'Response' },
  { to: appRoutes.events, label: 'Events', short: 'Events' },
  { to: appRoutes.systemAdmin, label: 'System Admin', short: 'Health' },
] as const;