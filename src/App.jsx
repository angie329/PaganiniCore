import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Hub from './ui/screens/Hub';
import WalletPage from './ui/screens/WalletPage';
import EmbeddedPage from './ui/screens/EmbeddedPage';
import AuditorPage from './ui/screens/AuditorPage';
import AdminPage from './ui/screens/AdminPage';

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