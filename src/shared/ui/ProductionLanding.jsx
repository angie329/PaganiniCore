import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Smartphone, Zap, Plug, Shield } from 'lucide-react';

function PaganiniLogo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <defs>
        <linearGradient id="landingLogoGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="12" fill="url(#landingLogoGrad)" />
      <path
        d="M12 10 L12 30 M12 10 L20 10 C24 10 27 13 27 17 C27 21 24 24 20 24 L12 24"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="28" cy="28" r="3" fill="white" />
      <circle cx="28" cy="28" r="1.5" fill="#10b981" />
    </svg>
  );
}

export default function ProductionLanding({ onToggleHub }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('sdk'); // 'sdk' | 'wallet' | 'compliance'
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const sdkCodeSnippet = `<script src="https://cdn.paganini.fin.ec/sdk/v1.js"></script>
<PaganiniPayWidget
  amount={45.00}
  merchantName="Suplaier B2B"
  onSuccess={handleOrderConfirmation}
/>`;

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(sdkCodeSnippet).catch(() => {});
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Top Banner de Ambiente */}
      <div className="landing-top-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            display: 'inline-block',
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: 'var(--brand-primary)',
            boxShadow: '0 0 8px var(--brand-primary)',
          }} />
          <span style={{ color: 'var(--text-secondary)' }}>
            Ecosistema Paganini · Arquitectura ADR-004 &amp; STD-002
          </span>
        </div>
        <button
          onClick={() => (onToggleHub ? onToggleHub() : navigate('/'))}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid var(--border-glass)',
            color: 'var(--brand-light)',
            borderRadius: 'var(--radius-full)',
            padding: '4px 14px',
            fontSize: '0.74rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background var(--transition-fast)',
          }}
        >
          ← Regresar al Selector Dev Hub
        </button>
      </div>

      {/* Header Principal */}
      <header className="landing-header">
        <div
          onClick={() => navigate('/landing')}
          style={{ display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}
        >
          <PaganiniLogo size={42} />
          <div>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Paganini</span>
            <span style={{
              marginLeft: 8,
              fontSize: '0.68rem',
              background: 'var(--brand-gradient-subtle)',
              border: '1px solid var(--border-glass)',
              color: 'var(--brand-light)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              fontWeight: 700,
              textTransform: 'uppercase',
            }}>
              Fintech OS
            </span>
          </div>
        </div>

        <nav className="landing-nav">
          <button onClick={() => navigate('/wallet')}>
            Billetera B2C
          </button>
          <button onClick={() => navigate('/embedded')}>
            Pasarela SDK B2B
          </button>
          <button onClick={() => navigate('/auditor')}>
            Auditoría
          </button>
          <button onClick={() => navigate('/admin')}>
            Administración
          </button>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => navigate('/wallet')}
          >
            Ingresar a Billetera
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigate('/embedded')}
          >
            Probar SDK Pasarela
          </button>
        </div>
      </header>

      {/* Hero Bimodal */}
      <section style={{
        padding: '60px 24px 44px',
        maxWidth: 1100,
        margin: '0 auto',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: 'var(--radius-full)',
          padding: '6px 16px',
          fontSize: '0.78rem',
          fontWeight: 600,
          color: 'var(--success-light)',
          marginBottom: 24,
        }}>
          <span>❆</span> MODELO HÍBRIDO B2B + B2C EN TIEMPO REAL
        </div>

        <h1 style={{
          fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
          fontWeight: 800,
          lineHeight: 1.15,
          letterSpacing: '-0.03em',
          marginBottom: 20,
          maxWidth: 900,
          margin: '0 auto 20px',
        }}>
          Infraestructura de Pagos Digitales para{' '}
          <span style={{
            background: 'var(--brand-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Personas y Comercios
          </span>
        </h1>

        <p style={{
          fontSize: '1.15rem',
          color: 'var(--text-secondary)',
          maxWidth: 680,
          margin: '0 auto 36px',
          lineHeight: 1.65,
        }}>
          Unifica transferencias móviles instantáneas para usuarios finales con un componente SDK web embebible para procesar cobros directos en plataformas externas.
        </p>

        {/* CTAs Principales */}
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 44 }}>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate('/wallet')}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 28px' }}
          >
            <Smartphone size={18} strokeWidth={1.5} /> Abrir Billetera Móvil
          </button>
          <button
            className="btn btn-ghost btn-lg"
            onClick={() => navigate('/embedded')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '14px 28px',
              border: '1px solid var(--border-hover)',
            }}
          >
            <Zap size={18} strokeWidth={1.5} /> Integrar SDK Pasarela
          </button>
        </div>

        {/* Indicadores de Desempeño */}
        <div className="landing-stats-grid">
          <div>
            <div style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--brand-light)' }}>
              $0.00
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>
              Comisión transferencias P2P
            </div>
          </div>
          <div className="landing-stats-border-x" style={{ borderLeft: '1px solid var(--border-default)', borderRight: '1px solid var(--border-default)' }}>
            <div style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--brand-light)' }}>
              &lt; 350ms
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>
              Tiempo medio de autorización
            </div>
          </div>
          <div>
            <div style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--brand-light)' }}>
              100%
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>
              Trazabilidad auditable inmutable
            </div>
          </div>
        </div>
      </section>

      {/* Navegación de Escaparates Técnicos */}
      <section style={{ maxWidth: 1100, margin: '30px auto 60px', padding: '0 24px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 12,
          marginBottom: 32,
          borderBottom: '1px solid var(--border-default)',
          paddingBottom: 16,
          flexWrap: 'wrap',
        }}>
          <button
            onClick={() => setActiveTab('sdk')}
            style={{
              padding: '10px 20px',
              borderRadius: 'var(--radius-full)',
              background: activeTab === 'sdk' ? 'var(--brand-gradient)' : 'transparent',
              color: activeTab === 'sdk' ? 'white' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              transition: 'background var(--transition-fast)',
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}
          >
            <Plug size={14} strokeWidth={1.5} /> SDK Pasarela Web (B2B)
          </button>
          <button
            onClick={() => setActiveTab('wallet')}
            style={{
              padding: '10px 20px',
              borderRadius: 'var(--radius-full)',
              background: activeTab === 'wallet' ? 'var(--brand-gradient)' : 'transparent',
              color: activeTab === 'wallet' ? 'white' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              transition: 'background var(--transition-fast)',
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}
          >
            <Smartphone size={14} strokeWidth={1.5} /> Billetera Móvil (B2C)
          </button>
          <button
            onClick={() => setActiveTab('compliance')}
            style={{
              padding: '10px 20px',
              borderRadius: 'var(--radius-full)',
              background: activeTab === 'compliance' ? 'var(--brand-gradient)' : 'transparent',
              color: activeTab === 'compliance' ? 'white' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              transition: 'background var(--transition-fast)',
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}
          >
            <Shield size={14} strokeWidth={1.5} /> Auditoría y Gobierno
          </button>
        </div>

        {/* Tab 1: SDK */}
        {activeTab === 'sdk' && (
          <div className="landing-two-col">
            <div>
              <div style={{
                color: 'var(--brand-secondary)',
                fontSize: '0.78rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 8,
              }}>
                Integración en Comercios
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 14 }}>
                Inyección Transaccional Inline
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
                El SDK empaqueta un widget React Web que plataformas de comercio electrónico como Suplaier incorporan sin desarrollar pasarelas propias. Soporta pago con saldo de billetera o tarjetas bancarias.
              </p>
              <div style={{
                background: 'var(--bg-primary)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-glass)',
                marginBottom: 16,
                position: 'relative',
              }}>
                <button
                  onClick={handleCopyCode}
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    fontSize: '0.72rem',
                    background: copiedSnippet ? 'var(--success)' : 'rgba(255,255,255,0.1)',
                    color: 'white',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-xs)',
                    cursor: 'pointer',
                    transition: 'background var(--transition-fast)',
                  }}
                >
                  {copiedSnippet ? '✓ Copiado' : 'Copiar fragmento'}
                </button>
                <div style={{ color: 'var(--text-muted)', marginBottom: 6 }}>// Invocación en aplicación cliente</div>
                <div>&lt;<span style={{ color: '#06b6d4' }}>PaganiniPayWidget</span></div>
                <div style={{ paddingLeft: 16 }}>amount=&#123;<span style={{ color: '#10b981' }}>45.00</span>&#125;</div>
                <div style={{ paddingLeft: 16 }}>merchantName=<span style={{ color: '#f59e0b' }}>&quot;Suplaier B2B&quot;</span></div>
                <div style={{ paddingLeft: 16 }}>onSuccess=&#123;handleOrderConfirmation&#125;</div>
                <div>/&gt;</div>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => navigate('/embedded')}
              >
                Ejecutar Simulación en Suplaier →
              </button>
            </div>

            <div style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-glass)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 10 }}>
                Vista Previa de Componente
              </div>
              <div style={{
                background: 'var(--bg-primary)',
                padding: '20px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-default)',
              }}>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 4 }}>Paganini Checkout</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 16 }}>Total a debitar: $45.00</div>
                <div style={{
                  padding: '10px',
                  background: 'var(--brand-gradient-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  color: 'var(--brand-light)',
                  marginBottom: 12,
                }}>
                  Saldo disponible: $1,250.00
                </div>
                <button
                  className="btn btn-primary btn-full btn-sm"
                  onClick={() => navigate('/embedded')}
                >
                  Abrir Modal de Pago
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Wallet */}
        {activeTab === 'wallet' && (
          <div className="landing-two-col-reverse">
            <div style={{
              background: 'var(--bg-primary)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              border: '1px solid var(--border-default)',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '2.4rem', marginBottom: 10 }}>📱</div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Billetera Digital B2C</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 6, marginBottom: 16 }}>
                Saldo actual sincronizado: <strong style={{ color: 'var(--brand-light)' }}>$1,250.00</strong>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => navigate('/wallet')}>
                  Transferencias P2P
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => navigate('/wallet')}>
                  Cobro con Código QR
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => navigate('/wallet')}>
                  Recarga y Retiro de Fondos
                </button>
              </div>
            </div>

            <div>
              <div style={{
                color: 'var(--brand-primary)',
                fontSize: '0.78rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 8,
              }}>
                Experiencia de Usuario Final
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 14 }}>
                Control Total de Fondos en Dispositivo
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
                Diseñada bajo arquitectura desacoplada para operar en iOS y Android. Garantiza protección de movimientos mediante código PIN, confirmaciones visuales inmediatas y sincronización con el historial transaccional.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => navigate('/wallet')}
              >
                Abrir Aplicación B2C →
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Compliance */}
        {activeTab === 'compliance' && (
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-xl)',
            padding: '36px',
          }}>
            <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 28px' }}>
              <div style={{
                color: 'var(--warning)',
                fontSize: '0.78rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 8,
              }}>
                Gobierno Corporativo y Seguridad
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 12 }}>
                Consolas Segregadas por Rol
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                En producción, estos módulos operan bajo autenticación IAM protegida, fuera del alcance del público general.
              </p>
            </div>

            <div className="landing-compliance-grid">
              <div style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: '1.4rem' }}>🛡️</span>
                  <div>
                    <div style={{ fontWeight: 700 }}>Consola de Auditoría</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Trazabilidad matemática inmutable</div>
                  </div>
                </div>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 16 }}>
                  Monitorea pipelines de transacciones, valida la integridad de saldos y detecta bloqueos de seguridad por intentos reiterados de PIN.
                </p>
                <button className="btn btn-ghost btn-full btn-sm" onClick={() => navigate('/auditor')}>
                  Acceder a Consola Auditor →
                </button>
              </div>

              <div style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: '1.4rem' }}>⚙️</span>
                  <div>
                    <div style={{ fontWeight: 700 }}>Consola de Administración</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Conciliación y gestión de llaves</div>
                  </div>
                </div>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 16 }}>
                  Visualiza tableros de volumen global, genera credenciales API Keys para comercios y concilia saldos con pasarelas externas.
                </p>
                <button className="btn btn-ghost btn-full btn-sm" onClick={() => navigate('/admin')}>
                  Acceder a Consola Administrador →
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-default)',
        padding: '32px 40px',
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        flexWrap: 'wrap',
        gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <PaganiniLogo size={24} />
          <span>&copy; 2026 Paganini Core Project. Especificación SOFG1007.</span>
        </div>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <span>ADR-004 Compatible</span>
          <span>STD-002 Compliant</span>
          <span>Hexagonal Monorepo</span>
        </div>
      </footer>
    </div>
  );
}
