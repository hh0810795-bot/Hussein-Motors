import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends (Component as any) {
  constructor(props: any) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4 text-center">
          <div className="glass p-8 rounded-3xl max-w-md w-full space-y-6">
            <h2 className="text-2xl font-bold text-red-500">عذراً، حدث خطأ ما</h2>
            <p className="text-zinc-400">
              لقد واجه التطبيق خطأً غير متوقع. يرجى محاولة تحديث الصفحة.
            </p>
            {this.state.error && (
              <pre className="text-xs bg-black/50 p-4 rounded-xl overflow-auto text-left text-zinc-500 max-h-40">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={() => window.location.reload()}
              className="btn-primary w-full"
            >
              تحديث الصفحة
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
