import { useMemo } from 'react';
import { MockWalletAdapter } from './MockWalletAdapter';

const walletAdapterInstance = new MockWalletAdapter();

export function useWallet() {
  return useMemo(() => walletAdapterInstance, []);
}
