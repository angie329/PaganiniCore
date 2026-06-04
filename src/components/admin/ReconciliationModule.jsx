import { useState, useEffect } from 'react';
import { RECONCILIATION_DATA } from '../../data/mockData';
import { formatCurrency } from '../../utils/helpers';

const GATEWAYS = [
  { id: 'paypal',     label: 'PayPal',       icon: '🅿' },
  { id: 'placetopay', label: 'PlaceToPay',   icon: '🏦' },
];

const SCENARIOS = [
  { id: 'A', label: 'Escenario A — Conciliación Exitosa',           color: 'var(--success)' },
  { id: 'B', label: 'Escenario B — Discrepancias Encontradas',      color: 'var(--warning)' },
  { id: 'C', label: 'Escenario C — Caída de API',                   color: 'var(--danger)'  },
];

const LOG_LINES_A = (gw) => [
  `Conectando con API ${gw}...`,
  `Autenticación OAuth 2.0 exitosa`,
  `Descargando registros del período...`,
  `847 transacciones recibidas`,
  `Iniciando comparación registro por registro...`,
  `Procesando lote 1/9 (100 tx)...`,
  `Procesando lote 2/9 (100 tx)...`,
  `Procesando lote 3/9 (100 tx)...`,
  `Procesando lote 4/9 (100 tx)...`,
  `Procesando lote 5/9...`,
  `Procesando lotes 6-9...`,
  `Generando reporte final...`,
  `✓ Conciliación completada`,
];

const LOG_LINES_B = (gw) => [
  `Conectando con API ${gw}...`,
  `Autenticación OAuth 2.0 exitosa`,
  `Descargando registros...`,
  `847 transacciones recibidas de ${gw}`,
  `Comparando con registros Paganini...`,
  `⚠ ALERTA: Discrepancia encontrada en TX-9910`,
  `⚠ ALERTA: Discrepancia encontrada en TX-9925`,
  `⚠ ALERTA: Discrepancia encontrada en TX-9931`,
  `⚠ ALERTA: TX-9944 no encontrada en pasarela`,
  `Totalizando diferencias...`,
  `Generando reporte de discrepancias...`,
];

const LOG_LINES_C = (gw) => [
  `Conectando con API ${gw}...`,
  `Enviando solicitud de autenticación...`,
  `Esperando respuesta... (5s)`,
  `Esperando respuesta... (10s)`,
  `Esperando respuesta... (15s)`,
  `Esperando respuesta... (20s)`,
  `Esperando respuesta... (25s)`,
  `✗ ERROR: Connection timeout after 30000ms`,
  `✗ GATEWAY_TIMEOUT — API no disponible`,
];

export default function ReconciliationModule() {
  const [gateway, setGateway] = useState('paypal');
  const [scenario, setScenario] = useState('A');
  const [running, setRunning] = useState(false);
  const [logLines, setLogLines] = useState([]);
  const [done, setDone] = useState(false);
  const [result, setResult] = useState(null);

  const gwLabel = GATEWAYS.find(g => g.id === gateway)?.label || '';

  const getLogLines = () => {
    if (scenario === 'A') return LOG_LINES_A(gwLabel);
    if (scenario === 'B') return LOG_LINES_B(gwLabel);
    return LOG_LINES_C(gwLabel);
  };

  const handleRun = async () => {
    setRunning(true);
    setLogLines([]);
    setDone(false);
    setResult(null);

    const lines = getLogLines();
    const delay = scenario === 'C' ? 900 : 350;

    for (let i = 0; i < lines.length; i++) {
      await new Promise(r => setTimeout(r, delay));
      setLogLines(prev => [...prev, lines[i]]);
    }

    setRunning(false);
    setDone(true);
    setResult(RECONCILIATION_DATA[gateway].scenarios[scenario]);
  };

  const data = result;

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 4 }}>Conciliación con Pasarelas de Pago</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Compara registros Paganini con los de pasarelas externas para detectar discrepancias.
        </p>
      </div>

      {/* Config panel */}
      <div className="chart-card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 20 }}>
          {/* Gateway selector */}
          <div style={{ flex: 1, minWidth: 200 }}>
            <p className="form-label" style={{ marginBottom: 10 }}>Pasarela de Pago</p>
            <div style={{ display: 'flex', gap: 10 }}>
              {GATEWAYS.map(g => (
                <div
                  key={g.id}
                  onClick={() => { setGateway(g.id); setDone(false); setLogLines([]); setResult(null); }}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    background: gateway === g.id ? 'var(--brand-gradient-subtle)' : 'var(--bg-tertiary)',
                    border: `2px solid ${gateway === g.id ? 'rgba(124,58,237,0.4)' : 'var(--border-default)'}`,
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 200ms',
                  }}
                  id={`gateway-${g.id}`}
                >
                  <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>{g.icon}</div>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, color: gateway === g.id ? 'var(--brand-light)' : 'var(--text-primary)' }}>{g.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Scenario selector */}
          <div style={{ flex: 2, minWidth: 280 }}>
            <p className="form-label" style={{ marginBottom: 10 }}>Escenario de Simulación</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {SCENARIOS.map(s => (
                <div
                  key={s.id}
                  onClick={() => { setScenario(s.id); setDone(false); setLogLines([]); setResult(null); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 14px',
                    background: scenario === s.id ? 'var(--bg-tertiary)' : 'transparent',
                    border: `1px solid ${scenario === s.id ? s.color + '50' : 'var(--border-default)'}`,
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'all 200ms',
                  }}
                  id={`scenario-${s.id}`}
                >
                  <div style={{ width: 16, height: 16, borderRadius: '50%', border: `2px solid ${s.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {scenario === s.id && <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />}
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 500, color: scenario === s.id ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          className="btn btn-primary btn-lg"
          onClick={handleRun}
          disabled={running}
          id="recon-run-btn"
          style={{ width: '100%' }}
        >
          {running ? (
            <><span className="spinner" /> Ejecutando Conciliación...</>
          ) : (
            '▶ Disparar Conciliación Automática'
          )}
        </button>
      </div>

      {/* Log terminal */}
      {(logLines.length > 0 || running) && (
        <div className="chart-card" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: running ? 'var(--success)' : 'var(--text-muted)', animation: running ? 'pulse 1s infinite' : 'none' }} />
            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              {running ? 'Procesando...' : 'Log completado'}
            </p>
          </div>
          <div className="recon-log">
            {logLines.map((line, i) => {
              const isOk    = line.startsWith('✓');
              const isError = line.startsWith('✗');
              const isWarn  = line.startsWith('⚠');
              const ts = new Date().toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
              return (
                <div key={i} className="recon-log-line">
                  <span className="ts">[{ts}] </span>
                  <span className={isOk ? 'ok' : isError ? 'err' : isWarn ? 'warn' : ''}>
                    {line}
                  </span>
                </div>
              );
            })}
            {running && <div className="recon-log-line animate-pulse"><span className="ts">_</span></div>}
          </div>
        </div>
      )}

      {/* Result */}
      {done && data && (
        <div className="animate-fade-in">
          {data.status === 'success' && (
            <div style={{
              background: 'var(--success-bg)',
              border: '1px solid var(--success-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px 24px',
              display: 'flex', alignItems: 'center', gap: 16,
            }}>
              <div style={{ fontSize: '2.5rem' }}>✅</div>
              <div>
                <p style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--success-light)', marginBottom: 4 }}>
                  100% Conciliado — Sin Discrepancias
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--success)' }}>
                  {data.totalTx} transacciones revisadas · {data.matched} coincidencias exactas
                </p>
              </div>
            </div>
          )}

          {data.status === 'discrepancies' && (
            <div className="chart-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <span style={{ fontSize: '1.8rem' }}>⚠️</span>
                <div>
                  <p style={{ fontWeight: 700, color: 'var(--warning)', fontSize: '1rem' }}>
                    Discrepancias Encontradas — {data.discrepancies.length} registros con diferencias
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {data.matched}/{data.totalTx} transacciones conciliadas correctamente
                  </p>
                </div>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-default)' }}>
                      {['TX ID', 'Monto Paganini', `Monto ${gwLabel}`, 'Diferencia', 'Tipo de Discrepancia'].map(h => (
                        <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.discrepancies.map((d, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(148,163,184,0.06)' }}>
                        <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', color: 'var(--brand-light)' }}>{d.txId}</td>
                        <td style={{ padding: '10px 12px' }}>{formatCurrency(d.paganiniAmount)}</td>
                        <td style={{ padding: '10px 12px' }}>{formatCurrency(d.gatewayAmount)}</td>
                        <td style={{ padding: '10px 12px', fontWeight: 700, color: d.diff !== 0 ? 'var(--danger)' : 'var(--warning)' }}>
                          {d.diff !== 0 ? formatCurrency(d.diff) : '—'}
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <span className={`badge ${d.status === 'no_encontrada' ? 'badge-danger' : 'badge-warning'}`} style={{ fontSize: '0.7rem' }}>
                            {d.status === 'monto_diferente' ? 'Monto diferente' : d.status === 'estado_diferente' ? 'Estado diferente' : 'No encontrada'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ borderTop: '2px solid var(--border-hover)', background: 'var(--bg-tertiary)' }}>
                      <td colSpan={3} style={{ padding: '10px 12px', fontWeight: 700 }}>Total Acumulado de Diferencias</td>
                      <td style={{ padding: '10px 12px', fontWeight: 800, color: 'var(--danger)', fontFamily: 'var(--font-mono)' }}>
                        {formatCurrency(data.discrepancies.reduce((s, d) => s + Math.abs(d.diff), 0))}
                      </td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {data.status === 'timeout' && (
            <div style={{
              background: 'var(--danger-bg)',
              border: '1px solid var(--danger-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px 24px',
              display: 'flex', alignItems: 'center', gap: 16,
            }}>
              <div style={{ fontSize: '2.5rem' }}>🔴</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--danger-light)', marginBottom: 4 }}>
                  Error de Comunicación — Gateway No Disponible
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--danger)', marginBottom: 8 }}>
                  {data.error}
                </p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Code: {data.code}
                </p>
              </div>
              <button className="btn btn-danger btn-sm" onClick={handleRun} disabled={running}>
                ↺ Reintentar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
