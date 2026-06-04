import { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/helpers';
import { ANALYTICS_DATA } from '../../data/mockData';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const APPS_FILTER = ['Todas', 'Suplaier', 'CityPet'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-md)',
      padding: '10px 14px',
      boxShadow: 'var(--shadow-md)',
    }}>
      <p style={{ fontWeight: 600, marginBottom: 4, fontSize: '0.8rem' }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ fontSize: '0.78rem', color: p.color }}>
          {p.name}: <strong>${p.value}</strong>
        </p>
      ))}
    </div>
  );
};

export default function AnalyticsDashboard() {
  const { state } = useApp();
  const [appFilter, setAppFilter] = useState('Todas');
  const [dateRange, setDateRange] = useState('7d');

  const kpis = useMemo(() => {
    const base = ANALYTICS_DATA.kpis;
    const txCount = base.totalTransactions + state.transactions.length - 8;
    const vol = base.totalVolume + state.transactions
      .filter(t => t.type === 'egreso')
      .reduce((s, t) => s + t.amount, 0) - 135.50;
    return {
      totalTransactions: Math.max(txCount, base.totalTransactions),
      totalVolume: Math.max(vol, base.totalVolume),
      activeUsers: base.activeUsers + (state.transactions.length > 8 ? 1 : 0),
      successRate: base.successRate,
    };
  }, [state.transactions]);

  const weeklyData = useMemo(() => {
    const data = ANALYTICS_DATA.weeklyVolume.map(d => ({ ...d }));
    if (appFilter === 'Suplaier') return data.map(d => ({ ...d, total: d.suplaier, cityPet: 0 }));
    if (appFilter === 'CityPet') return data.map(d => ({ ...d, total: d.cityPet, suplaier: 0 }));
    return data;
  }, [appFilter]);

  const kpiCards = [
    { label: 'Total Transacciones', value: kpis.totalTransactions.toLocaleString(), icon: '📊', suffix: '' },
    { label: 'Volumen Total',        value: formatCurrency(kpis.totalVolume),         icon: '💰', suffix: '' },
    { label: 'Usuarios Activos',     value: kpis.activeUsers.toLocaleString(),         icon: '👥', suffix: '' },
    { label: 'Tasa de Éxito',        value: kpis.successRate.toFixed(1),              icon: '✅', suffix: '%' },
  ];

  return (
    <div style={{ maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 4 }}>Dashboard Analítico</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Volumen y tendencias del ecosistema Paganini en tiempo real.
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {APPS_FILTER.map(f => (
            <button
              key={f}
              className={`btn btn-sm ${appFilter === f ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setAppFilter(f)}
              id={`filter-app-${f.toLowerCase()}`}
            >
              {f}
            </button>
          ))}
        </div>
        <div style={{ width: 1, height: 20, background: 'var(--border-default)' }} />
        <div style={{ display: 'flex', gap: 6 }}>
          {[{ v: '7d', l: '7 días' }, { v: '30d', l: '30 días' }, { v: '90d', l: '90 días' }].map(({ v, l }) => (
            <button
              key={v}
              className={`btn btn-sm ${dateRange === v ? 'btn-secondary' : 'btn-ghost'}`}
              onClick={() => setDateRange(v)}
              style={{ fontSize: '0.75rem' }}
              id={`filter-range-${v}`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }} className="stagger-children">
        {kpiCards.map((k, i) => (
          <div key={i} className="kpi-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k.label}</span>
              <span style={{ fontSize: '1.2rem' }}>{k.icon}</span>
            </div>
            <div className="kpi-value">{k.value}{k.suffix}</div>
          </div>
        ))}
      </div>

      {/* Charts row 1: Bar + Line */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 16, marginBottom: 16 }}>
        {/* Weekly volume bar chart */}
        <div className="chart-card">
          <p className="chart-title">Volumen de Transacciones — Últimos 7 Días ($)</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyData} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
              <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '0.78rem', color: '#94a3b8' }} />
              {(appFilter === 'Todas' || appFilter === 'Suplaier') && (
                <Bar dataKey="suplaier" name="Suplaier" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              )}
              {(appFilter === 'Todas' || appFilter === 'CityPet') && (
                <Bar dataKey="cityPet" name="CityPet" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="chart-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <p className="chart-title">Distribución por App Cliente</p>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={ANALYTICS_DATA.appDistribution}
                  cx="50%" cy="50%"
                  innerRadius={55} outerRadius={80}
                  dataKey="value"
                  paddingAngle={3}
                >
                  {ANALYTICS_DATA.appDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => [`${v}%`, 'Participación']}
                  contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-default)', borderRadius: 8, color: 'var(--text-primary)', fontSize: '0.8rem' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', gap: 16, marginTop: 4 }}>
              {ANALYTICS_DATA.appDistribution.map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: d.color }} />
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{d.name} {d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Monthly trend line chart */}
      <div className="chart-card">
        <p className="chart-title">Tendencia Mensual — Transacciones por Semana</p>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={ANALYTICS_DATA.monthlyTrend} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
            <XAxis dataKey="week" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-default)', borderRadius: 8, color: 'var(--text-primary)', fontSize: '0.8rem' }}
            />
            <Line
              type="monotone" dataKey="transacciones" name="Transacciones"
              stroke="url(#lineGrad)" strokeWidth={3}
              dot={{ fill: '#7c3aed', r: 5, strokeWidth: 0 }}
              activeDot={{ r: 7, fill: '#06b6d4' }}
            />
            <defs>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
