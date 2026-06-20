import { useMemo } from 'react';
import { MockWalletAdapter } from '../../adapters/mock/MockWalletAdapter';

const walletAdapterInstance = new MockWalletAdapter();

export function useWallet() {
  return useMemo(() => walletAdapterInstance, []);
}
