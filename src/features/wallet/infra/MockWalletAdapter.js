import { WalletRepository } from "../contracts/WalletRepository.js";
import { Wallet } from "../application/Wallet.js";
import { Transaction } from "../application/Transaction.js";
import { INITIAL_BALANCE, INITIAL_TRANSACTIONS, MOCK_USERS, MOCK_MERCHANT, ANALYTICS_DATA, RECONCILIATION_DATA } from "../../../data/mockData.js";

let memoryDb = {
  balances: {
    'USR-001': INITIAL_BALANCE,
    'USR-002': 0,
  },
  transactions: {
    'USR-001': [...INITIAL_TRANSACTIONS].map(t => new Transaction(t)),
    'USR-002': [],
  }
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export class MockWalletAdapter extends WalletRepository {
  async getWallet(userId) {
    await delay(500);
    const balance = await this.getBalance(userId);
    const transactions = await this.getTransactions(userId);
    return new Wallet({ userId, balance, transactions });
  }

  async getBalance(userId) {
    await delay(500);
    return memoryDb.balances[userId] || 0;
  }

  async getTransactions(userId) {
    await delay(500);
    return memoryDb.transactions[userId] || [];
  }

  async transferFunds(userId, amount, recipientEmail, description) {
    await delay(500);

    const balance = memoryDb.balances[userId] || 0;
    if (balance < amount) {
      throw new Error('Fondos insuficientes');
    }

    const transactionProps = {
      id: `TX-${Math.floor(Math.random() * 100000)}`,
      type: 'egreso',
      amount: amount,
      description: description || 'Transferencia',
      counterpart: recipientEmail,
      counterpartEmail: recipientEmail,
      date: new Date().toISOString(),
      status: 'exitoso',
      category: 'transferencia',
      fee: 0,
    };

    const transaction = new Transaction(transactionProps);

    memoryDb.balances[userId] -= amount;
    if (!memoryDb.transactions[userId]) {
      memoryDb.transactions[userId] = [];
    }
    memoryDb.transactions[userId].unshift(transaction);

    const recipient = Object.values(MOCK_USERS).find(u => u.email === recipientEmail);
    if (recipient) {
      memoryDb.balances[recipient.id] = (memoryDb.balances[recipient.id] || 0) + amount;
      if (!memoryDb.transactions[recipient.id]) {
        memoryDb.transactions[recipient.id] = [];
      }
      const recipientTx = new Transaction({
        ...transactionProps,
        id: `TX-${Math.floor(Math.random() * 100000)}`,
        type: 'ingreso',
      });
      memoryDb.transactions[recipient.id].unshift(recipientTx);
    }

    return transaction;
  }

  async addTransaction(userId, transaction) {
    await delay(500);
    if (!memoryDb.transactions[userId]) {
      memoryDb.transactions[userId] = [];
    }
    const newTx = new Transaction(transaction);
    memoryDb.transactions[userId].unshift(newTx);

    if (newTx.type === 'ingreso') {
      memoryDb.balances[userId] = (memoryDb.balances[userId] || 0) + newTx.amount;
    } else if (newTx.type === 'egreso') {
      memoryDb.balances[userId] = (memoryDb.balances[userId] || 0) - newTx.amount;
    }
  }

  async rechargeFunds(userId, amount, source) {
    await delay(500);
    const transactionProps = {
      id: `TX-${Math.floor(Math.random() * 100000)}`,
      type: 'ingreso',
      amount: amount,
      description: `Recarga con tarjeta`,
      counterpart: source,
      counterpartEmail: '',
      date: new Date().toISOString(),
      status: 'exitoso',
      category: 'recarga',
      fee: 0,
    };
    const transaction = new Transaction(transactionProps);
    memoryDb.balances[userId] = (memoryDb.balances[userId] || 0) + amount;
    if (!memoryDb.transactions[userId]) memoryDb.transactions[userId] = [];
    memoryDb.transactions[userId].unshift(transaction);
    return transaction;
  }

  async withdrawFunds(userId, amount, destination) {
    await delay(500);
    const balance = memoryDb.balances[userId] || 0;
    if (balance < amount) throw new Error('Fondos insuficientes');
    const transactionProps = {
      id: `TX-${Math.floor(Math.random() * 100000)}`,
      type: 'egreso',
      amount: amount,
      description: `Retiro a cuenta bancaria`,
      counterpart: destination,
      counterpartEmail: '',
      date: new Date().toISOString(),
      status: 'exitoso',
      category: 'retiro',
      fee: 0.50,
    };
    const transaction = new Transaction(transactionProps);
    memoryDb.balances[userId] -= amount;
    if (!memoryDb.transactions[userId]) memoryDb.transactions[userId] = [];
    memoryDb.transactions[userId].unshift(transaction);
    return transaction;
  }

  async getUsers() {
    await delay(200);
    return MOCK_USERS;
  }

  async getMerchant() {
    await delay(200);
    return MOCK_MERCHANT;
  }

  async getAnalyticsData() {
    await delay(200);
    return ANALYTICS_DATA;
  }

  async getReconciliationData() {
    await delay(200);
    return RECONCILIATION_DATA;
  }

  async getAllTransactions() {
    await delay(200);
    return Object.values(memoryDb.transactions).flat();
  }
}
