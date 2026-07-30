import { createContext, useContext, useReducer, useEffect } from 'react';
import { appReducer, initialState } from './appReducer';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Restore PIN block from localStorage on mount
  useEffect(() => {
    try {
      const blocked = localStorage.getItem('paganini_pin_blocked_until');
      if (blocked) {
        const until = Number(blocked);
        if (until > Date.now()) {
          dispatch({ type: 'INIT_PIN_BLOCK', payload: until });
        } else {
          localStorage.removeItem('paganini_pin_blocked_until');
        }
      }
    } catch { /* localStorage may not be available in restricted environments */ }
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- intentional: custom hook exported alongside context provider
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
