import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_MERCHANT } from '../../data/mockData';
import { ArrowLeft } from 'lucide-react';

export default function QRScanner() {
  const { dispatch } = useApp();
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);

  const go = (screen) => dispatch({ type: 'SET_WALLET_SCREEN', payload: screen });

  const handleScan = async () => {
    setScanning(true);
    await new Promise(r => setTimeout(r, 2000));
    setScanned(true);
    await new Promise(r => setTimeout(r, 600));
    go('qr_confirm');
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#000' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(0,0,0,0.8)', flexShrink: 0 }}>
        <button onClick={() => go('dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white', display: 'flex' }}>
          <ArrowLeft size={20} />
        </button>
        <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'white' }}>Escáner QR</h2>
      </div>

      {/* Camera Simulation */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Fake camera background */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(160deg, #0a0f1a 0%, #0f1924 30%, #1a2535 60%, #0d1520 100%)',
        }} />

        {/* Grid overlay */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.05,
          backgroundImage: 'linear-gradient(rgba(6,182,212,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.5) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }} />

        {/* QR Frame */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          {/* Dark overlay around frame */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
              Enfoca el QR del comercio
            </p>
          </div>

          <div className="qr-frame">
            {/* Corners */}
            <div className="qr-corner tl" />
            <div className="qr-corner tr" />
            <div className="qr-corner bl" />
            <div className="qr-corner br" />

            {/* Inner QR placeholder */}
            <div style={{
              position: 'absolute',
              inset: 12,
              display: 'grid',
              gridTemplateColumns: 'repeat(8, 1fr)',
              gap: 2,
              opacity: 0.15,
            }}>
              {Array.from({ length: 64 }).map((_, i) => (
                <div key={i} style={{
                  background: Math.random() > 0.5 ? 'white' : 'transparent',
                  borderRadius: 1,
                }} />
              ))}
            </div>

            {/* Scan line */}
            {!scanned && <div className="qr-scan-line" />}

            {/* Scanned success overlay */}
            {scanned && (
              <div style={{
                position: 'absolute', inset: 0,
                background: 'rgba(16, 185, 129, 0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '3rem',
                animation: 'fadeIn 300ms ease',
              }}>
                ✓
              </div>
            )}
          </div>

          {/* Corner label */}
          {!scanning && !scanned && (
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', marginTop: 16 }}>
              Red Paganini • {MOCK_MERCHANT.network}
            </p>
          )}
        </div>
      </div>

      {/* Bottom controls */}
      <div style={{ padding: '20px', background: 'rgba(0,0,0,0.9)', flexShrink: 0, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <button
          className="btn btn-primary btn-full"
          onClick={handleScan}
          disabled={scanning}
          id="qr-scan-demo"
          style={{ background: 'linear-gradient(135deg, #06b6d4, #7c3aed)' }}
        >
          {scanning ? (
            <><span className="spinner" /> Detectando QR...</>
          ) : scanned ? (
            '✓ QR detectado'
          ) : (
            '⬛ Escanear QR de Local de Prueba'
          )}
        </button>
        <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', marginTop: 10 }}>
          Simula enfoque en "{MOCK_MERCHANT.name}"
        </p>
      </div>
    </div>
  );
}
