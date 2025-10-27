import React, { Component, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 React Error Boundary caught error:', error);
    console.error('🚨 Error Info:', errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-red-500 rounded-lg p-8 max-w-2xl w-full">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
              <h1 className="text-2xl font-bold text-red-900">
                Greška u Aplikaciji
              </h1>
            </div>
            
            <div className="bg-red-100 border border-red-300 rounded-lg p-4 mb-4">
              <p className="font-semibold text-red-900 mb-2">Error Message:</p>
              <pre className="text-sm text-red-800 whitespace-pre-wrap break-all">
                {this.state.error?.toString()}
              </pre>
            </div>
            
            {this.state.errorInfo && (
              <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-4">
                <p className="font-semibold text-gray-900 mb-2">Stack Trace:</p>
                <pre className="text-xs text-gray-800 whitespace-pre-wrap break-all overflow-auto max-h-64">
                  {this.state.errorInfo.componentStack}
                </pre>
              </div>
            )}
            
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              🔄 Osvežite Stranicu
            </button>
            
            <div className="mt-4 text-sm text-gray-600">
              <p className="font-semibold mb-2">Šta uraditi:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Osvežite stranicu (F5)</li>
                <li>Očistite cache (Ctrl+Shift+R)</li>
                <li>Pokušajte ponovo za nekoliko sekundi</li>
                <li>Ako problem i dalje postoji, kontaktirajte podršku</li>
              </ol>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
