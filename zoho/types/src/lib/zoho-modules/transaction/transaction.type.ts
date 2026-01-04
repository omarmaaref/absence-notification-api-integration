import { Attachment } from '../attachment/attachment.type';
import { Note } from '../note/note.type';

export interface Transaction {
  _type: 'Transaction';
}

export type TransactionRelatedList<T> = T extends Note
  ? 'Notes'
  : T extends Attachment
  ? 'Attachments'
  : never;
