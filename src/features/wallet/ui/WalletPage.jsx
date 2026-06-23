import { useNavigate } from 'react-router-dom';
import WalletApp from './WalletApp';

export default function WalletPage() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      {/* Back button */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-default)' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/')}>
          ← Volver al Hub
        </button>
      </div>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
        <WalletApp />
      </div>
    </div>
  );
}
