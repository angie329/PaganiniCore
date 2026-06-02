import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, generateTxId, generateRef, generateHash } from '../../utils/helpers';
import { ArrowLeft } from 'lucide-react';

export default function RechargeForm() {
  const { state, dispatch } = useApp();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // null | 'success' | 'declined'

  const go = (screen) => dispatch({ type: 'SET_WALLET_SCREEN', payload: screen });

  const handleRecharge = async (e) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!num || num <= 0) return;

    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    setLoading(false);

    if (num > 500) {
      setResult('declined');
    } else {
      setResult('success');
      dispatch({
        type: 'ADD_TRANSACTION',
        payload: {
          id: generateTxId(),
          type: 'ingreso',
          amount: num,
          description: 'Recarga con tarjeta',
          counterpart: 'Tarjeta **** 4532',
          counterpartEmail: null,
          date: new Date().toISOString(),
          status: 'exitoso',
          category: 'recarga',
          fee: 0,
          reference: generateRef(),
          hash: generateHash(),
          serverTimestamp: new Date().toISOString(),
          ipOrigin: '190.95.14.32',
          gateway: 'PayPal',
          pipeline: ['app_cliente', 'api_gateway', 'core_db', 'core_paganini', 'gateway_externo'],
        },
      });
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
            {result === 'success' ? '¡Recarga exitosa!' : 'Tarjeta declinada'}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {result === 'success'
              ? `Se acreditaron ${formatCurrency(parseFloat(amount))} a tu cuenta.`
              : 'El límite de recarga por transacción es $500.00. Intenta con un monto menor.'}
          </p>
        </div>
        {result === 'success' && (
          <div style={{
            background: 'var(--success-bg)',
            border: '1px solid var(--success-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '12px 20px',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: '0.78rem', color: 'var(--success-light)' }}>Nuevo saldo</p>
            <p style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--success)' }}>{formatCurrency(state.balance)}</p>
          </div>
        )}
        <button
          className="btn btn-primary btn-full"
          onClick={() => { setResult(null); setAmount(''); }}
          id="recharge-try-again"
        >
          {result === 'success' ? 'Volver al inicio' : 'Intentar de nuevo'}
        </button>
        <button className="btn btn-ghost btn-full" onClick={() => go('dashboard')}>
          Ir al Dashboard
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
        <h2 style={{ fontWeight: 700, fontSize: '1rem' }}>Recargar Saldo</h2>
      </div>

      <form onSubmit={handleRecharge} style={{ flex: 1, padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Card display */}
        <div style={{
          background: 'linear-gradient(135deg, #1e3a5f, #2d5a8e)',
          borderRadius: 'var(--radius-xl)',
          padding: '20px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -15, right: -15, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
          <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em', marginBottom: 16 }}>TARJETA VINCULADA</p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', letterSpacing: '0.2em', marginBottom: 12 }}>•••• •••• •••• 4532</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>
            <span>Matías Calderón</span>
            <span>12/27</span>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Monto a recargar</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontWeight: 700, fontSize: '1.1rem' }}>$</span>
            <input
              type="number"
              className="form-input"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              max="10000"
              step="0.01"
              required
              id="recharge-amount"
              style={{ paddingLeft: 30 }}
            />
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Máximo $500 por transacción</p>
        </div>

        {/* Quick amounts */}
        <div>
          <p className="form-label" style={{ marginBottom: 8 }}>Montos rápidos</p>
          <div style={{ display: 'flex', gap: 8 }}>
            {['20', '50', '100', '200'].map(q => (
              <button
                key={q}
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setAmount(q)}
                style={{ flex: 1, fontSize: '0.8rem', background: amount === q ? 'var(--brand-gradient)' : undefined, color: amount === q ? 'white' : undefined }}
              >
                ${q}
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1 }} />

        <button
          type="submit"
          className="btn btn-success btn-full btn-lg"
          disabled={loading || !amount}
          id="recharge-submit"
        >
          {loading ? <><span className="spinner" /> Procesando...</> : 'Recargar Saldo'}
        </button>
      </form>
    </div>
  );
}
