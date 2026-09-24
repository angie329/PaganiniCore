import { createContext, useContext } from 'react';
import { MockWalletAdapter } from './MockWalletAdapter';

/** @type {import('react').Context<import('./MockWalletAdapter').MockWalletAdapter>} */
const WalletContext = createContext(null);

const defaultAdapter = new MockWalletAdapter();

/**
 * Provides a WalletRepository adapter to the subtree.
 * @param {{ adapter?: import('../contracts/WalletRepository').WalletRepository, children: import('react').ReactNode }} props
 */
export function WalletProvider({ adapter = defaultAdapter, children }) {
  return (
    <WalletContext.Provider value={adapter}>
      {children}
    </WalletContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- intentional: hook alongside provider
export function useWalletContext() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWalletContext must be used inside WalletProvider');
  return ctx;
}
