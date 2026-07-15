import { Component, ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Car interface simulator error", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="grid min-h-screen place-items-center bg-cockpit-950 p-6 text-white">
          <div className="max-w-md rounded-[2rem] border border-electric-400/30 bg-white/8 p-8 text-center backdrop-blur-xl">
            <h1 className="text-3xl font-bold">Interface paused</h1>
            <p className="mt-3 text-white/70">Something went wrong while rendering this demo. Refresh to restart the simulator.</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 min-h-12 rounded-full bg-electric-500 px-6 font-semibold text-white outline-none transition hover:bg-electric-400 focus-visible:ring-2 focus-visible:ring-electric-300"
            >
              Restart
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
