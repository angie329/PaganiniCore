import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { MockWalletAdapter } from './MockWalletAdapter.js';
import { INITIAL_BALANCE } from '../../../data/mockData.js';

// Nota: memoryDb es un singleton de módulo.
// Los tests corren en orden secuencial; el saldo se acumula entre casos.
// Caso 1: saldo inicial = INITIAL_BALANCE (150)
// Caso 2: transfiere 100 → saldo = 50
// Caso 3: intenta transferir 999 con saldo 50 → Fondos insuficientes
// Caso 4: 3 operaciones async deben terminar en < 3500ms

const USER = 'USR-001';
const adapter = new MockWalletAdapter();

describe('MockWalletAdapter — 4 casos esenciales', () => {

  it('Caso 1: saldo inicial correcto', async () => {
    const balance = await adapter.getBalance(USER);
    assert.strictEqual(balance, INITIAL_BALANCE);
  });

  it('Caso 2: transferencia exitosa deduce saldo', async () => {
    const before = await adapter.getBalance(USER);
    await adapter.transferFunds(USER, 100, 'recipient@test.com', 'Test transfer');
    const after = await adapter.getBalance(USER);
    assert.strictEqual(after, before - 100);
  });

  it('Caso 3: rechazo por fondos insuficientes', async () => {
    // Saldo ahora es 50. Intentar transferir 999 debe fallar.
    await assert.rejects(
      () => adapter.transferFunds(USER, 999, 'x@x.com', 'overflow'),
      /Fondos insuficientes/
    );
  });

  it('Caso 4: latencia total de 3 operaciones < 3500ms', async () => {
    const start = Date.now();
    await adapter.getBalance(USER);
    await adapter.getTransactions(USER);
    await adapter.getBalance(USER);
    const elapsed = Date.now() - start;
    assert.ok(elapsed < 3500, `Latencia ${elapsed}ms excede el límite de 3500ms`);
  });

});
