import { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { useWallet } from '../infra/useWallet';
import { formatCurrency } from '../../../utils/helpers';
import { ArrowLeft } from 'lucide-react';

export default function WithdrawForm() {
  const { state, dispatch } = useApp();
  const wallet = useWallet();
  const [amount, setAmount] = useState('');
  const [account, setAccount] = useState('BP-0012345678');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const go = (screen) => dispatch({ type: 'SET_WALLET_SCREEN', payload: screen });

  const num = parseFloat(amount) || 0;
  const insufficientFunds = num > 0 && num > state.balance;

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (!num || num <= 0 || insufficientFunds) return;

    setLoading(true);
    if (num > 500) {
      setLoading(false);
      setResult('declined');
    } else {
      try {
        const newTx = await wallet.withdrawFunds(state.currentUser.id, num, `Banco Pichincha ${account}`);
        setResult('success');
        dispatch({ type: 'ADD_TRANSACTION', payload: newTx });
      } catch (err) {
        setResult('declined');
      }
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, gap: 20, background: 'var(--bg-primary)' }}>
        <div style={{
          width: 72, height: 72,
          borderRadius: '50%',
          background: result === 'success' ? 'var(--success-bg)' : 'var(--danger-bg)',
          border: `2px solid ${result === 'success' ? 'var(--success)' : 'var(--danger)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2.2rem',
          animation: 'fadeInScale 300ms ease',
        }}>
          {result === 'success' ? '✓' : '✗'}
        </div>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 8, color: result === 'success' ? 'var(--success)' : 'var(--danger-light)' }}>
            {result === 'success' ? '¡Retiro exitoso!' : 'Retiro rechazado'}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {result === 'success'
              ? `${formatCurrency(num)} enviados a tu cuenta bancaria. Disponible en 24-48h.`
              : 'El límite de retiro por transacción es $500.00. Intenta con un monto menor.'}
          </p>
        </div>
        <button className="btn btn-primary btn-full" onClick={() => go('dashboard')} id="withdraw-back">
          Volver al Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border-default)', flexShrink: 0 }}>
        <button onClick={() => go('dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}>
          <ArrowLeft size={20} />
        </button>
        <h2 style={{ fontWeight: 700, fontSize: '1rem' }}>Retirar Fondos</h2>
      </div>

      <form onSubmit={handleWithdraw} style={{ flex: 1, padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
          padding: '14px 16px',
          textAlign: 'center',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
        }}>
          Saldo disponible: <strong style={{ color: 'var(--text-primary)', fontSize: '1.1rem' }}>{formatCurrency(state.balance)}</strong>
        </div>

        <div className="form-group">
          <label className="form-label">Cuenta bancaria destino</label>
          <input
            type="text"
            className="form-input"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            placeholder="Número de cuenta"
            id="withdraw-account"
          />
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Banco Pichincha — Cuenta de ahorros</p>
        </div>

        <div className="form-group">
          <label className="form-label">Monto a retirar</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontWeight: 700, fontSize: '1.1rem' }}>$</span>
            <input
              type="number"
              className={`form-input ${insufficientFunds ? 'error' : ''}`}
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              step="0.01"
              required
              id="withdraw-amount"
              style={{ paddingLeft: 30 }}
            />
          </div>
          {insufficientFunds && (
            <div className="alert alert-error" style={{ marginTop: 6 }}>
              <span>⚠</span><span>Fondos insuficientes</span>
            </div>
          )}
          {num > 500 && !insufficientFunds && (
            <div className="alert alert-warning" style={{ marginTop: 6 }}>
              <span>⚠</span><span>Monto supera el límite de $500 — será rechazado</span>
            </div>
          )}
        </div>

        <div className="alert alert-info" style={{ fontSize: '0.78rem' }}>
          <span>ℹ</span>
          <span>Comisión: $0.50 por retiro. Procesado en 24-48 horas hábiles.</span>
        </div>

        <div style={{ flex: 1 }} />

        <button
          type="submit"
          className="btn btn-primary btn-full btn-lg"
          disabled={loading || !amount || insufficientFunds}
          id="withdraw-submit"
          style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
        >
          {loading ? <><span className="spinner" /> Procesando...</> : 'Retirar Fondos'}
        </button>
      </form>
    </div>
  );
}
