import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Hub from './pages/Hub';
import WalletPage from './pages/WalletPage';
import EmbeddedPage from './pages/EmbeddedPage';
import AuditorPage from './pages/AuditorPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
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
