import { useState } from 'react';
import { formatCurrency, generateTxId, generateRef, generateHash } from '../../../utils/helpers';
import PaganiniPayWidget from './PaganiniPayWidget';

export default function SuplaierAppMock() {
  const [showWidget, setShowWidget] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId] = useState(`ORD-${Math.floor(Math.random()*90000)+10000}`);

  const SERVICE = {
    name: 'Plan de Limpieza Profesional',
    description: 'Servicio de limpieza a domicilio por 3 horas. Incluye materiales.',
    price: 45.00,
    rating: 4.8,
    reviews: 142,
    provider: 'CleanPro Ecuador',
    category: 'Servicios del Hogar',
  };

  if (orderComplete) {
    return (
      <div style={{
        minHeight: '100%',
        background: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        gap: 20,
      }}>
        {/* Suplaier branding */}
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#4f46e5', borderRadius: 12, padding: '8px 16px', marginBottom: 20,
          }}>
            <span style={{ fontSize: '1.2rem' }}>🛒</span>
            <span style={{ color: 'white', fontWeight: 800, fontSize: '1rem' }}>Suplaier</span>
          </div>
        </div>

        <div style={{
          width: 80, height: 80,
          borderRadius: '50%',
          background: '#dcfce7',
          border: '3px solid #16a34a',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2.5rem',
          animation: 'fadeInScale 400ms ease',
        }}>
          ✅
        </div>

        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>
            ¡Orden Confirmada!
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6 }}>
            Tu pago fue procesado exitosamente por Paganini.
          </p>
        </div>

        <div style={{
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: 16,
          padding: '20px 24px',
          width: '100%',
          maxWidth: 380,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Orden</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{orderId}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Servicio</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{SERVICE.name}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: 12 }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>Total pagado</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#4f46e5' }}>{formatCurrency(SERVICE.price)}</span>
          </div>
        </div>

        <p style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center' }}>
          Procesado con seguridad por <strong style={{ color: '#7c3aed' }}>Paganini</strong>
        </p>

        <button
          style={{
            background: '#4f46e5', color: 'white', border: 'none',
            borderRadius: 12, padding: '12px 28px',
            fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
          }}
          onClick={() => { setOrderComplete(false); setShowWidget(false); }}
        >
          Nueva búsqueda
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100%', background: '#f1f5f9', position: 'relative' }}>
      {/* Suplaier App Header */}
      <div style={{
        background: '#4f46e5',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '1.3rem' }}>🛒</span>
          <span style={{ color: 'white', fontWeight: 800, fontSize: '1.2rem' }}>Suplaier</span>
          <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '0.65rem', padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>BETA</span>
        </div>
        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>Encuentra servicios cerca de ti</div>
      </div>

      {/* Search bar */}
      <div style={{ background: '#4f46e5', padding: '0 24px 20px' }}>
        <div style={{
          background: 'white',
          borderRadius: 12,
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}>
          <span style={{ fontSize: '1rem' }}>🔍</span>
          <input
            type="text"
            defaultValue="Servicio de limpieza"
            style={{ border: 'none', outline: 'none', flex: 1, fontSize: '0.9rem', color: '#0f172a', background: 'transparent' }}
            readOnly
          />
          <span style={{ background: '#4f46e5', color: 'white', borderRadius: 8, padding: '4px 10px', fontSize: '0.75rem', fontWeight: 600 }}>Buscar</span>
        </div>
      </div>

      {/* Main content */}
      <div style={{ padding: '20px 24px' }}>
        <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: 16 }}>
          3 resultados para "servicio de limpieza" en Guayaquil
        </p>

        {/* Service Card - highlighted */}
        <div style={{
          background: 'white',
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          border: '2px solid #4f46e5',
          marginBottom: 16,
        }}>
          {/* Card image placeholder */}
          <div style={{
            height: 120,
            background: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem',
            position: 'relative',
          }}>
            🧹
            <div style={{
              position: 'absolute', top: 10, right: 10,
              background: '#4f46e5', color: 'white',
              fontSize: '0.65rem', fontWeight: 700,
              padding: '3px 8px', borderRadius: 6,
            }}>
              MÁS BUSCADO
            </div>
          </div>

          <div style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>{SERVICE.name}</h3>
                <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{SERVICE.provider}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '1.2rem', fontWeight: 800, color: '#4f46e5' }}>{formatCurrency(SERVICE.price)}</p>
              </div>
            </div>

            <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.5, marginBottom: 12 }}>
              {SERVICE.description}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ color: '#f59e0b' }}>⭐</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{SERVICE.rating}</span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>({SERVICE.reviews})</span>
              </div>
              <span style={{
                background: '#f1f5f9', color: '#475569',
                fontSize: '0.7rem', fontWeight: 600,
                padding: '2px 8px', borderRadius: 6,
              }}>
                {SERVICE.category}
              </span>
            </div>

            {/* Pay button */}
            <button
              id="suplaier-pay-btn"
              onClick={() => setShowWidget(true)}
              style={{
                width: '100%',
                background: '#4f46e5',
                color: 'white',
                border: 'none',
                borderRadius: 10,
                padding: '12px',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'all 200ms',
              }}
              onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.1)'}
              onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}
            >
              <span style={{ fontSize: '1rem' }}>💳</span>
              Pagar {formatCurrency(SERVICE.price)}
            </button>

            <p style={{ textAlign: 'center', fontSize: '0.68rem', color: '#94a3b8', marginTop: 8 }}>
              Procesado de forma segura por{' '}
              <span style={{ color: '#7c3aed', fontWeight: 700 }}>Paganini</span>
            </p>
          </div>
        </div>

        {/* Other results (greyed out) */}
        {[
          { name: 'Limpieza Express 2H', provider: 'LimpioYa', price: 35, rating: 4.5 },
          { name: 'Deep Cleaning 4H', provider: 'CleanTeam EC', price: 68, rating: 4.6 },
        ].map((s, i) => (
          <div key={i} style={{
            background: 'white',
            borderRadius: 12,
            padding: '14px 16px',
            marginBottom: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            opacity: 0.65,
            boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
          }}>
            <div style={{ width: 44, height: 44, background: '#f1f5f9', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🧹</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0f172a' }}>{s.name}</p>
              <p style={{ fontSize: '0.72rem', color: '#64748b' }}>{s.provider} · ⭐ {s.rating}</p>
            </div>
            <p style={{ fontWeight: 700, color: '#4f46e5', fontSize: '0.95rem' }}>${s.price}</p>
          </div>
        ))}
      </div>

      {/* Paganini Widget overlay */}
      {showWidget && (
        <PaganiniPayWidget
          amount={SERVICE.price}
          merchantName={SERVICE.name}
          onClose={() => setShowWidget(false)}
          onSuccess={() => { setShowWidget(false); setOrderComplete(true); }}
        />
      )}
    </div>
  );
}
