// src/App.jsx
import './App.css';
import Pages from '@/pages/index.jsx';
import { Toaster } from '@/components/ui/toaster';
import { HelmetProvider } from 'react-helmet-async';

function App() {
  return (
    <HelmetProvider>
      <Pages />
      <Toaster />
    </HelmetProvider>
  );
}

export default App;
