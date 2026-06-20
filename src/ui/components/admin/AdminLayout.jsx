import { useState } from 'react';
import { BarChart2, RefreshCw, Key, ChevronLeft, ChevronRight } from 'lucide-react';
import AnalyticsDashboard from './AnalyticsDashboard';
import ReconciliationModule from './ReconciliationModule';
import AppKeyManager from './AppKeyManager';

const NAV_ITEMS = [
  { id: 'analytics',      label: 'Dashboard Analítico',   icon: BarChart2 },
  { id: 'reconciliation', label: 'Conciliación Pasarelas', icon: RefreshCw },
  { id: 'apps',           label: 'Apps & API Keys',        icon: Key },
];

export default function AdminLayout({ onBack }) {
  const [activeSection, setActiveSection] = useState('analytics');
  const [collapsed, setCollapsed] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case 'analytics':      return <AnalyticsDashboard />;
      case 'reconciliation': return <ReconciliationModule />;
      case 'apps':           return <AppKeyManager />;
      default:               return <AnalyticsDashboard />;
    }
  };

  return (
    <div className="console-layout">
      {/* Sidebar */}
      <div className={`console-sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-logo">
          <div style={{
            width: 32, height: 32, flexShrink: 0,
            background: 'linear-gradient(135deg, #059669, #10b981)',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1rem',
          }}>
            ⚙️
          </div>
          {!collapsed && (
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontWeight: 700, fontSize: '0.875rem', whiteSpace: 'nowrap' }}>Consola Admin</p>
              <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Paganini · Control Global</p>
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <div
              key={id}
              className={`sidebar-nav-item ${activeSection === id ? 'active' : ''}`}
              onClick={() => setActiveSection(id)}
              id={`admin-nav-${id}`}
              title={collapsed ? label : undefined}
            >
              <Icon size={18} style={{ flexShrink: 0 }} />
              {!collapsed && <span>{label}</span>}
            </div>
          ))}
        </nav>

        <div style={{ padding: '12px 8px', borderTop: '1px solid var(--border-default)' }}>
          <div className="sidebar-nav-item" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            {!collapsed && <span style={{ fontSize: '0.8rem' }}>Colapsar</span>}
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="console-main">
        <div className="console-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="btn btn-ghost btn-sm" onClick={onBack}>← Hub</button>
            <div style={{ width: 1, height: 20, background: 'var(--border-default)' }} />
            <h1 style={{ fontSize: '0.95rem', fontWeight: 700 }}>
              {NAV_ITEMS.find(n => n.id === activeSection)?.label}
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="badge badge-success">⚙️ Administrador</span>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, #059669, #10b981)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '0.75rem',
            }}>AD</div>
          </div>
        </div>
        <div className="console-content">
          {renderSection()}
        </div>
      </div>
    </div>
  );
}
