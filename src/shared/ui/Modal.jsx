// Modal — reusable backdrop modal
import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, maxWidth = 480 }) {
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth }}>
        {title && (
          <div className="modal-header">
            <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>{title}</h3>
            <button
              className="btn btn-ghost btn-sm"
              onClick={onClose}
              style={{ padding: '4px', width: 28, height: 28, borderRadius: 'var(--radius-sm)' }}
            >
              <X size={16} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
