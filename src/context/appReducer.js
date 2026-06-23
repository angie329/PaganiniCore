// ============================================================
// PAGANINI ECOSYSTEM — APP REDUCER
// ============================================================
export const initialState = {
  // Auth
  isAuthenticated: false,
  currentUser: null,
  pinBlockedUntil: null,   // timestamp (ms) o null
  pinAttempts: 0,

  // Wallet
  balance: 0,
  transactions: [],

  // Apps & Admin
  registeredApps: [],
  securityAlerts: [],

  // UI flags
  walletScreen: 'dashboard', // login | dashboard | send | qr | qr_confirm | recharge | withdraw | pin
  pinContext: null,           // { action, payload } — qué acción autorizar con el PIN
};

export function appReducer(state, action) {
  switch (action.type) {

    case 'LOGIN':
      return { 
        ...state, 
        isAuthenticated: true, 
        currentUser: action.payload, 
        balance: action.payload.balance || 0,
        transactions: action.payload.transactions || [],
        walletScreen: 'dashboard' 
      };

    case 'LOGOUT':
      return { ...state, isAuthenticated: false, currentUser: null, walletScreen: 'login' };

    case 'SET_WALLET_SCREEN':
      return { ...state, walletScreen: action.payload };

    case 'SET_PIN_CONTEXT':
      return { ...state, pinContext: action.payload, walletScreen: 'pin' };

    case 'PIN_ATTEMPT_FAILED': {
      const newAttempts = state.pinAttempts + 1;
      if (newAttempts >= 3) {
        const blockedUntil = Date.now() + 15 * 60 * 1000; // 15 min
        try { localStorage.setItem('paganini_pin_blocked_until', String(blockedUntil)); } catch {}
        const newAlert = {
          id: `ALT-${Date.now()}`,
          type: 'pin_block',
          severity: 'alta',
          message: 'Usuario bloqueado por 3 intentos fallidos de PIN',
          user: state.currentUser?.email || 'desconocido',
          timestamp: new Date().toISOString(),
          resolved: false,
        };
        return {
          ...state,
          pinAttempts: 0,
          pinBlockedUntil: blockedUntil,
          securityAlerts: [newAlert, ...state.securityAlerts],
        };
      }
      return { ...state, pinAttempts: newAttempts };
    }

    case 'PIN_SUCCESS':
      return { ...state, pinAttempts: 0, pinContext: null };

    case 'UNBLOCK_PIN': {
      try { localStorage.removeItem('paganini_pin_blocked_until'); } catch {}
      const unblockAlert = {
        id: `ALT-${Date.now()}`,
        type: 'pin_unblock',
        severity: 'baja',
        message: 'Desbloqueo automático de PIN activado tras 15 minutos',
        user: state.currentUser?.email || 'desconocido',
        timestamp: new Date().toISOString(),
        resolved: true,
      };
      return {
        ...state,
        pinBlockedUntil: null,
        securityAlerts: [unblockAlert, ...state.securityAlerts],
      };
    }

    case 'ADD_TRANSACTION': {
      const tx = action.payload;
      const delta = tx.type === 'ingreso' ? tx.amount : -(tx.amount + (tx.fee || 0));
      return {
        ...state,
        balance: Math.round((state.balance + delta) * 100) / 100,
        transactions: [tx, ...state.transactions],
        walletScreen: 'dashboard',
        pinContext: null,
      };
    }

    case 'REGISTER_APP': {
      return { ...state, registeredApps: [...state.registeredApps, action.payload] };
    }

    case 'REVOKE_APP': {
      return {
        ...state,
        registeredApps: state.registeredApps.map(app =>
          app.id === action.payload ? { ...app, status: 'revocada' } : app
        ),
      };
    }

    case 'RESTORE_APP': {
      return {
        ...state,
        registeredApps: state.registeredApps.map(app =>
          app.id === action.payload ? { ...app, status: 'activa' } : app
        ),
      };
    }

    case 'ADD_SECURITY_ALERT': {
      return { ...state, securityAlerts: [action.payload, ...state.securityAlerts] };
    }

    case 'INIT_PIN_BLOCK': {
      return { ...state, pinBlockedUntil: action.payload };
    }

    default:
      return state;
  }
}
