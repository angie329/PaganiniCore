import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, generateTxId, generateRef, generateHash } from '../../utils/helpers';

function PaganiniLogoSmall() {
  return (
    <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
      <defs>
        <linearGradient id="wgLogo" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="10" fill="url(#wgLogo)" />
      <path d="M12 10 L12 30 M12 10 L20 10 C24 10 27 13 27 17 C27 21 24 24 20 24 L12 24"
        stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="30" cy="28" r="2" fill="white" />
    </svg>
  );
}

export default function PaganiniPayWidget({ amount, merchantName, onClose, onSuccess }) {
  const { state, dispatch } = useApp();
  const [method, setMethod] = useState('wallet'); // 'wallet' | 'card'
  const [cardNumber, setCardNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // null | 'success' | 'rejected'
  const [pin, setPin] = useState('');
  const [pinStep, setPinStep] = useState(false);

  const handlePay = async () => {
    if (method === 'wallet') {
      if (state.balance < amount) return;
      setPinStep(true);
      return;
    }
    // Card payment
    setLoading(true);
    await new Promise(r => setTimeout(r, 2500));
    setLoading(false);
    const success = cardNumber.startsWith('4') && cardNumber.length >= 4;
    if (success) {
      setResult('success');
    } else {
      setResult('rejected');
    }
  };

  const handlePinSubmit = async () => {
    if (pin.length !== 4) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    if (pin === '0000') {
      dispatch({
        type: 'ADD_TRANSACTION',
        payload: {
          id: generateTxId(),
          type: 'egreso',
          amount,
          description: `Pago vía widget Paganini`,
          counterpart: 'Suplaier App',
          counterpartEmail: 'cobros@suplaier.com',
          date: new Date().toISOString(),
          status: 'exitoso',
          category: 'comercio',
          fee: Math.round(amount * 0.01 * 100) / 100,
          reference: generateRef(),
          hash: generateHash(),
          serverTimestamp: new Date().toISOString(),
          ipOrigin: '190.95.14.32',
          gateway: 'PlaceToPay',
          pipeline: ['app_cliente', 'api_gateway', 'core_db', 'core_paganini', 'gateway_externo'],
        },
      });
      setResult('success');
    } else {
      setResult('rejected');
    }
    setLoading(false);
    setPinStep(false);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(4px)',
      zIndex: 200,
      display: 'flex',
      alignItems: 'flex-end',
    }}>
      <div style={{
        width: '100%',
        background: 'var(--bg-secondary)',
        borderRadius: '24px 24px 0 0',
        padding: '0',
        animation: 'slideInUp 350ms ease',
        border: '1px solid var(--border-glass)',
        borderBottom: 'none',
        maxWidth: 600,
        margin: '0 auto',
      }}>
        {/* Widget Header — Paganini branded */}
        <div style={{
          background: 'var(--brand-gradient)',
          borderRadius: '24px 24px 0 0',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <PaganiniLogoSmall />
            <div>
              <p style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>Paganini Checkout</p>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem' }}>Pago seguro · TLS 1.3</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem' }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: '20px' }}>
          {result ? (
            /* Result screen */
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{
                width: 64, height: 64,
                borderRadius: '50%',
                background: result === 'success' ? 'var(--success-bg)' : 'var(--danger-bg)',
                border: `2px solid ${result === 'success' ? 'var(--success)' : 'var(--danger)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: '2rem',
                animation: 'fadeInScale 300ms ease',
              }}>
                {result === 'success' ? '✓' : '✗'}
              </div>
              <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 6, color: result === 'success' ? 'var(--success)' : 'var(--danger-light)' }}>
                {result === 'success' ? 'Pago Aprobado' : 'Pago Rechazado'}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 20 }}>
                {result === 'success'
                  ? `${formatCurrency(amount)} procesados exitosamente`
                  : 'La transacción fue rechazada. Verifica tus datos.'}
              </p>
              {result === 'success' && (
                <button
                  className="btn btn-success btn-full"
                  onClick={onSuccess}
                  id="widget-success-confirm"
                >
                  Ver confirmación en Suplaier →
                </button>
              )}
              {result === 'rejected' && (
                <button className="btn btn-ghost btn-full" onClick={() => { setResult(null); setPin(''); setCardNumber(''); }}>
                  Intentar con otro método
                </button>
              )}
            </div>
          ) : pinStep ? (
            /* PIN step for wallet payment */
            <div style={{ textAlign: 'center' }}>
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontWeight: 700, marginBottom: 4 }}>Confirma con tu PIN</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Autorizando {formatCurrency(amount)} desde tu billetera
                </p>
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={pin}
                  onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  style={{
                    width: 140, textAlign: 'center', letterSpacing: '0.5em',
                    fontSize: '1.5rem', fontWeight: 700,
                    background: 'var(--bg-tertiary)',
                    border: '2px solid var(--border-default)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)', outline: 'none',
                    padding: '12px',
                  }}
                  id="widget-pin"
                  placeholder="••••"
                  autoFocus
                />
              </div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 16 }}>
                PIN demo: <span style={{ fontFamily: 'var(--font-mono)' }}>0000</span>
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-ghost" onClick={() => setPinStep(false)} style={{ flex: 1 }}>Cancelar</button>
                <button
                  className="btn btn-primary"
                  onClick={handlePinSubmit}
                  disabled={loading || pin.length !== 4}
                  style={{ flex: 2 }}
                  id="widget-pin-confirm"
                >
                  {loading ? <><span className="spinner" /> Procesando...</> : 'Confirmar Pago'}
                </button>
              </div>
            </div>
          ) : (
            /* Payment selection */
            <>
              {/* Amount display */}
              <div style={{
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-md)',
                padding: '14px',
                textAlign: 'center',
                marginBottom: 20,
              }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 2 }}>Total a pagar</p>
                <p style={{ fontSize: '1.8rem', fontWeight: 800 }}>{formatCurrency(amount)}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{merchantName}</p>
              </div>

              {/* Payment method selector */}
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                Método de pago
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                {/* Wallet option */}
                <div
                  onClick={() => setMethod('wallet')}
                  style={{
                    padding: '14px 16px',
                    background: method === 'wallet' ? 'var(--brand-gradient-subtle)' : 'var(--bg-tertiary)',
                    border: `2px solid ${method === 'wallet' ? 'rgba(124,58,237,0.4)' : 'var(--border-default)'}`,
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 200ms',
                  }}
                  id="widget-method-wallet"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: '1.3rem' }}>💜</span>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>Saldo Paganini</p>
                      <p style={{ fontSize: '0.75rem', color: state.balance >= amount ? 'var(--success)' : 'var(--danger)' }}>
                        Disponible: {formatCurrency(state.balance)}
                        {state.balance < amount && ' ⚠ Insuficiente'}
                      </p>
                    </div>
                  </div>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${method === 'wallet' ? 'var(--brand-primary)' : 'var(--border-default)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {method === 'wallet' && <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--brand-primary)' }} />}
                  </div>
                </div>

                {/* Card option */}
                <div
                  onClick={() => setMethod('card')}
                  style={{
                    padding: '14px 16px',
                    background: method === 'card' ? 'var(--brand-gradient-subtle)' : 'var(--bg-tertiary)',
                    border: `2px solid ${method === 'card' ? 'rgba(124,58,237,0.4)' : 'var(--border-default)'}`,
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'all 200ms',
                  }}
                  id="widget-method-card"
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: method === 'card' ? 12 : 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: '1.3rem' }}>💳</span>
                      <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>Tarjeta Crédito/Débito</p>
                    </div>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${method === 'card' ? 'var(--brand-primary)' : 'var(--border-default)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {method === 'card' && <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--brand-primary)' }} />}
                    </div>
                  </div>
                  {method === 'card' && (
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Número de tarjeta (empieza con 4 = Visa)"
                      value={cardNumber}
                      onChange={e => setCardNumber(e.target.value)}
                      maxLength={16}
                      id="widget-card-number"
                      style={{ marginTop: 4 }}
                      onClick={e => e.stopPropagation()}
                    />
                  )}
                </div>
              </div>

              <button
                className="btn btn-primary btn-full btn-lg"
                onClick={handlePay}
                disabled={loading || (method === 'wallet' && state.balance < amount) || (method === 'card' && !cardNumber)}
                id="widget-pay-submit"
              >
                {loading ? <><span className="spinner" /> Procesando...</> : `Pagar ${formatCurrency(amount)}`}
              </button>

              <p style={{ textAlign: 'center', fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 10 }}>
                🔒 Cifrado TLS 1.3 · PCI DSS Compliant
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
