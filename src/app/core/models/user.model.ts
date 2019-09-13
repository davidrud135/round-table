/**
 * Defines interface for user object type.
 * @property {string} uid - user unique id.
 * @property {string} email - user email.
 * @property {string} displayName - user display name.
 * @property {string} photoURL - user avatar photo URL.
 */
export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
}
