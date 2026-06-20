import { Transaction } from './Transaction';

/**
 * @typedef {Object} WalletProperties
 * @property {string} userId - User ID associated with the wallet
 * @property {number} balance - Current balance
 * @property {Transaction[]} transactions - List of transactions
 */

export class Wallet {
  /**
   * @param {WalletProperties} props
   */
  constructor({ userId, balance, transactions = [] }) {
    this.userId = userId;
    this.balance = balance;
    this.transactions = transactions;
  }

  /**
   * @param {number} amount
   * @returns {boolean}
   */
  canWithdraw(amount) {
    return this.balance >= amount;
  }
}
