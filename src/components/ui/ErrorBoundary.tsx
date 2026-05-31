import type { ErrorInfo, ReactNode } from 'react';
import { Component } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  handleRetry = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Dashboard render error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
          <div className="max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-panel">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">System error</p>
            <h1 className="mt-3 text-2xl font-semibold text-slate-950">Traffic dashboard failed to render</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              The control surface hit a runtime issue. Reload the page or inspect the data model and component tree.
            </p>
            <button
              type="button"
              onClick={this.handleRetry}
              className="mt-5 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Retry dashboard
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
