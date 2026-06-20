import { useNavigate } from 'react-router-dom';
import SuplaierAppMock from './SuplaierAppMock';

export default function EmbeddedPage() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-default)' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/')}>
          ← Volver al Hub
        </button>
      </div>
      <div style={{ flex: 1 }}>
        <SuplaierAppMock />
      </div>
    </div>
  );
}
