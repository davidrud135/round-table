import { User } from './user.model';

/**
 * Defines an interface for Message object.
 * @property {string} text - message text.
 * @property {User} sender - user data who sent the message.
 * @property {firebase.firestore.Timestamp} sentAt - Firestore Timestamp object
 *  contains info about the moment when message was sent.
 */
export interface Message {
  text: string;
  sender: User;
  sentAt: firebase.firestore.Timestamp;
}
