# KUTIS - Kozhikode Urban Traffic Intelligence System

KUTIS is a Vite + React dashboard for traffic monitoring and urban mobility operations in Kozhikode. It combines a live map, signal and link intelligence, incident tracking, forecasting, and AI-assisted operational views in a single interface.

## Overview

The app is built around a persistent map shell with route-based pages layered on top. It is designed to help operators inspect junction states, road links, incidents, and forecasted traffic conditions without leaving the same workspace.

## Features

- Live traffic map with junction markers and road links
- Hover details for nodes and links
- Layer controls for traffic, nodes, heatmap, AI overlays, and incidents
- Command center view with live operational metrics
- AI engine and recommendation views
- Forecasting and analytics pages
- Incident and event management pages
- System administration view
- Theme switching between light, dark, and satellite modes
- Search-driven filtering from the top navigation bar

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- Leaflet and React Leaflet
- Zustand
- Tailwind CSS
- Framer Motion
- Recharts

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Open the local URL shown by Vite, usually `http://localhost:5173/`.

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## Routes

- `/command-center` - main traffic operations dashboard
- `/ai-engine` - AI insights and recommendations
- `/forecasting` - traffic forecasting views
- `/analytics` - analytics and summary views
- `/incidents` - incident management
- `/events` - event traffic coordination
- `/system-admin` - administrative controls

## Project Structure

- `src/components/map` - Leaflet map layers, markers, tooltips, and controls
- `src/components/layout` - app shell, navigation, and side layout
- `src/components/ui` - reusable UI components
- `src/data` - traffic geometry, mock data, and snapshots
- `src/lib` - simulation, traffic math, and helper utilities
- `src/pages` - route-level dashboard pages
- `src/store` - Zustand state stores

## Notes

- The map uses Kozhikode traffic geometry and simulated live states for demonstration.
- The app does not require a backend to run locally.
- Traffic data, incidents, and AI outputs are currently driven by local project data and store state.
