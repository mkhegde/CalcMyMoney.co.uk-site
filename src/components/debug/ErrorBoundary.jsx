import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { err: null };
  }
  static getDerivedStateFromError(err) {
    return { err };
  }
  componentDidCatch(err, info) {
    console.error('App crash:', err, info);
  }
  render() {
    if (this.state.err) {
      return (
        <div style={{ padding: 16, fontFamily: 'monospace' }}>
          <h2>Something went wrong</h2>
          <pre>{String(this.state.err?.message || this.state.err)}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
