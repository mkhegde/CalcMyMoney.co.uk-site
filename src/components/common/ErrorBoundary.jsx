import React from 'react';

export default class ErrorBoundary extends React.Component {
  state = { hasError: false, message: '' };
  static getDerivedStateFromError(err) {
    return { hasError: true, message: err?.message || 'Something went wrong.' };
  }
  componentDidCatch(err, info) {
    console.error('UI error:', err, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-2xl mx-auto p-6 my-10 rounded-lg border bg-red-50 text-red-800">
          <h2 className="font-semibold mb-2">Sorry — something went wrong</h2>
          <p className="text-sm">{this.state.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}
