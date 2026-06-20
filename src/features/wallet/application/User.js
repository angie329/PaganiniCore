/**
 * @typedef {Object} UserProperties
 * @property {string} id - Unique identifier
 * @property {string} email - Email address
 * @property {string} name - Full name
 * @property {string} [avatar] - Avatar initials
 * @property {string} [phone] - Phone number
 * @property {string} [joinedAt] - Date joined
 */

export class User {
  /**
   * @param {UserProperties} props
   */
  constructor({ id, email, name, avatar, phone, joinedAt }) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.avatar = avatar;
    this.phone = phone;
    this.joinedAt = joinedAt;
  }
}
