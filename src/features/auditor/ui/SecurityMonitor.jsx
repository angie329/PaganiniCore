import { useApp } from '../../../context/AppContext';
import { formatDateTime } from '../../../utils/helpers';

const ALERT_CONFIG = {
  pin_block:       { icon: '🔒', label: 'PIN Bloqueado',          badgeClass: 'badge-danger',  status: 'En proceso' },
  pin_unblock:     { icon: '🔓', label: 'PIN Desbloqueado',       badgeClass: 'badge-success', status: 'Resuelto' },
  risky_card:      { icon: '💳', label: 'Tarjeta Riesgosa',       badgeClass: 'badge-warning', status: 'Pendiente' },
  unusual_access:  { icon: '🚨', label: 'Acceso Inusual',         badgeClass: 'badge-danger',  status: 'En proceso' },
};

const STATUS_BADGE = {
  'Resuelto':    'badge-success',
  'En proceso':  'badge-warning',
  'Pendiente':   'badge-muted',
};

const SEVERITY_ORDER = { alta: 0, media: 1, baja: 2 };

export default function SecurityMonitor() {
  const { state } = useApp();

  const alerts = [...state.securityAlerts].sort((a, b) =>
    (SEVERITY_ORDER[a.severity] ?? 3) - (SEVERITY_ORDER[b.severity] ?? 3)
  );

  const counts = {
    alta:   alerts.filter(a => a.severity === 'alta').length,
    media:  alerts.filter(a => a.severity === 'media').length,
    baja:   alerts.filter(a => a.severity === 'baja').length,
    total:  alerts.length,
  };

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 4, color: '#0f172a' }}>Monitoreo de Seguridad</h2>
        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
          Alertas de seguridad en tiempo real. Las acciones en la billetera generan entradas automáticamente.
        </p>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Total Alertas',   value: counts.total, color: '#7c3aed', bg: 'rgba(124,58,237,0.08)', border: 'rgba(124,58,237,0.2)' },
          { label: 'Severidad Alta',  value: counts.alta,  color: '#dc2626', bg: '#fef2f2',               border: '#fecaca' },
          { label: 'Severidad Media', value: counts.media, color: '#d97706', bg: '#fffbeb',               border: '#fde68a' },
          { label: 'Severidad Baja',  value: counts.baja,  color: '#16a34a', bg: '#f0fdf4',               border: '#bbf7d0' },
        ].map((s, i) => (
          <div key={i} style={{
            background: s.bg,
            border: `1px solid ${s.border}`,
            borderRadius: 'var(--radius-lg)',
            padding: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}>
            <p style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6, fontWeight: 600 }}>
              {s.label}
            </p>
            <p style={{ fontSize: '1.8rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Alert feed */}
      <div className="chart-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <p className="chart-title" style={{ margin: 0 }}>Feed de Alertas de Seguridad</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#16a34a', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600 }}>LIVE</span>
          </div>
        </div>

        {alerts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🛡️</div>
            <p>No hay alertas de seguridad registradas.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {alerts.map((alert) => {
              const cfg = ALERT_CONFIG[alert.type] || { icon: '⚠', label: alert.type, badgeClass: 'badge-muted', status: 'Pendiente' };
              const statusLabel = alert.resolved ? 'Resuelto' : cfg.status;
              const statusBadge = STATUS_BADGE[statusLabel] || 'badge-muted';

              // Context info based on alert type
              const contextInfo = [];
              if (alert.ip)  contextInfo.push(`🌐 IP: ${alert.ip}`);
              if (alert.txId) contextInfo.push(`📋 TX: ${alert.txId}`);

              return (
                <div key={alert.id} className="alert-feed-item" id={`alert-${alert.id}`}>
                  <div className={`alert-dot ${alert.severity}`} />
                  <div style={{ fontSize: '1.4rem', flexShrink: 0 }}>{cfg.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Badges row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
                      <span className={`badge ${cfg.badgeClass}`}>{cfg.label}</span>
                      <span className="badge badge-muted" style={{ fontSize: '0.65rem' }}>
                        Severidad: <strong>{alert.severity.toUpperCase()}</strong>
                      </span>
                      <span className={`badge ${statusBadge}`} style={{ fontSize: '0.65rem' }}>
                        {statusLabel}
                      </span>
                    </div>
                    {/* Message */}
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 4, color: '#0f172a' }}>{alert.message}</p>
                    {/* Metadata row */}
                    <div style={{ display: 'flex', gap: 14, fontSize: '0.72rem', color: '#64748b', flexWrap: 'wrap' }}>
                      <span>👤 {alert.user}</span>
                      <span>🕒 {formatDateTime(alert.timestamp)}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', color: '#7c3aed' }}>{alert.id}</span>
                      {contextInfo.map((info, i) => (
                        <span key={i} style={{ fontFamily: 'var(--font-mono)' }}>{info}</span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 14 }}>
        💡 Las alertas se generan en tiempo real cuando el usuario activa bloqueos o acciones de seguridad desde la Billetera Digital.
      </p>
    </div>
  );
}
