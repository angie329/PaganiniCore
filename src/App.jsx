import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { WalletProvider } from './features/wallet/infra/WalletContext';

const Hub = lazy(() => import('./shared/ui/Hub'));
const ProductionLanding = lazy(() => import('./shared/ui/ProductionLanding'));
const WalletPage = lazy(() => import('./features/wallet/ui/WalletPage'));
const EmbeddedPage = lazy(() => import('./features/embedded/ui/EmbeddedPage'));
const AuditorPage = lazy(() => import('./features/auditor/ui/AuditorPage'));
const AdminPage = lazy(() => import('./features/admin/ui/AdminPage'));

function RouteLoadingFallback() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      color: 'var(--text-secondary)',
    }}>
      <div className="spinner" style={{ width: 32, height: 32 }} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <WalletProvider>
        <BrowserRouter basename="/PaganiniCore">
          <Suspense fallback={<RouteLoadingFallback />}>
            <Routes>
              <Route path="/" element={<Hub />} />
              <Route path="/landing" element={<ProductionLanding />} />
              <Route path="/wallet" element={<WalletPage />} />
              <Route path="/embedded" element={<EmbeddedPage />} />
              <Route path="/auditor" element={<AuditorPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </WalletProvider>
    </AppProvider>
  );
}
