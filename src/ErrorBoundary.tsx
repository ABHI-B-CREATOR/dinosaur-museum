import React from "react";

type Props = { children: React.ReactNode };

type State = { hasError: boolean; error?: Error };

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    // eslint-disable-next-line no-console
    console.error("ErrorBoundary caught:", error, info);
  }

  reset = () => this.setState({ hasError: false, error: undefined });

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
          <div className="max-w-2xl rounded-lg bg-white/6 p-6">
            <h2 className="text-xl font-bold mb-2">Failed to load the 3D scene</h2>
            <p className="mb-4 text-sm text-white/70">{this.state.error?.message}</p>
            <div className="flex gap-3">
              <button
                onClick={this.reset}
                className="px-4 py-2 rounded bg-white text-black font-semibold"
              >
                Retry
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 rounded border border-white text-white"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
