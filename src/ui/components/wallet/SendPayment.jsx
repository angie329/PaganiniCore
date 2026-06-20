import { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { useWallet } from '../../hooks/useWallet';
import { formatCurrency, generateTxId, generateRef, generateHash } from '../../../utils/helpers';
import { ArrowLeft } from 'lucide-react';

export default function SendPayment() {
  const { state, dispatch } = useApp();
  const wallet = useWallet();
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [contactStatus, setContactStatus] = useState(null); // null | 'found' | 'not-found'
  const [contactUser, setContactUser] = useState(null);
  const [amountError, setAmountError] = useState('');
  const [mockUsers, setMockUsers] = useState(null);

  useEffect(() => {
    wallet.getUsers().then(setMockUsers);
  }, [wallet]);

  const go = (screen) => dispatch({ type: 'SET_WALLET_SCREEN', payload: screen });

  const validateEmail = (val, users) => {
    const lv = val.toLowerCase().trim();
    if (!lv || !users) { setContactStatus(null); setContactUser(null); return; }
    const user = users[lv];
    if (user && lv !== state.currentUser?.email) {
      setContactStatus('found');
      setContactUser(user);
    } else {
      setContactStatus('not-found');
      setContactUser(null);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    validateEmail(e.target.value, mockUsers);
  };

  const handleAmountChange = (e) => {
    const val = e.target.value;
    setAmount(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > state.balance) {
      setAmountError('Fondos insuficientes');
    } else {
      setAmountError('');
    }
  };

  const canSend = contactStatus === 'found' && parseFloat(amount) > 0 && !amountError;

  const handleProceed = () => {
    const num = parseFloat(amount);
    if (!canSend) return;
    // Set PIN context with the payment data
    dispatch({
      type: 'SET_PIN_CONTEXT',
      payload: {
        action: 'SEND_PAYMENT',
        payload: {
          id: generateTxId(),
          type: 'egreso',
          amount: num,
          description: `Transferencia enviada`,
          counterpart: contactUser.name,
          counterpartEmail: email.toLowerCase(),
          date: new Date().toISOString(),
          status: 'exitoso',
          category: 'transferencia',
          fee: 0,
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

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border-default)', flexShrink: 0 }}>
        <button onClick={() => go('dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}>
          <ArrowLeft size={20} />
        </button>
        <h2 style={{ fontWeight: 700, fontSize: '1rem' }}>Enviar Pago</h2>
      </div>

      <div style={{ flex: 1, padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Balance pill */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-full)',
          padding: '8px 16px',
          textAlign: 'center',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
        }}>
          Saldo disponible: <strong style={{ color: 'var(--text-primary)' }}>{formatCurrency(state.balance)}</strong>
        </div>

        {/* Email field */}
        <div className="form-group">
          <label className="form-label">Correo del destinatario</label>
          <input
            type="email"
            className={`form-input ${contactStatus === 'found' ? 'success' : contactStatus === 'not-found' ? 'error' : ''}`}
            placeholder="destinatario@espol.edu.ec"
            value={email}
            onChange={handleEmailChange}
            id="send-email"
            autoComplete="off"
          />
          {contactStatus === 'found' && contactUser && (
            <div className="alert alert-success" style={{ marginTop: 8 }}>
              <span>✓</span>
              <span><strong>{contactUser.name}</strong> — cuenta verificada</span>
            </div>
          )}
          {contactStatus === 'not-found' && (
            <div className="alert alert-error" style={{ marginTop: 8 }}>
              <span>✗</span>
              <span>Usuario no encontrado en la red Paganini</span>
            </div>
          )}
        </div>

        {/* Amount field */}
        <div className="form-group">
          <label className="form-label">Monto a enviar ($)</label>
          <div style={{ position: 'relative' }}>
            <span style={{
              position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
              color: 'var(--text-muted)', fontWeight: 700, fontSize: '1rem',
            }}>$</span>
            <input
              type="number"
              className={`form-input ${amountError ? 'error' : ''}`}
              placeholder="0.00"
              value={amount}
              onChange={handleAmountChange}
              min="0.01"
              step="0.01"
              id="send-amount"
              style={{ paddingLeft: 30 }}
            />
          </div>
          {amountError && (
            <div className="alert alert-error" style={{ marginTop: 8 }}>
              <span>⚠</span>
              <span>{amountError}</span>
            </div>
          )}
        </div>

        {/* Description (optional) */}
        <div className="form-group">
          <label className="form-label">Concepto (opcional)</label>
          <input
            type="text"
            className="form-input"
            placeholder="¿Para qué es este pago?"
            id="send-description"
          />
        </div>

        <div style={{ flex: 1 }} />

        <button
          className="btn btn-primary btn-full btn-lg"
          onClick={handleProceed}
          disabled={!canSend}
          id="send-proceed"
        >
          Continuar → Validar PIN
        </button>
      </div>
    </div>
  );
}
