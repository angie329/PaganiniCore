/**
 * @typedef {Object} TransactionProperties
 * @property {string} id - Transaction ID
 * @property {'ingreso'|'egreso'} type - Transaction type
 * @property {number} amount - Transaction amount
 * @property {string} description - Description
 * @property {string} counterpart - Counterpart name
 * @property {string} [counterpartEmail] - Counterpart email
 * @property {string} date - Date ISO string
 * @property {string} status - Status (e.g. exitoso)
 * @property {string} category - Category
 * @property {number} [fee] - Fee amount
 * @property {string} [reference] - Reference code
 * @property {string} [hash] - Hash
 * @property {string} [serverTimestamp] - Server timestamp
 * @property {string} [ipOrigin] - IP Origin
 * @property {string} [gateway] - Gateway
 * @property {string[]} [pipeline] - Pipeline steps
 */

export class Transaction {
  /**
   * @param {TransactionProperties} props
   */
  constructor(props) {
    this.id = props.id;
    this.type = props.type;
    this.amount = props.amount;
    this.description = props.description;
    this.counterpart = props.counterpart;
    this.counterpartEmail = props.counterpartEmail;
    this.date = props.date;
    this.status = props.status;
    this.category = props.category;
    this.fee = props.fee || 0;
    this.reference = props.reference;
    this.hash = props.hash;
    this.serverTimestamp = props.serverTimestamp;
    this.ipOrigin = props.ipOrigin;
    this.gateway = props.gateway;
    this.pipeline = props.pipeline;
  }
}
