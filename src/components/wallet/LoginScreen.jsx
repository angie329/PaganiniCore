import { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_USERS } from '../../data/mockData';

function PaganiniLogo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lgLogin" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="12" fill="url(#lgLogin)" />
      <path d="M12 10 L12 30 M12 10 L20 10 C24 10 27 13 27 17 C27 21 24 24 20 24 L12 24"
        stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="30" cy="28" r="4" fill="white" fillOpacity="0.25" />
      <circle cx="30" cy="28" r="2" fill="white" />
    </svg>
  );
}

export default function LoginScreen() {
  const { dispatch } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const formRef = useRef(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    await new Promise(r => setTimeout(r, 1200));

    const user = MOCK_USERS[email.toLowerCase()];
    if (user && user.password === password) {
      dispatch({ type: 'LOGIN', payload: user });
    } else {
      setLoading(false);
      setError('Correo o contraseña incorrectos');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '32px 24px',
      background: 'var(--bg-primary)',
    }}>
      {/* Logo & Brand */}
      <div style={{ textAlign: 'center', marginBottom: 40 }} className="animate-fade-in-up">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <div style={{
            padding: 2,
            borderRadius: 18,
            background: 'var(--brand-gradient)',
            boxShadow: 'var(--shadow-brand)',
          }}>
            <PaganiniLogo size={64} />
          </div>
        </div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 4 }}>Paganini</h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Tu billetera digital segura</p>
      </div>

      {/* Form */}
      <form
        ref={formRef}
        onSubmit={handleLogin}
        className={shake ? 'animate-shake' : ''}
        style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
      >
        <div className="form-group">
          <label className="form-label">Correo electrónico</label>
          <input
            type="email"
            className={`form-input ${error ? 'error' : ''}`}
            placeholder="correo@espol.edu.ec"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
            id="login-email"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            className={`form-input ${error ? 'error' : ''}`}
            placeholder="••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            id="login-password"
          />
        </div>

        {error && (
          <div className="alert alert-error">
            <span style={{ fontSize: '0.9rem' }}>⚠</span>
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary btn-full btn-lg"
          disabled={loading || !email || !password}
          id="login-submit"
          style={{ marginTop: 8 }}
        >
          {loading ? (
            <><span className="spinner" /> Verificando...</>
          ) : (
            'Ingresar'
          )}
        </button>
      </form>

      {/* Hint */}
      <div style={{
        marginTop: 28,
        background: 'rgba(124,58,237,0.08)',
        border: '1px solid rgba(124,58,237,0.2)',
        borderRadius: 'var(--radius-md)',
        padding: '12px 14px',
      }}>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--brand-light)' }}>Demo:</strong> usa{' '}
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>matias@espol.edu.ec</span>
          {' '}/ <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>1234</span>
        </p>
      </div>
    </div>
  );
}
