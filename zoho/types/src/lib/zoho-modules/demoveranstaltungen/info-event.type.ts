import { Note } from '../note/note.type';
import { Attachment } from '../attachment/attachment.type';
import { Lead } from '../lead/lead.type';

export interface InfoEvent {
  _type: 'InfoEvent';
  id?: string;
  language?: string;
  Name?: string;
  Termin?: string;
  day_of_week?: string;
}

export type InfoEventRelatedList<T> = T extends Note
  ? 'Notes'
  : T extends Attachment
  ? 'Attachments'
  : T extends Lead
  ? 'Leads'
  : never;
