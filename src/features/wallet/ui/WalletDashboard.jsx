import { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { formatCurrency, formatDate, formatTime, getGreeting } from '../../../utils/helpers';
import TransactionDetail from './TransactionDetail';

const ACTION_BUTTONS = [
  { id: 'send',     label: 'Enviar',   screen: 'send',     icon: '↑', color: '#7c3aed' },
  { id: 'qr',       label: 'QR',       screen: 'qr',       icon: '⬛', color: '#06b6d4' },
  { id: 'recharge', label: 'Recargar', screen: 'recharge', icon: '+', color: '#10b981' },
  { id: 'withdraw', label: 'Retirar',  screen: 'withdraw', icon: '↓', color: '#f59e0b' },
];

export default function WalletDashboard() {
  const { state, dispatch } = useApp();
  const [selectedTx, setSelectedTx] = useState(null);

  const go = (screen) => dispatch({ type: 'SET_WALLET_SCREEN', payload: screen });

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{getGreeting()},</p>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{state.currentUser?.name?.split(' ')[0]} 👋</h2>
        </div>
        <div
          style={{
            width: 38, height: 38,
            borderRadius: '50%',
            background: 'var(--brand-gradient)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: '0.85rem',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-brand)',
          }}
          onClick={() => dispatch({ type: 'LOGOUT' })}
          title="Cerrar sesión"
        >
          {state.currentUser?.avatar}
        </div>
      </div>

      {/* Balance Card */}
      <div style={{ padding: '16px 20px' }}>
        <div style={{
          background: 'var(--brand-gradient)',
          borderRadius: 'var(--radius-xl)',
          padding: '20px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(124,58,237,0.35)',
        }}>
          {/* Decorative circles */}
          <div style={{
            position: 'absolute', top: -20, right: -20,
            width: 100, height: 100,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
          }} />
          <div style={{
            position: 'absolute', bottom: -30, right: 30,
            width: 80, height: 80,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
          }} />

          <p style={{ fontSize: '0.72rem', fontWeight: 600, opacity: 0.8, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>
            Saldo disponible
          </p>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }} className="animate-fade-in">
            {formatCurrency(state.balance)}
          </div>
          <div style={{
            marginTop: 14,
            paddingTop: 14,
            borderTop: '1px solid rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: '0.72rem', opacity: 0.75 }}>Tarjeta •••• 4532</span>
            <span style={{ fontSize: '0.72rem', opacity: 0.75 }}>🔒 Segura</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ padding: '0 20px 16px', flexShrink: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {ACTION_BUTTONS.map((btn) => (
            <button
              key={btn.id}
              id={`wallet-action-${btn.id}`}
              onClick={() => go(btn.screen)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                padding: '12px 8px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-lg)',
                cursor: 'pointer',
                transition: 'all var(--transition-base)',
                color: 'var(--text-primary)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = btn.color + '60';
                e.currentTarget.style.background = btn.color + '15';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border-default)';
                e.currentTarget.style.background = 'var(--bg-secondary)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                width: 32, height: 32,
                borderRadius: '50%',
                background: btn.color + '20',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1rem', color: btn.color, fontWeight: 700,
              }}>
                {btn.icon}
              </div>
              <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{btn.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Transactions */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '0 20px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 700 }}>Últimos movimientos</h3>
          <span style={{ fontSize: '0.72rem', color: 'var(--brand-light)', fontWeight: 600, cursor: 'pointer' }}>Ver todos</span>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px 20px' }} className="stagger-children">
          {state.transactions.slice(0, 8).map((tx) => (
            <div
              key={tx.id}
              className={`tx-item ${tx.type}`}
              onClick={() => setSelectedTx(tx)}
              id={`tx-${tx.id}`}
            >
              <div className={`tx-icon ${tx.type}`}>
                {tx.type === 'ingreso' ? '↓' : '↑'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '0.82rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {tx.description}
                </p>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {formatDate(tx.date)} · {formatTime(tx.date)}
                </p>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <p style={{
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: tx.type === 'ingreso' ? 'var(--success)' : 'var(--text-primary)',
                }}>
                  {tx.type === 'ingreso' ? '+' : '-'}{formatCurrency(tx.amount)}
                </p>
                <span style={{
                  fontSize: '0.65rem',
                  background: tx.status === 'exitoso' ? 'var(--success-bg)' : 'var(--danger-bg)',
                  color: tx.status === 'exitoso' ? 'var(--success)' : 'var(--danger)',
                  padding: '1px 6px',
                  borderRadius: 'var(--radius-full)',
                }}>
                  {tx.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction Detail Modal */}
      {selectedTx && (
        <TransactionDetail tx={selectedTx} onClose={() => setSelectedTx(null)} />
      )}
    </div>
  );
}
