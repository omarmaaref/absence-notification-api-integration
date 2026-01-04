import { Attachment } from '../attachment/attachment.type';
import { Deal } from '../deal/deal.type';
import { Note } from '../note/note.type';

export type Absence = {
  _type: 'Absence';
  id: string;
  reason: string;
  type: string;
  start_date?: string;
  end_date?: string;
  deal?: { id: string } | Deal;
};

export type AbsenceRelatedList<T> = T extends Note
  ? 'Notes'
  : T extends Attachment
  ? 'Attachments'
  : never;
