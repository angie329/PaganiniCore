/**
 * @interface WalletRepository
 * Port for core wallet operations.
 * It abstracts the persistence and retrieval of wallet data, decoupling the UI from data access.
 */
export class WalletRepository {
  /**
   * @param {string} userId
   * @returns {Promise<import('../application/Wallet').Wallet>}
   */
  async getWallet(_userId) {
    throw new Error('Not implemented');
  }

  /**
   * @param {string} userId
   * @returns {Promise<number>}
   */
  async getBalance(_userId) {
    throw new Error('Not implemented');
  }

  /**
   * @param {string} userId
   * @returns {Promise<import('../application/Transaction').Transaction[]>}
   */
  async getTransactions(_userId) {
    throw new Error('Not implemented');
  }

  /**
   * @param {string} userId
   * @param {number} amount
   * @param {string} recipientEmail
   * @param {string} [description]
   * @returns {Promise<import('../application/Transaction').Transaction>}
   */
  async transferFunds(_userId, _amount, _recipientEmail, _description) {
    throw new Error('Not implemented');
  }

  /**
   * @param {string} userId
   * @param {import('../application/Transaction').Transaction} transaction
   * @returns {Promise<void>}
   */
  async addTransaction(_userId, _transaction) {
    throw new Error('Not implemented');
  }

  /**
   * @param {string} userId
   * @param {number} amount
   * @param {string} source
   * @returns {Promise<void>}
   */
  async rechargeFunds(_userId, _amount, _source) {
    throw new Error('Not implemented');
  }

  /**
   * @param {string} userId
   * @param {number} amount
   * @param {string} destination
   * @returns {Promise<void>}
   */
  async withdrawFunds(_userId, _amount, _destination) {
    throw new Error('Not implemented');
  }
}
