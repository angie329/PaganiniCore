// PhoneFrame — simulates a smartphone container
import { useEffect, useState } from 'react';

export default function PhoneFrame({ children }) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    update();
    const t = setInterval(update, 30000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="phone-wrapper">
      <div className="phone-frame animate-fade-in-up">
        <div className="phone-notch" />
        <div className="phone-screen">
          {/* Status Bar */}
          <div className="phone-status-bar">
            <span style={{ fontSize: '0.72rem', fontWeight: 700 }}>{time}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {/* Signal */}
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                <rect x="0" y="8" width="3" height="4" rx="1" fill="white" fillOpacity="0.9" />
                <rect x="4.5" y="5" width="3" height="7" rx="1" fill="white" fillOpacity="0.9" />
                <rect x="9" y="2.5" width="3" height="9.5" rx="1" fill="white" fillOpacity="0.9" />
                <rect x="13.5" y="0" width="2.5" height="12" rx="1" fill="white" fillOpacity="0.5" />
              </svg>
              {/* WiFi */}
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                <path d="M8 10.5 L8 10.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M5.2 7.8 C6.2 6.8 9.8 6.8 10.8 7.8" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.9" />
                <path d="M3 5.5 C5 3.5 11 3.5 13 5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7" />
                <path d="M0.5 3 C3.5 0.2 12.5 0.2 15.5 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5" />
              </svg>
              {/* Battery */}
              <svg width="22" height="12" viewBox="0 0 22 12" fill="none">
                <rect x="0.5" y="0.5" width="18" height="11" rx="2.5" stroke="white" strokeOpacity="0.7" />
                <rect x="2" y="2" width="14" height="8" rx="1.5" fill="white" fillOpacity="0.9" />
                <path d="M19.5 4.5 L19.5 7.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.7" />
              </svg>
            </div>
          </div>
          {/* Content */}
          <div className="phone-content">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
