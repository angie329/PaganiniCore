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

// --- PDF Export (jsPDF + autoTable) ---
export async function exportAuditPDF({ transactions, dbBalance, calculatedBalance, isIntact, discrepancyAmount }) {
  const { default: jsPDF } = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');

  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const today = new Date();
  const dateStr = today.toLocaleDateString('es-EC', { day: '2-digit', month: 'long', year: 'numeric' });
  const timeStr = today.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  // ── Header band ──────────────────────────────────────────
  doc.setFillColor(124, 58, 237); // brand purple
  doc.rect(0, 0, pageW, 22, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('PAGANINI — Reporte de Auditoría de Integridad', 14, 10);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generado: ${dateStr} a las ${timeStr}`, 14, 17);
  doc.text('ecosistema.paganini.ec', pageW - 14, 17, { align: 'right' });

  // ── Audit summary ─────────────────────────────────────────
  let y = 30;
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Resumen de Auditoría', 14, y);
  y += 7;

  const summaryItems = [
    ['Usuario auditado', 'Angie Alfonso (angie@espol.edu.ec)'],
    ['Fecha de auditoría', `${dateStr}`],
    ['Saldo registrado en DB', `$${dbBalance.toFixed(2)}`],
    ['Saldo calculado (Σ TX)', `$${calculatedBalance.toFixed(2)}`],
    ['Estado de integridad', isIntact ? '✓ ÍNTEGRO — Sin diferencias' : '⚠ DESCUADRE DETECTADO'],
    ['Diferencia detectada', discrepancyAmount !== 0 ? `$${Math.abs(discrepancyAmount).toFixed(2)}` : '$0.00'],
    ['Total de transacciones', `${transactions.length}`],
  ];

  doc.setFontSize(9);
  const colW = (pageW - 28) / 2;
  summaryItems.forEach(([label, value], i) => {
    const col = i % 2 === 0 ? 14 : 14 + colW + 4;
    const row = Math.floor(i / 2);
    const rowY = y + row * 10;

    // light bg alternating
    if (Math.floor(i / 2) % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(col - 2, rowY - 5, colW, 9, 'F');
    }

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 116, 139);
    doc.text(label, col, rowY);
    doc.setFont('helvetica', 'normal');
    // Color for integrity status
    if (label === 'Estado de integridad') {
      doc.setTextColor(isIntact ? 5 : 220, isIntact ? 150 : 38, isIntact ? 105 : 38);
    } else if (label === 'Diferencia detectada' && discrepancyAmount !== 0) {
      doc.setTextColor(220, 38, 38);
    } else {
      doc.setTextColor(15, 23, 42);
    }
    doc.text(value, col, rowY + 4.5);
    doc.setTextColor(15, 23, 42);
  });

  y += Math.ceil(summaryItems.length / 2) * 10 + 8;

  // Integrity status banner
  if (!isIntact) {
    doc.setFillColor(254, 242, 242);
    doc.setDrawColor(220, 38, 38);
    doc.roundedRect(14, y - 1, pageW - 28, 10, 2, 2, 'FD');
    doc.setTextColor(185, 28, 28);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(`⚠  ALERTA: Descuadre de $${Math.abs(discrepancyAmount).toFixed(2)} detectado. Se requiere revisión inmediata.`, 18, y + 6);
  } else {
    doc.setFillColor(240, 253, 244);
    doc.setDrawColor(22, 163, 74);
    doc.roundedRect(14, y - 1, pageW - 28, 10, 2, 2, 'FD');
    doc.setTextColor(21, 128, 61);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('✓  Saldo íntegro: el balance registrado coincide exactamente con el historial de transacciones.', 18, y + 6);
  }
  y += 18;

  // ── Transactions table ────────────────────────────────────
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Registro Detallado de Transacciones', 14, y);
  y += 4;

  // Build running balance
  let running = 0;
  const tableRows = [...transactions].reverse().map(tx => {
    const delta = tx.type === 'ingreso' ? tx.amount : -(tx.amount + (tx.fee || 0));
    running = Math.round((running + delta) * 100) / 100;
    return [
      tx.id,
      new Date(tx.date).toLocaleDateString('es-EC', { day: '2-digit', month: 'short', year: 'numeric' }),
      tx.type.toUpperCase(),
      tx.description.length > 30 ? tx.description.slice(0, 28) + '…' : tx.description,
      `$${tx.amount.toFixed(2)}`,
      `$${(tx.fee || 0).toFixed(2)}`,
      tx.status,
      `$${running.toFixed(2)}`,
    ];
  });

  autoTable(doc, {
    startY: y,
    head: [['ID TX', 'Fecha', 'Tipo', 'Descripción', 'Monto', 'Comisión', 'Estado', 'Saldo Acum.']],
    body: tableRows,
    theme: 'striped',
    headStyles: {
      fillColor: [124, 58, 237],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'center',
    },
    bodyStyles: { fontSize: 8, textColor: [30, 41, 59] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { fontStyle: 'bold', textColor: [124, 58, 237] },
      2: { halign: 'center' },
      4: { halign: 'right' },
      5: { halign: 'right' },
      6: { halign: 'center' },
      7: { halign: 'right', fontStyle: 'bold' },
    },
    margin: { left: 14, right: 14 },
    didDrawCell: (data) => {
      if (data.section === 'body' && data.column.index === 2) {
        const val = data.cell.raw;
        if (val === 'INGRESO') doc.setTextColor(5, 150, 105);
        else doc.setTextColor(220, 38, 38);
      }
    },
  });

  // ── Footer ────────────────────────────────────────────────
  const pageCount = doc.internal.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    const footY = doc.internal.pageSize.getHeight() - 8;
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text('Paganini Ecosystem · Reporte confidencial de auditoría · uso interno', 14, footY);
    doc.text(`Página ${p} de ${pageCount}`, pageW - 14, footY, { align: 'right' });
  }

  doc.save(`paganini_auditoria_${today.toISOString().slice(0, 10)}.pdf`);
}

// --- Time remaining ---
export function msToMinSec(ms) {
  const totalSec = Math.ceil(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}
