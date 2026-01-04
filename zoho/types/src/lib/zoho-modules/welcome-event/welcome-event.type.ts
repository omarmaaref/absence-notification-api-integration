import { Note } from '../note/note.type';
import { Attachment } from '../attachment/attachment.type';
import { Deal } from '../deal/deal.type';

export interface WelcomeEvent {
  _type: 'WelcomeEvent';
  id?: string;
  language?: string;
  Name?: string;
  Termin?: string;
}

export type WelcomeEventRelatedList<T> = T extends Note
  ? 'Notes'
  : T extends Attachment
  ? 'Attachments'
  : T extends Deal
  ? 'Deals'
  : never;
