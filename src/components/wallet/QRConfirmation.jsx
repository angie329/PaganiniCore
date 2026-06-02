import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_MERCHANT } from '../../data/mockData';
import { formatCurrency, generateTxId, generateRef, generateHash } from '../../utils/helpers';
import { ArrowLeft } from 'lucide-react';

export default function QRConfirmation() {
  const { state, dispatch } = useApp();
  const [amount, setAmount] = useState('25.00');

  const go = (screen) => dispatch({ type: 'SET_WALLET_SCREEN', payload: screen });

  const handlePay = () => {
    const num = parseFloat(amount);
    if (!num || num <= 0) return;
    dispatch({
      type: 'SET_PIN_CONTEXT',
      payload: {
        action: 'QR_PAYMENT',
        payload: {
          id: generateTxId(),
          type: 'egreso',
          amount: num,
          description: `Pago en ${MOCK_MERCHANT.name}`,
          counterpart: MOCK_MERCHANT.name,
          counterpartEmail: 'cobros@suplaier.com',
          date: new Date().toISOString(),
          status: 'exitoso',
          category: 'comercio',
          fee: Math.round(num * 0.01 * 100) / 100,
          reference: generateRef(),
          hash: generateHash(),
          serverTimestamp: new Date().toISOString(),
          ipOrigin: '190.95.14.32',
          gateway: 'PlaceToPay',
          pipeline: ['app_cliente', 'api_gateway', 'core_db', 'core_paganini', 'gateway_externo'],
        },
      },
    });
  };

  const num = parseFloat(amount) || 0;
  const canPay = num > 0 && num <= state.balance;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border-default)', flexShrink: 0 }}>
        <button onClick={() => go('qr')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}>
          <ArrowLeft size={20} />
        </button>
        <h2 style={{ fontWeight: 700, fontSize: '1rem' }}>Confirmar Pago</h2>
      </div>

      <div style={{ flex: 1, padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Merchant Card */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-xl)',
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}>
          <div style={{
            width: 52, height: 52,
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, #06b6d4, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: '1.1rem', color: 'white', flexShrink: 0,
          }}>
            {MOCK_MERCHANT.logo}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <h3 style={{ fontWeight: 700, fontSize: '0.95rem' }}>{MOCK_MERCHANT.name}</h3>
              {MOCK_MERCHANT.verified && (
                <span style={{ fontSize: '0.65rem', background: 'var(--success-bg)', color: 'var(--success)', border: '1px solid var(--success-border)', borderRadius: 'var(--radius-full)', padding: '1px 6px' }}>
                  ✓ Verificado
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{MOCK_MERCHANT.category}</p>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>RUC: {MOCK_MERCHANT.ruc}</p>
          </div>
        </div>

        {/* QR verified badge */}
        <div className="alert alert-success">
          <span>✓</span>
          <span>Comercio verificado en red <strong>Paganini</strong></span>
        </div>

        {/* Amount */}
        <div className="form-group">
          <label className="form-label">Monto a pagar</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontWeight: 700, fontSize: '1.1rem' }}>$</span>
            <input
              type="number"
              className="form-input"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
              min="0.01"
              id="qr-amount"
              style={{ paddingLeft: 30, fontSize: '1.3rem', fontWeight: 700, textAlign: 'center' }}
            />
          </div>
          {num > state.balance && (
            <div className="alert alert-error" style={{ marginTop: 8 }}>
              <span>⚠</span><span>Fondos insuficientes</span>
            </div>
          )}
        </div>

        {/* Fee note */}
        {num > 0 && (
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            Comisión de red: {formatCurrency(Math.round(num * 0.01 * 100) / 100)} (1%)
          </div>
        )}

        <div style={{ flex: 1 }} />

        <button
          className="btn btn-primary btn-full btn-lg"
          onClick={handlePay}
          disabled={!canPay}
          id="qr-confirm-pay"
          style={{ background: 'linear-gradient(135deg, #06b6d4, #7c3aed)' }}
        >
          Pagar → Validar PIN
        </button>
      </div>
    </div>
  );
}
