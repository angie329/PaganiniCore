import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

// Paganini SVG Logo
function PaganiniLogo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="paganiniLogoGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="12" fill="url(#paganiniLogoGrad)" />
      {/* Stylized 'P' lettermark with soundwave/chip motif */}
      <path
        d="M12 10 L12 30 M12 10 L20 10 C24 10 27 13 27 17 C27 21 24 24 20 24 L12 24"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Dot accent — transaction node */}
      <circle cx="28" cy="28" r="3" fill="white" />
      <circle cx="28" cy="28" r="1.5" fill="#10b981" />
    </svg>
  );
}

const PERSPECTIVES = [
  {
    id: 'wallet',
    title: 'Billetera B2C',
    subtitle: 'App Móvil del Usuario',
    description: 'Billetera digital para usuarios finales. Permite transferencias P2P inmediatas, cobros con código QR dinámico y retiros con verificación de PIN.',
    path: '/wallet',
    icon: '📱',
    badge: 'B2C · Cliente Final',
    badgeColor: 'var(--brand-primary)',
    badgeBg: 'rgba(16, 185, 129, 0.12)',
    badgeBorder: 'rgba(16, 185, 129, 0.3)',
    tags: ['P2P Transfer', 'QR Scanner', 'PIN Auth', 'Mock Adapter'],
    colorClass: 'wallet',
    iconBg: 'linear-gradient(135deg, #10b981, #059669)',
    accentColor: '#10b981',
  },
  {
    id: 'embedded',
    title: 'SDK de Pasarela',
    subtitle: 'Widget Embebido B2B',
    description: 'SDK embebible para plataformas externas como Suplaier. Checkout inline que debita directamente de la billetera Paganini con confirmación instantánea.',
    path: '/embedded',
    icon: '🔌',
    badge: 'B2B · SDK Embebido',
    badgeColor: 'var(--brand-secondary)',
    badgeBg: 'rgba(6, 182, 212, 0.12)',
    badgeBorder: 'rgba(6, 182, 212, 0.3)',
    tags: ['Inline Checkout', 'B2B Integration', 'E-commerce', 'Instant Debit'],
    colorClass: 'embedded',
    iconBg: 'linear-gradient(135deg, #06b6d4, #0284c7)',
    accentColor: '#06b6d4',
  },
  {
    id: 'auditor',
    title: 'Consola de Auditoría',
    subtitle: 'Integridad y Trazabilidad',
    description: 'Herramienta de supervisión para auditores independientes. Verifica la integridad matemática de saldos, hashes SHA-256 de transacciones y estados de seguridad.',
    path: '/auditor',
    icon: '🛡️',
    badge: 'Gobierno · Auditoría',
    badgeColor: 'var(--warning)',
    badgeBg: 'rgba(245, 158, 11, 0.12)',
    badgeBorder: 'rgba(245, 158, 11, 0.3)',
    tags: ['Audit Trails', 'SHA-256 Hash', 'Integridad', 'Alertas PIN'],
    colorClass: 'auditor',
    iconBg: 'linear-gradient(135deg, #f59e0b, #d97706)',
    accentColor: '#f59e0b',
  },
  {
    id: 'admin',
    title: 'Consola de Administración',
    subtitle: 'Backoffice y Gestión',
    description: 'Panel operativo para la entidad financiera. Métricas en tiempo real, conciliación de operaciones B2B/B2C, gestión de llaves API y exportación formal de reportes.',
    path: '/admin',
    icon: '⚙️',
    badge: 'Gestión · Operaciones',
    badgeColor: 'var(--brand-light)',
    badgeBg: 'rgba(52, 211, 153, 0.12)',
    badgeBorder: 'rgba(52, 211, 153, 0.3)',
    tags: ['Analytics', 'Conciliación', 'API Keys', 'Recharts'],
    colorClass: 'admin',
    iconBg: 'linear-gradient(135deg, #059669, #10b981)',
    accentColor: '#10b981',
  },
];

export default function Hub() {
  const navigate = useNavigate();
  const { state } = useApp();

  const balance = state.balance.toFixed(2);

  return (
    <div className="hub-bg" style={{ minHeight: '100vh' }}>
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <header style={{ padding: '32px 40px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <PaganiniLogo size={44} />
            <div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>Paganini</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Ecosystem Demo</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => navigate('/landing')}
              style={{
                fontSize: '0.78rem',
                padding: '6px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span>⚡</span> Vista Producción
            </button>
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-glass)',
              borderRadius: 'var(--radius-full)',
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              backdropFilter: 'blur(12px)',
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 6px var(--success)' }} />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                Saldo global: <strong style={{ color: 'var(--text-primary)' }}>${balance}</strong>
              </span>
            </div>
          </div>
        </header>

        {/* Hero */}
        <div style={{ textAlign: 'center', padding: '52px 24px 40px', maxWidth: 700, margin: '0 auto' }} className="animate-fade-in-up">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)',
            borderRadius: 'var(--radius-full)', padding: '6px 16px',
            fontSize: '0.78rem', fontWeight: 600, color: 'var(--brand-light)',
            marginBottom: 20, letterSpacing: '0.04em',
          }}>
            <span>✦</span> PROTOTIPO INTERACTIVO FULL-STACK MOCK
          </div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 800, lineHeight: 1.15, marginBottom: 16 }}>
            Ecosistema{' '}
            <span style={{ background: 'var(--brand-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Paganini
            </span>
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 560, margin: '0 auto' }}>
            Plataforma fintech de pagos digitales. Selecciona una perspectiva para explorar la experiencia completa del ecosistema.
          </p>
        </div>

        {/* Cards Grid */}
        <div style={{ padding: '0 24px 60px', maxWidth: 960, margin: '0 auto' }}>
          <div className="hub-grid stagger-children">
            {PERSPECTIVES.map((p) => (
              <div
                key={p.id}
                className={`hub-card ${p.colorClass}`}
                onClick={() => navigate(p.path)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && navigate(p.path)}
                style={{ outline: 'none' }}
              >
                {/* Icon */}
                <div className="hub-card-icon" style={{ background: p.iconBg, boxShadow: `0 8px 24px ${p.accentColor}33` }}>
                  <span style={{ fontSize: '1.5rem' }}>{p.emoji}</span>
                </div>

                {/* Badges */}
                <div style={{ marginBottom: 10 }}>
                  <span style={{
                    fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em',
                    color: p.accentColor, textTransform: 'uppercase',
                  }}>
                    {p.subtitle}
                  </span>
                </div>

                {/* Title */}
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 10, color: 'var(--text-primary)' }}>
                  {p.title}
                </h2>

                {/* Description */}
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
                  {p.description}
                </p>

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {p.tags.map((tag) => (
                    <span key={tag} style={{
                      background: `${p.accentColor}15`,
                      border: `1px solid ${p.accentColor}30`,
                      color: p.accentColor,
                      borderRadius: 'var(--radius-full)',
                      padding: '2px 10px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Arrow */}
                <div style={{
                  position: 'absolute', top: 24, right: 24,
                  width: 32, height: 32,
                  background: `${p.accentColor}15`,
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1rem',
                  transition: 'all var(--transition-base)',
                }}>
                  →
                </div>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 32 }}>
            Estado compartido entre perspectivas — las acciones en una vista se reflejan en las demás
          </p>
        </div>
      </div>
    </div>
  );
}
