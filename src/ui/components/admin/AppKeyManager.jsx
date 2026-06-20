import { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { generateClientId, generateClientSecret, formatDateTime } from '../../../utils/helpers';
import Modal from '../common/Modal';

export default function AppKeyManager() {
  const { state, dispatch } = useApp();
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [newAppName, setNewAppName] = useState('');
  const [newAppCategory, setNewAppCategory] = useState('E-commerce');
  const [registering, setRegistering] = useState(false);
  const [newCredentials, setNewCredentials] = useState(null);
  const [revokeTarget, setRevokeTarget] = useState(null);
  const [copiedKey, setCopiedKey] = useState('');

  const handleRegister = async () => {
    if (!newAppName.trim()) return;
    setRegistering(true);
    await new Promise(r => setTimeout(r, 1200));

    const newApp = {
      id: `APP-${Date.now()}`,
      name: newAppName.trim(),
      clientId: generateClientId(newAppName),
      clientSecret: generateClientSecret(),
      status: 'activa',
      registeredAt: new Date().toISOString(),
      totalTransactions: 0,
      volume: 0,
      category: newAppCategory,
    };

    dispatch({ type: 'REGISTER_APP', payload: newApp });
    setRegistering(false);
    setNewCredentials(newApp);
    setNewAppName('');
  };

  const handleRevoke = (appId) => {
    dispatch({ type: 'REVOKE_APP', payload: appId });
    setRevokeTarget(null);
  };

  const handleRestore = (appId) => {
    dispatch({ type: 'RESTORE_APP', payload: appId });
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(''), 2000);
  };

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 4, color: '#0f172a' }}>Gestión de Apps & API Keys</h2>
        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
          Administra las aplicaciones cliente autorizadas en el ecosistema Paganini.
        </p>
      </div>

      {/* Stats bar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Apps Activas',   value: state.registeredApps.filter(a => a.status === 'activa').length,   color: 'var(--success)' },
          { label: 'Apps Revocadas', value: state.registeredApps.filter(a => a.status === 'revocada').length, color: 'var(--danger)'  },
          { label: 'Total Registradas', value: state.registeredApps.length,                                    color: 'var(--brand-primary)' },
        ].map((s, i) => (
          <div key={i} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '12px 16px', flex: 1 }}>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{s.label}</p>
            <p style={{ fontSize: '1.4rem', fontWeight: 800, color: s.color }}>{s.value}</p>
          </div>
        ))}
        <button
          className="btn btn-primary"
          onClick={() => { setNewCredentials(null); setShowRegisterModal(true); }}
          id="register-app-btn"
          style={{ alignSelf: 'center', whiteSpace: 'nowrap' }}
        >
          + Registrar Nueva App
        </button>
      </div>

      {/* Apps table */}
      <div className="chart-card">
        <p className="chart-title">Apps Autorizadas</p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-default)' }}>
                {['App', 'Client ID', 'Estado', 'Categoría', 'Registrada', 'Tx / Volumen', 'Acciones'].map(h => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {state.registeredApps.map((app) => (
                <tr
                  key={app.id}
                  style={{ borderBottom: '1px solid rgba(148,163,184,0.06)', opacity: app.status === 'revocada' ? 0.55 : 1, transition: 'all 300ms' }}
                >
                  <td style={{ padding: '12px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 8,
                        background: app.status === 'activa' ? 'var(--brand-gradient)' : 'var(--bg-tertiary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.75rem', fontWeight: 800, color: 'white', flexShrink: 0,
                      }}>
                        {app.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{app.name}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px', maxWidth: 180 }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      color: 'var(--brand-light)',
                      background: 'rgba(124,58,237,0.08)',
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-sm)',
                      display: 'inline-block',
                      maxWidth: 160,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {app.clientId}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span className={`badge ${app.status === 'activa' ? 'badge-success' : 'badge-danger'}`}>
                      {app.status === 'activa' ? '● Activa' : '✕ Revocada'}
                    </span>
                  </td>
                  <td style={{ padding: '12px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{app.category}</td>
                  <td style={{ padding: '12px', color: 'var(--text-muted)', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                    {new Date(app.registeredAt).toLocaleDateString('es-EC')}
                  </td>
                  <td style={{ padding: '12px', fontSize: '0.78rem' }}>
                    <div>
                      <p style={{ fontWeight: 600 }}>{app.totalTransactions.toLocaleString()} tx</p>
                      <p style={{ color: 'var(--text-muted)' }}>${(app.volume / 1000).toFixed(1)}K</p>
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    {app.status === 'activa' ? (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => setRevokeTarget(app)}
                        id={`revoke-${app.id}`}
                      >
                        Revocar Acceso
                      </button>
                    ) : (
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleRestore(app.id)}
                        id={`restore-${app.id}`}
                      >
                        Restaurar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Modal */}
      <Modal isOpen={showRegisterModal} onClose={() => { setShowRegisterModal(false); setNewCredentials(null); }} title={newCredentials ? '✓ App Registrada' : 'Registrar Nueva App'}>
        {newCredentials ? (
          <div className="modal-body">
            <div className="alert alert-success" style={{ marginBottom: 16 }}>
              <span>✓</span>
              <span><strong>{newCredentials.name}</strong> registrada exitosamente</span>
            </div>

            <div className="alert alert-warning" style={{ marginBottom: 16, fontSize: '0.8rem' }}>
              <span>⚠</span>
              <span>Las credenciales solo se muestran <strong>una vez</strong>. Guárdalas en un lugar seguro.</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Client ID',     value: newCredentials.clientId },
                { label: 'Client Secret', value: newCredentials.clientSecret },
              ].map((cred, i) => (
                <div key={i}>
                  <p className="form-label" style={{ marginBottom: 6 }}>{cred.label}</p>
                  <div className="api-key-display">
                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {cred.value}
                    </span>
                    <button
                      onClick={() => copyToClipboard(cred.value, cred.label)}
                      className="btn btn-ghost btn-sm"
                      style={{ padding: '4px 10px', flexShrink: 0 }}
                    >
                      {copiedKey === cred.label ? '✓ Copiado' : 'Copiar'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="modal-footer" style={{ paddingTop: 20 }}>
              <button className="btn btn-primary btn-full" onClick={() => { setShowRegisterModal(false); setNewCredentials(null); }} id="close-credentials-modal">
                Entendido — Cerrar
              </button>
            </div>
          </div>
        ) : (
          <div className="modal-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Nombre de la Aplicación</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ej: CityPet, MiTienda, UrbanFood"
                  value={newAppName}
                  onChange={e => setNewAppName(e.target.value)}
                  id="new-app-name"
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label className="form-label">Categoría</label>
                <select
                  className="form-select"
                  value={newAppCategory}
                  onChange={e => setNewAppCategory(e.target.value)}
                  id="new-app-category"
                >
                  <option>E-commerce</option>
                  <option>Mascotas y Servicios</option>
                  <option>Alimentos y Bebidas</option>
                  <option>Transporte</option>
                  <option>Salud y Bienestar</option>
                  <option>Educación</option>
                  <option>Otro</option>
                </select>
              </div>
            </div>
            <div className="modal-footer" style={{ paddingTop: 20 }}>
              <button className="btn btn-ghost" onClick={() => setShowRegisterModal(false)}>Cancelar</button>
              <button
                className="btn btn-primary"
                onClick={handleRegister}
                disabled={registering || !newAppName.trim()}
                id="confirm-register-app"
              >
                {registering ? <><span className="spinner" /> Registrando...</> : 'Registrar App'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Revoke confirmation modal */}
      <Modal isOpen={!!revokeTarget} onClose={() => setRevokeTarget(null)} title="Confirmar Revocación">
        <div className="modal-body">
          <div className="alert alert-error" style={{ marginBottom: 16 }}>
            <span>⚠</span>
            <div>
              <strong>Esta acción deshabilitará el acceso inmediatamente.</strong>
              <br />
              <span style={{ fontSize: '0.8rem' }}>La app <strong>{revokeTarget?.name}</strong> ya no podrá procesar pagos.</span>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-ghost" onClick={() => setRevokeTarget(null)}>Cancelar</button>
            <button
              className="btn btn-danger"
              onClick={() => handleRevoke(revokeTarget.id)}
              id="confirm-revoke"
            >
              Sí, Revocar Acceso
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
