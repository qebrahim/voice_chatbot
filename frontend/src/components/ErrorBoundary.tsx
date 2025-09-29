import React, { Component, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Determine development mode without using import.meta (unavailable in Jest TS config)
      let isDev = false;
      const g = globalThis as { importMeta?: { env?: { DEV?: boolean } } };
      isDev = g.importMeta?.env?.DEV === true;
      return (
        <div className="error-boundary">
          <div className="error-content">
            <AlertTriangle size={48} className="error-icon" />
            <h2>Something went wrong</h2>
            <p>The application encountered an unexpected error.</p>
            {isDev && this.state.error && (
              <details className="error-details">
                <summary>Error details</summary>
                <pre>{this.state.error.stack}</pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="voice-btn primary"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;