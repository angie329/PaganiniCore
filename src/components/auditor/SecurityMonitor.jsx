import { useApp } from '../../context/AppContext';
import { formatDateTime } from '../../utils/helpers';

const ALERT_CONFIG = {
  pin_block:       { icon: '🔒', label: 'PIN Bloqueado',          badgeClass: 'badge-danger' },
  pin_unblock:     { icon: '🔓', label: 'PIN Desbloqueado',       badgeClass: 'badge-success' },
  risky_card:      { icon: '💳', label: 'Tarjeta Riesgosa',       badgeClass: 'badge-warning' },
  unusual_access:  { icon: '🚨', label: 'Acceso Inusual',         badgeClass: 'badge-danger' },
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
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 4 }}>Monitoreo de Seguridad</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Alertas de seguridad en tiempo real. Las acciones en la billetera generan entradas automáticamente.
        </p>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Total Alertas',  value: counts.total, color: 'var(--brand-primary)',  bg: 'rgba(124,58,237,0.1)',  border: 'rgba(124,58,237,0.25)' },
          { label: 'Severidad Alta', value: counts.alta,  color: 'var(--danger)',          bg: 'var(--danger-bg)',      border: 'var(--danger-border)' },
          { label: 'Severidad Media',value: counts.media, color: 'var(--warning)',         bg: 'var(--warning-bg)',     border: 'var(--warning-border)' },
          { label: 'Severidad Baja', value: counts.baja,  color: 'var(--success)',         bg: 'var(--success-bg)',     border: 'var(--success-border)' },
        ].map((s, i) => (
          <div key={i} style={{
            background: s.bg,
            border: `1px solid ${s.border}`,
            borderRadius: 'var(--radius-lg)',
            padding: '16px',
          }}>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
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
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: '0.72rem', color: 'var(--success)', fontWeight: 600 }}>LIVE</span>
          </div>
        </div>

        {alerts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🛡️</div>
            <p>No hay alertas de seguridad registradas.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {alerts.map((alert) => {
              const cfg = ALERT_CONFIG[alert.type] || { icon: '⚠', label: alert.type, badgeClass: 'badge-muted' };
              return (
                <div key={alert.id} className="alert-feed-item" id={`alert-${alert.id}`}>
                  <div className={`alert-dot ${alert.severity}`} />
                  <div style={{ fontSize: '1.2rem', flexShrink: 0 }}>{cfg.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                      <span className={`badge ${cfg.badgeClass}`}>{cfg.label}</span>
                      <span className="badge badge-muted" style={{ fontSize: '0.65rem' }}>
                        Severidad: {alert.severity.toUpperCase()}
                      </span>
                      {alert.resolved && (
                        <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>Resuelto</span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.85rem', fontWeight: 500, marginBottom: 2 }}>{alert.message}</p>
                    <div style={{ display: 'flex', gap: 16, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      <span>👤 {alert.user}</span>
                      <span>🕒 {formatDateTime(alert.timestamp)}</span>
                      <span style={{ fontFamily: 'var(--font-mono)' }}>{alert.id}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 14 }}>
        💡 Las alertas se generan en tiempo real cuando el usuario activa bloqueos o acciones de seguridad desde la Billetera Digital.
      </p>
    </div>
  );
}
