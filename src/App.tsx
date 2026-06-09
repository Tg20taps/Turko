import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './routes/AppRouter';
import { CartDrawer } from './components/public/CartDrawer';
import { registerServiceWorker } from './lib/pwa';

export default function App() {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <BrowserRouter>
      <AppRouter />
      <CartDrawer />
    </BrowserRouter>
  );
}
