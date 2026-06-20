import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Hub from './shared/ui/Hub';
import WalletPage from './features/wallet/ui/WalletPage';
import EmbeddedPage from './features/embedded/ui/EmbeddedPage';
import AuditorPage from './features/auditor/ui/AuditorPage';
import AdminPage from './features/admin/ui/AdminPage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter basename="/PaganiniCore">
        <Routes>
          <Route path="/" element={<Hub />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/embedded" element={<EmbeddedPage />} />
          <Route path="/auditor" element={<AuditorPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}