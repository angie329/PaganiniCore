import { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { msToMinSec } from '../../utils/helpers';
import { ArrowLeft } from 'lucide-react';

const CORRECT_PIN = '0000';

export default function PinScreen() {
  const { state, dispatch } = useApp();
  const [digits, setDigits] = useState(['', '', '', '']);
  const [pinState, setPinState] = useState('idle'); // idle | error | success | blocked | processing
  const [shake, setShake] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const refs = [useRef(), useRef(), useRef(), useRef()];

  // Check if already blocked
  useEffect(() => {
    if (state.pinBlockedUntil) {
      const remaining = state.pinBlockedUntil - Date.now();
      if (remaining > 0) {
        setPinState('blocked');
        setTimeLeft(remaining);
      } else {
        dispatch({ type: 'UNBLOCK_PIN' });
      }
    }
  }, [state.pinBlockedUntil]);

  // Countdown timer
  useEffect(() => {
    if (pinState !== 'blocked') return;
    const interval = setInterval(() => {
      const remaining = (state.pinBlockedUntil || 0) - Date.now();
      if (remaining <= 0) {
        clearInterval(interval);
        dispatch({ type: 'UNBLOCK_PIN' });
        setPinState('idle');
        setDigits(['', '', '', '']);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [pinState, state.pinBlockedUntil]);

  useEffect(() => {
    if (pinState === 'idle') refs[0].current?.focus();
  }, [pinState]);

  const handleDigit = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);

    if (value && index < 3) {
      refs[index + 1].current?.focus();
    }

    if (value && index === 3) {
      const pin = [...newDigits.slice(0, 3), value].join('');
      if (pin.length === 4) validatePin(pin, newDigits);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      refs[index - 1].current?.focus();
    }
  };

  const validatePin = async (pin, currentDigits) => {
    if (pin === CORRECT_PIN) {
      setPinState('processing');
      await new Promise(r => setTimeout(r, 1500));
      setPinState('success');
      await new Promise(r => setTimeout(r, 800));
      dispatch({ type: 'PIN_SUCCESS' });
      // Execute the pending action
      if (state.pinContext) {
        dispatch({ type: 'ADD_TRANSACTION', payload: state.pinContext.payload });
      }
    } else {
      setPinState('error');
      setShake(true);
      setTimeout(() => {
        setShake(false);
        setPinState('idle');
        setDigits(['', '', '', '']);
        refs[0].current?.focus();
      }, 600);
      dispatch({ type: 'PIN_ATTEMPT_FAILED' });
      // Check if now blocked after dispatch
      setTimeout(() => {
        if (state.pinAttempts + 1 >= 3) setPinState('blocked');
      }, 100);
    }
  };

  const go = (screen) => dispatch({ type: 'SET_WALLET_SCREEN', payload: screen });

  const attemptsLeft = 3 - state.pinAttempts;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border-default)', flexShrink: 0 }}>
        <button onClick={() => go('send')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }} disabled={pinState === 'processing'}>
          <ArrowLeft size={20} />
        </button>
        <h2 style={{ fontWeight: 700, fontSize: '1rem' }}>Validación PIN</h2>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 20px', gap: 28 }}>

        {pinState === 'blocked' ? (
          /* Blocked State */
          <div style={{ textAlign: 'center', animation: 'fadeInScale 300ms ease' }}>
            <div style={{
              width: 80, height: 80,
              borderRadius: '50%',
              background: 'var(--danger-bg)',
              border: '2px solid var(--danger)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '2rem',
              animation: 'lockShake 0.5s ease 3',
            }}>
              🔒
            </div>
            <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 8, color: 'var(--danger-light)' }}>
              Acceso Bloqueado
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 20 }}>
              3 intentos fallidos. Intenta en:
            </p>
            <div style={{
              background: 'var(--danger-bg)',
              border: '1px solid var(--danger-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px 24px',
              fontFamily: 'var(--font-mono)',
              fontSize: '2rem',
              fontWeight: 700,
              color: 'var(--danger-light)',
            }}>
              {msToMinSec(timeLeft)}
            </div>
          </div>
        ) : (
          /* Normal PIN input */
          <>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 64, height: 64,
                borderRadius: '50%',
                background: pinState === 'success' ? 'var(--success-bg)' : 'var(--brand-gradient-subtle)',
                border: `2px solid ${pinState === 'success' ? 'var(--success)' : 'rgba(124,58,237,0.3)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: '1.8rem',
                transition: 'all 300ms',
              }}>
                {pinState === 'success' ? '✓' : pinState === 'processing' ? <span className="spinner spinner-brand spinner-lg" /> : '🔑'}
              </div>
              <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 6 }}>
                {pinState === 'processing' ? 'Procesando pago...' : pinState === 'success' ? '¡Pago exitoso!' : 'Ingresa tu PIN'}
              </h3>
              {state.pinContext?.payload && pinState === 'idle' && (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Autorizando ${state.pinContext.payload.amount?.toFixed(2)} →{' '}
                  {state.pinContext.payload.counterpart}
                </p>
              )}
            </div>

            {/* PIN digits */}
            <div
              className={`pin-container ${shake ? 'animate-shake' : ''}`}
              style={{ position: 'relative' }}
            >
              {refs.map((ref, i) => (
                <input
                  key={i}
                  ref={ref}
                  type="tel"
                  inputMode="numeric"
                  maxLength={1}
                  className={`pin-digit ${pinState === 'error' ? 'error' : ''} ${pinState === 'success' ? 'success' : ''}`}
                  value={digits[i]}
                  onChange={(e) => handleDigit(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  disabled={pinState === 'processing' || pinState === 'success' || pinState === 'blocked'}
                  id={`pin-digit-${i}`}
                  autoComplete="off"
                />
              ))}
            </div>

            {/* Attempts warning */}
            {state.pinAttempts > 0 && pinState !== 'success' && (
              <div className="alert alert-warning" style={{ width: '100%', fontSize: '0.8rem' }}>
                <span>⚠</span>
                <span>{attemptsLeft} intento{attemptsLeft !== 1 ? 's' : ''} restante{attemptsLeft !== 1 ? 's' : ''}</span>
              </div>
            )}

            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              PIN demo: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>0000</span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
