/**
 * @interface AnalyticsRepository
 * Port for analytics and reporting operations.
 */
export class AnalyticsRepository {
  /**
   * @returns {Promise<object>}
   */
  async getAnalyticsData() {
    throw new Error('Not implemented');
  }

  /**
   * @returns {Promise<object>}
   */
  async getUsers() {
    throw new Error('Not implemented');
  }

  /**
   * @returns {Promise<import('../application/Transaction').Transaction[]>}
   */
  async getAllTransactions() {
    throw new Error('Not implemented');
  }
}
