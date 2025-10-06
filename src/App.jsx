// src/App.jsx
import './App.css';
import Pages from '@/pages/index.jsx';
import { Toaster } from '@/components/ui/toaster';
import { HelmetProvider } from 'react-helmet-async';
import ErrorBoundary from '@/components/debug/ErrorBoundary';

function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <Pages />
        <Toaster />
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
