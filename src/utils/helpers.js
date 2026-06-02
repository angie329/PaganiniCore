// ============================================================
// PAGANINI ECOSYSTEM — UTILITY FUNCTIONS
// ============================================================

// --- Formatters ---
export function formatCurrency(amount) {
  return new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(amount);
}

export function formatDate(isoString) {
  const d = new Date(isoString);
  return d.toLocaleDateString('es-EC', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatDateTime(isoString) {
  const d = new Date(isoString);
  return d.toLocaleString('es-EC', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
}

export function formatTime(isoString) {
  const d = new Date(isoString);
  return d.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' });
}

export function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Buenos días';
  if (h < 18) return 'Buenas tardes';
  return 'Buenas noches';
}

// --- Generators ---
export function generateTxId() {
  const num = Math.floor(Math.random() * 9000) + 1000;
  return `TX-${num}`;
}

export function generateRef() {
  return `REF-${Math.floor(Math.random() * 90000) + 10000}`;
}

export function generateHash() {
  return Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

export function generateClientId(appName) {
  const slug = appName.toLowerCase().replace(/\s+/g, '').slice(0, 8);
  const rand = Array.from({ length: 12 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  return `pag_live_${slug}${rand}`;
}

export function generateClientSecret() {
  return `pag_secret_${Array.from({ length: 24 }, () => Math.floor(Math.random() * 36).toString(36)).join('')}`;
}

// --- Validators ---
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// --- CSV Export ---
export function exportTransactionsCSV(transactions, balanceActual) {
  const headers = ['ID', 'Fecha', 'Tipo', 'Descripcion', 'Contraparte', 'Monto', 'Comision', 'Estado', 'Referencia'];
  const rows = transactions.map(tx => [
    tx.id,
    tx.date,
    tx.type,
    tx.description,
    tx.counterpart,
    tx.amount.toFixed(2),
    (tx.fee || 0).toFixed(2),
    tx.status,
    tx.reference,
  ]);
  const csvContent = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `paganini_auditoria_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// --- Time remaining ---
export function msToMinSec(ms) {
  const totalSec = Math.ceil(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}
