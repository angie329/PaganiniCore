import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDateTime } from '../../utils/helpers';

const PIPELINE_NODES = [
  { id: 'app_cliente',      label: 'App Cliente',        icon: '📱' },
  { id: 'api_gateway',      label: 'API Gateway',         icon: '🔗' },
  { id: 'core_db',          label: 'Core DB',             icon: '🗄️' },
  { id: 'core_paganini',    label: 'Core Paganini',       icon: '⚡' },
  { id: 'gateway_externo',  label: 'Gateway Externo',     icon: '🌐' },
];

export default function TransactionTracer() {
  const { state } = useApp();
  const [query, setQuery] = useState('');
  const [foundTx, setFoundTx] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [animStep, setAnimStep] = useState(-1);   // cuántos nodos están activos
  const [failedNode, setFailedNode] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    const tx = state.transactions.find(t => t.id.toLowerCase() === query.trim().toLowerCase());
    if (tx) {
      setFoundTx(tx);
      setNotFound(false);
      setAnimStep(-1);
      setFailedNode(null);
      startPipeline();
    } else {
      setFoundTx(null);
      setNotFound(true);
    }
  };

  const startPipeline = () => {
    setIsAnimating(true);
    setAnimStep(-1);
    setFailedNode(null);
    let step = 0;
    const interval = setInterval(() => {
      setAnimStep(step);
      step++;
      if (step >= PIPELINE_NODES.length) {
        clearInterval(interval);
        setIsAnimating(false);
      }
    }, 600);
  };

  const simulateFail = () => {
    if (!foundTx || isAnimating) return;
    const failAt = Math.floor(Math.random() * (PIPELINE_NODES.length - 1)) + 1;
    setFailedNode(failAt);
    setAnimStep(failAt - 1);
  };

  const resetFail = () => {
    setFailedNode(null);
    startPipeline();
  };

  const getNodeStatus = (index) => {
    if (failedNode !== null) {
      if (index < failedNode) return 'active';
      if (index === failedNode) return 'error';
      return 'idle';
    }
    if (index <= animStep) return 'active';
    return 'idle';
  };

  const getConnectorStatus = (index) => {
    if (failedNode !== null) {
      if (index < failedNode - 1) return 'active';
      if (index === failedNode - 1) return 'error';
      return 'idle';
    }
    if (index < animStep) return 'active';
    return 'idle';
  };

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 4 }}>Trazabilidad de Transacción</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Busca por ID de transacción para visualizar el pipeline completo de procesamiento.
        </p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
        <input
          type="text"
          className="form-input"
          placeholder="Ej: TX-9982"
          value={query}
          onChange={e => setQuery(e.target.value)}
          id="tracer-search-input"
          style={{ flex: 1 }}
        />
        <button type="submit" className="btn btn-primary" id="tracer-search-btn">
          🔍 Buscar
        </button>
      </form>

      {notFound && (
        <div className="alert alert-error" style={{ marginBottom: 20 }}>
          <span>✗</span>
          <span>Transacción <strong>{query}</strong> no encontrada en el registro.</span>
        </div>
      )}

      {/* Quick TX chips */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', alignSelf: 'center' }}>Acceso rápido:</span>
        {state.transactions.slice(0, 5).map(tx => (
          <button
            key={tx.id}
            className="btn btn-ghost btn-sm"
            onClick={() => {
              setQuery(tx.id);
              setFoundTx(tx);
              setNotFound(false);
              setAnimStep(-1);
              setFailedNode(null);
              setTimeout(() => startPipeline(), 100);
            }}
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}
          >
            {tx.id}
          </button>
        ))}
      </div>

      {foundTx && (
        <div className="animate-fade-in">
          {/* Pipeline visual */}
          <div className="chart-card" style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <p className="chart-title" style={{ margin: 0 }}>Pipeline de Procesamiento — {foundTx.id}</p>
              <div style={{ display: 'flex', gap: 8 }}>
                {failedNode !== null ? (
                  <button className="btn btn-secondary btn-sm" onClick={resetFail} id="tracer-reset">
                    ↺ Reiniciar Pipeline
                  </button>
                ) : (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={simulateFail}
                    disabled={isAnimating}
                    id="tracer-simulate-fail"
                  >
                    ⚠ Simular Fallo
                  </button>
                )}
              </div>
            </div>

            {/* Pipeline nodes */}
            <div className="pipeline-container">
              {PIPELINE_NODES.map((node, i) => {
                const status = getNodeStatus(i);
                const connStatus = i < PIPELINE_NODES.length - 1 ? getConnectorStatus(i) : null;

                return (
                  <div key={node.id} style={{ display: 'flex', alignItems: 'center' }}>
                    {/* Node */}
                    <div className="pipeline-node">
                      <div className={`pipeline-node-icon ${status}`} style={{ position: 'relative' }}>
                        <span style={{ fontSize: '1.3rem' }}>{node.icon}</span>
                        {status === 'active' && (
                          <div style={{
                            position: 'absolute', top: -2, right: -2,
                            width: 12, height: 12,
                            borderRadius: '50%',
                            background: 'var(--success)',
                            border: '2px solid var(--bg-secondary)',
                          }} />
                        )}
                        {status === 'error' && (
                          <div style={{
                            position: 'absolute', top: -2, right: -2,
                            width: 12, height: 12,
                            borderRadius: '50%',
                            background: 'var(--danger)',
                            border: '2px solid var(--bg-secondary)',
                            animation: 'pulse 1s infinite',
                          }} />
                        )}
                      </div>
                      <div style={{ textAlign: 'center', width: 80 }}>
                        <p style={{ fontSize: '0.68rem', fontWeight: 600, color: status === 'active' ? 'var(--success)' : status === 'error' ? 'var(--danger)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                          {node.label}
                        </p>
                        {status === 'active' && (
                          <span style={{ fontSize: '0.6rem', color: 'var(--success)' }}>✓ OK</span>
                        )}
                        {status === 'error' && (
                          <span style={{ fontSize: '0.6rem', color: 'var(--danger)' }}>✗ FALLO</span>
                        )}
                        {status === 'idle' && animStep >= 0 && (
                          <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>— omitido</span>
                        )}
                      </div>
                    </div>

                    {/* Connector */}
                    {connStatus !== null && (
                      <div className="pipeline-connector" style={{ margin: '0 4px', marginBottom: 20 }}>
                        <div className={`pipeline-connector-fill ${connStatus}`} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Fail error detail */}
            {failedNode !== null && (
              <div className="alert alert-error animate-fade-in" style={{ marginTop: 16 }}>
                <span>✗</span>
                <div>
                  <strong>Fallo simulado en: {PIPELINE_NODES[failedNode]?.label}</strong>
                  <br />
                  <span style={{ fontSize: '0.8rem' }}>
                    Error: <span style={{ fontFamily: 'var(--font-mono)' }}>INTERNAL_PROCESSING_ERROR — timeout after 30000ms</span>
                  </span>
                </div>
              </div>
            )}

            {/* Success message */}
            {failedNode === null && animStep >= PIPELINE_NODES.length - 1 && !isAnimating && (
              <div className="alert alert-success animate-fade-in" style={{ marginTop: 16 }}>
                <span>✓</span>
                <span>Transacción procesada exitosamente en todos los nodos del pipeline.</span>
              </div>
            )}
          </div>

          {/* TX Metadata */}
          <div className="chart-card">
            <p className="chart-title">Metadatos de la Transacción</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              {[
                { label: 'ID Transacción',   value: foundTx.id,                      mono: true  },
                { label: 'Tipo',             value: foundTx.type.toUpperCase()                    },
                { label: 'Monto',            value: formatCurrency(foundTx.amount)               },
                { label: 'Comisión',         value: formatCurrency(foundTx.fee || 0)             },
                { label: 'Estado',           value: foundTx.status                               },
                { label: 'Pasarela',         value: foundTx.gateway                              },
                { label: 'Origen',           value: foundTx.counterpart                          },
                { label: 'Referencia',       value: foundTx.reference,               mono: true  },
                { label: 'Fecha',            value: formatDateTime(foundTx.date)                 },
                { label: 'Timestamp Srv',    value: formatDateTime(foundTx.serverTimestamp)       },
                { label: 'Hash',             value: foundTx.hash,                    mono: true  },
                { label: 'IP Origen',        value: foundTx.ipOrigin,                mono: true  },
              ].map((row, i) => (
                <div key={i} style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: '12px 14px' }}>
                  <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{row.label}</p>
                  <p style={{
                    fontSize: '0.82rem', fontWeight: 600,
                    fontFamily: row.mono ? 'var(--font-mono)' : undefined,
                    color: row.label === 'Estado' ? (foundTx.status === 'exitoso' ? 'var(--success)' : 'var(--danger)') : 'var(--text-primary)',
                    wordBreak: 'break-all',
                  }}>
                    {row.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!foundTx && !notFound && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔍</div>
          <p style={{ fontSize: '0.9rem' }}>Ingresa un ID de transacción para visualizar su trayectoria en el pipeline.</p>
          <p style={{ fontSize: '0.78rem', marginTop: 6 }}>Prueba con <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--brand-light)' }}>TX-9982</span></p>
        </div>
      )}
    </div>
  );
}
