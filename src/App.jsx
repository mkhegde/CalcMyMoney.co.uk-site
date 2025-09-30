import './App.css';
import Pages from '@/pages/index.jsx';
import { Toaster } from '@/components/ui/toaster';
import ErrorBoundary from '@/components/common/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Pages />
      <Toaster />
    </ErrorBoundary>
  );
}

export default App;
