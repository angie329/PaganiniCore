import { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { formatCurrency, formatDateTime, exportTransactionsCSV, exportAuditPDF } from '../../../utils/helpers';

export default function IntegrityValidator() {
  const { state } = useApp();
  const [auditing, setAuditing] = useState(false);
  const [auditDone, setAuditDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const [forceDiscrepancy, setForceDiscrepancy] = useState(false);
  const [exportMsg, setExportMsg] = useState('');

  // Math: sum all ingresos - sum all egresos (including fees)
  const ingresos = state.transactions
    .filter(t => t.type === 'ingreso')
    .reduce((s, t) => s + t.amount, 0);
  const egresos = state.transactions
    .filter(t => t.type === 'egreso')
    .reduce((s, t) => s + t.amount + (t.fee || 0), 0);
  const calculatedBalance = Math.round((ingresos - egresos) * 100) / 100;
  const dbBalance = state.balance;
  const discrepancyAmount = forceDiscrepancy ? -12.50 : 0;
  const reportedBalance = forceDiscrepancy ? calculatedBalance + discrepancyAmount : calculatedBalance;
  const isIntact = !forceDiscrepancy && Math.abs(calculatedBalance - dbBalance) < 0.01;

  const handleAudit = async () => {
    setAuditing(true);
    setAuditDone(false);
    setProgress(0);
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(r => setTimeout(r, 120));
      setProgress(i);
    }
    setAuditing(false);
    setAuditDone(true);
  };

  const handleExportCSV = () => {
    exportTransactionsCSV(state.transactions, state.balance);
    setExportMsg('CSV exportado correctamente ✓');
    setTimeout(() => setExportMsg(''), 3000);
  };

  const handleExportPDF = async () => {
    setExportMsg('⏳ Generando PDF...');
    try {
      await exportAuditPDF({
        transactions: state.transactions,
        dbBalance,
        calculatedBalance: forceDiscrepancy ? reportedBalance : calculatedBalance,
        isIntact,
        discrepancyAmount: forceDiscrepancy ? discrepancyAmount : 0,
      });
      setExportMsg('PDF descargado correctamente ✓');
    } catch (err) {
      console.error('Error generando PDF:', err);
      setExportMsg('❌ Error al generar PDF');
    }
    setTimeout(() => setExportMsg(''), 4000);
  };

  // Running balance table
  let running = 0;
  const tableRows = [...state.transactions].reverse().map(tx => {
    const delta = tx.type === 'ingreso' ? tx.amount : -(tx.amount + (tx.fee || 0));
    running = Math.round((running + delta) * 100) / 100;
    return { ...tx, runningBalance: running };
  });

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 4, color: '#0f172a' }}>Validador de Integridad Matemática</h2>
        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
          Verifica que el saldo registrado coincide exactamente con la suma de todas las transacciones del historial.
        </p>
      </div>

      {/* Audit trigger */}
      <div className="chart-card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <p style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 2 }}>Auditar Balance de Matías Calderón</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {state.transactions.length} transacciones · Saldo en DB: {formatCurrency(dbBalance)}
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={handleAudit}
            disabled={auditing}
            id="integrity-audit-btn"
          >
            {auditing ? <><span className="spinner" /> Auditando...</> : '🔍 Auditar Balance'}
          </button>
        </div>

        {/* Progress bar */}
        {auditing && (
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 6 }}>
              <span>Procesando {state.transactions.length} registros...</span>
              <span>{progress}%</span>
            </div>
            <div style={{ height: 6, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${progress}%`,
                background: 'var(--brand-gradient)',
                borderRadius: 'var(--radius-full)',
                transition: 'width 120ms ease',
                boxShadow: '0 0 8px rgba(124,58,237,0.4)',
              }} />
            </div>
          </div>
        )}

        {/* Result badge */}
        {auditDone && (
          <div style={{ marginTop: 16 }} className="animate-fade-in">
            {isIntact ? (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: 'var(--success-bg)',
                border: '1px solid var(--success-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px 20px',
              }}>
                <div style={{ fontSize: '2rem' }}>✅</div>
                <div>
                  <p style={{ fontWeight: 700, color: 'var(--success-light)', fontSize: '1rem' }}>
                    Saldo Íntegro — Coincidencia 100%
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--success)', marginTop: 2 }}>
                    Calculado: {formatCurrency(calculatedBalance)} = DB: {formatCurrency(dbBalance)}
                  </p>
                </div>
              </div>
            ) : (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: 'var(--danger-bg)',
                border: '1px solid var(--danger-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px 20px',
              }}>
                <div style={{ fontSize: '2rem' }}>🚨</div>
                <div>
                  <p style={{ fontWeight: 700, color: 'var(--danger-light)', fontSize: '1rem' }}>
                    ⚠ DESCUADRE DETECTADO — Integridad Comprometida
                  </p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--danger)', marginTop: 2 }}>
                    Diferencia exacta:{' '}
                    <strong style={{ fontFamily: 'var(--font-mono)' }}>
                      {formatCurrency(reportedBalance - dbBalance)}
                    </strong>
                    {' '}· Detectado el {new Date().toLocaleTimeString('es-EC')}
                  </p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--danger)', marginTop: 4 }}>
                    Calculado: {formatCurrency(reportedBalance)} ≠ DB: {formatCurrency(dbBalance)}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Controls row */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20, alignItems: 'center' }}>
        {/* Force discrepancy toggle */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'var(--bg-secondary)',
          border: `1px solid ${forceDiscrepancy ? 'var(--danger-border)' : 'var(--border-default)'}`,
          borderRadius: 'var(--radius-md)',
          padding: '10px 16px',
          cursor: 'pointer',
        }}
          onClick={() => { setForceDiscrepancy(!forceDiscrepancy); if (auditDone) setAuditDone(false); }}
          id="integrity-force-discrepancy"
        >
          <div style={{
            width: 36, height: 20,
            borderRadius: 'var(--radius-full)',
            background: forceDiscrepancy ? 'var(--danger)' : 'var(--bg-tertiary)',
            position: 'relative',
            transition: 'background 200ms',
          }}>
            <div style={{
              position: 'absolute', top: 2, left: forceDiscrepancy ? 18 : 2,
              width: 16, height: 16, borderRadius: '50%', background: 'white',
              transition: 'left 200ms',
            }} />
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: forceDiscrepancy ? 'var(--danger-light)' : 'var(--text-secondary)' }}>
            Forzar Descuadre Simulado
          </span>
        </div>

        {/* Export buttons */}
        <button className="btn btn-secondary btn-sm" onClick={handleExportCSV} id="integrity-export-csv">
          📄 Exportar CSV
        </button>
        <button className="btn btn-secondary btn-sm" onClick={handleExportPDF} id="integrity-export-pdf">
          📋 Exportar PDF
        </button>
        {exportMsg && (
          <span className="badge badge-success">{exportMsg}</span>
        )}
      </div>

      {/* Transactions table with running balance */}
      <div className="chart-card">
        <p className="chart-title">Registro Detallado de Transacciones (Orden Cronológico)</p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', color: '#0f172a' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                {['ID', 'Fecha', 'Descripción', 'Tipo', 'Monto', 'Comisión', 'Efecto Neto', 'Saldo Acumulado'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: '#475569', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.map((tx, i) => {
                const netEffect = tx.type === 'ingreso' ? tx.amount : -(tx.amount + (tx.fee || 0));
                return (
                  <tr key={tx.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 150ms' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '9px 12px', fontFamily: 'var(--font-mono)', color: 'var(--brand-light)', whiteSpace: 'nowrap' }}>{tx.id}</td>
                    <td style={{ padding: '9px 12px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {new Date(tx.date).toLocaleDateString('es-EC', { day: '2-digit', month: 'short' })}
                    </td>
                    <td style={{ padding: '9px 12px', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.description}</td>
                    <td style={{ padding: '9px 12px' }}>
                      <span className={`badge ${tx.type === 'ingreso' ? 'badge-success' : 'badge-muted'}`} style={{ fontSize: '0.65rem' }}>
                        {tx.type}
                      </span>
                    </td>
                    <td style={{ padding: '9px 12px', fontWeight: 600 }}>{formatCurrency(tx.amount)}</td>
                    <td style={{ padding: '9px 12px', color: 'var(--text-muted)' }}>{formatCurrency(tx.fee || 0)}</td>
                    <td style={{ padding: '9px 12px', fontWeight: 700, color: netEffect >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                      {netEffect >= 0 ? '+' : ''}{formatCurrency(netEffect)}
                    </td>
                    <td style={{ padding: '9px 12px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                      {formatCurrency(tx.runningBalance)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: '2px solid #e2e8f0', background: '#f1f5f9' }}>
                <td colSpan={6} style={{ padding: '10px 12px', fontWeight: 700, color: '#475569' }}>Balance Calculado (Σ Ingresos − Σ Egresos)</td>
                <td style={{ padding: '10px 12px' }} />
                <td style={{ padding: '10px 12px', fontWeight: 800, fontSize: '1rem', color: isIntact ? '#16a34a' : '#dc2626' }}>
                  {formatCurrency(forceDiscrepancy ? reportedBalance : calculatedBalance)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
