import { User } from './user.model';

/**
 * Defines an interface for Message object type.
 * @property {string} text - message text.
 * @property {User} sender - user object who sent the message.
 * @property {Date} sentDate - time and date object when message was sent.
 */
export interface Message {
  text: string;
  sender: User;
  sentDate: Date;
}
