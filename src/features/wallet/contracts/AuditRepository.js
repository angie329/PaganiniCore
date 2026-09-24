/**
 * @interface AuditRepository
 * Port for audit, reconciliation and security log operations.
 */
export class AuditRepository {
  /**
   * @returns {Promise<object>}
   */
  async getReconciliationData() {
    throw new Error('Not implemented');
  }

  /**
   * @returns {Promise<object>}
   */
  async getMerchant() {
    throw new Error('Not implemented');
  }
}
