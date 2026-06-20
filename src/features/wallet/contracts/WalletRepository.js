/**
 * @interface WalletRepository
 * Port for Wallet operations.
 * It abstracts the persistence and retrieval of wallet data, decoupling the UI from data access.
 */
export class WalletRepository {
  /**
   * @param {string} userId
   * @returns {Promise<import('../domain/Wallet').Wallet>}
   */
  async getWallet(userId) {
    throw new Error('Not implemented');
  }

  /**
   * @param {string} userId
   * @returns {Promise<number>}
   */
  async getBalance(userId) {
    throw new Error('Not implemented');
  }

  /**
   * @param {string} userId
   * @returns {Promise<import('../domain/Transaction').Transaction[]>}
   */
  async getTransactions(userId) {
    throw new Error('Not implemented');
  }

  /**
   * @param {string} userId
   * @param {number} amount
   * @param {string} recipientEmail
   * @param {string} [description]
   * @returns {Promise<import('../domain/Transaction').Transaction>}
   */
  async transferFunds(userId, amount, recipientEmail, description) {
    throw new Error('Not implemented');
  }

  /**
   * @param {string} userId
   * @param {import('../domain/Transaction').Transaction} transaction
   * @returns {Promise<void>}
   */
  async addTransaction(userId, transaction) {
    throw new Error('Not implemented');
  }
  async getUsers() {
    throw new Error('Not implemented');
  }

  async getMerchant() {
    throw new Error('Not implemented');
  }

  async getAnalyticsData() {
    throw new Error('Not implemented');
  }

  async getReconciliationData() {
    throw new Error('Not implemented');
  }
}
