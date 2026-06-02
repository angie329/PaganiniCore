import { useState } from 'react';
import { Shield, Search, CheckSquare, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import TransactionTracer from './TransactionTracer';
import IntegrityValidator from './IntegrityValidator';
import SecurityMonitor from './SecurityMonitor';

const NAV_ITEMS = [
  { id: 'tracer',    label: 'Trazabilidad TX',    icon: Search },
  { id: 'integrity', label: 'Validador Integridad', icon: CheckSquare },
  { id: 'security',  label: 'Monitoreo Seguridad', icon: AlertTriangle },
];

export default function AuditorLayout({ onBack }) {
  const [activeSection, setActiveSection] = useState('tracer');
  const [collapsed, setCollapsed] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case 'tracer':    return <TransactionTracer />;
      case 'integrity': return <IntegrityValidator />;
      case 'security':  return <SecurityMonitor />;
      default:          return <TransactionTracer />;
    }
  };

  return (
    <div className="console-layout">
      {/* Sidebar */}
      <div className={`console-sidebar ${collapsed ? 'collapsed' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div style={{
            width: 32, height: 32, flexShrink: 0,
            background: 'linear-gradient(135deg, #d97706, #f59e0b)',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1rem',
          }}>
            🛡️
          </div>
          {!collapsed && (
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontWeight: 700, fontSize: '0.875rem', whiteSpace: 'nowrap' }}>Consola Auditor</p>
              <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Paganini · Auditoría</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <div
              key={id}
              className={`sidebar-nav-item ${activeSection === id ? 'active' : ''}`}
              onClick={() => setActiveSection(id)}
              id={`auditor-nav-${id}`}
              title={collapsed ? label : undefined}
            >
              <Icon size={18} style={{ flexShrink: 0 }} />
              {!collapsed && <span>{label}</span>}
            </div>
          ))}
        </nav>

        {/* Collapse toggle */}
        <div style={{ padding: '12px 8px', borderTop: '1px solid var(--border-default)' }}>
          <div
            className="sidebar-nav-item"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            {!collapsed && <span style={{ fontSize: '0.8rem' }}>Colapsar</span>}
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="console-main">
        {/* Topbar */}
        <div className="console-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="btn btn-ghost btn-sm" onClick={onBack}>← Hub</button>
            <div style={{ width: 1, height: 20, background: 'var(--border-default)' }} />
            <div>
              <h1 style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                {NAV_ITEMS.find(n => n.id === activeSection)?.label}
              </h1>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="badge badge-warning">🛡️ Auditor</span>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, #d97706, #f59e0b)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '0.75rem',
            }}>AU</div>
          </div>
        </div>

        {/* Content */}
        <div className="console-content">
          {renderSection()}
        </div>
      </div>
    </div>
  );
}
