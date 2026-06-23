import { formatCurrency, formatDateTime } from '../../../utils/helpers';

export default function TransactionDetail({ tx, onClose }) {
  if (!tx) return null;

  const isIngreso = tx.type === 'ingreso';

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'flex-end',
        borderRadius: 'inherit',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
        padding: '20px',
        width: '100%',
        animation: 'slideInUp 300ms ease',
        maxHeight: '85%',
        overflowY: 'auto',
      }}>
        {/* Handle */}
        <div style={{ width: 36, height: 4, background: 'var(--bg-tertiary)', borderRadius: 2, margin: '0 auto 20px' }} />

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            width: 56, height: 56,
            borderRadius: '50%',
            background: isIngreso ? 'var(--success-bg)' : 'var(--danger-bg)',
            border: `2px solid ${isIngreso ? 'var(--success)' : 'var(--danger)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 12px',
            fontSize: '1.5rem',
          }}>
            {isIngreso ? '↓' : '↑'}
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: isIngreso ? 'var(--success)' : 'var(--text-primary)', marginBottom: 4 }}>
            {isIngreso ? '+' : '-'}{formatCurrency(tx.amount)}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{tx.description}</p>
          <div style={{ marginTop: 8 }}>
            <span className={`badge ${tx.status === 'exitoso' ? 'badge-success' : 'badge-danger'}`}>
              {tx.status === 'exitoso' ? '✓ Exitoso' : '✗ Fallido'}
            </span>
          </div>
        </div>

        {/* Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[
            { label: 'ID Transacción',    value: tx.id,              mono: true  },
            { label: 'Fecha y hora',       value: formatDateTime(tx.date)         },
            { label: 'Contraparte',        value: tx.counterpart                  },
            { label: 'Referencia',         value: tx.reference,       mono: true  },
            { label: 'Comisión',           value: formatCurrency(tx.fee || 0)     },
            { label: 'Pasarela',           value: tx.gateway                      },
          ].map((row, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 0',
              borderBottom: '1px solid var(--border-default)',
              gap: 8,
            }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', flexShrink: 0 }}>{row.label}</span>
              <span style={{
                fontSize: '0.78rem',
                fontWeight: 600,
                textAlign: 'right',
                wordBreak: 'break-all',
                fontFamily: row.mono ? 'var(--font-mono)' : undefined,
                color: 'var(--text-primary)',
              }}>
                {row.value}
              </span>
            </div>
          ))}

          {/* Audit section */}
          <div style={{
            marginTop: 16,
            background: 'rgba(124,58,237,0.06)',
            border: '1px solid rgba(124,58,237,0.15)',
            borderRadius: 'var(--radius-md)',
            padding: '12px',
          }}>
            <p style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--brand-light)', letterSpacing: '0.08em', marginBottom: 8, textTransform: 'uppercase' }}>
              🔒 Datos de Auditoría
            </p>
            {[
              { label: 'Hash', value: tx.hash },
              { label: 'Timestamp servidor', value: formatDateTime(tx.serverTimestamp) },
              { label: 'IP Origen', value: tx.ipOrigin },
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{row.label}</span>
                <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--brand-light)', textAlign: 'right', wordBreak: 'break-all' }}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button
          className="btn btn-ghost btn-full"
          style={{ marginTop: 16 }}
          onClick={onClose}
          id="tx-detail-close"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
