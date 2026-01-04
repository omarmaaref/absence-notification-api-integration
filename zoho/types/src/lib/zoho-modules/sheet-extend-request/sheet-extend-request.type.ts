import { MeasureSheetEntry } from '../measure-sheet-entry/measure-sheet-entry.type';
import { Attachment } from '../attachment/attachment.type';
import { LookUp } from '../../zoho-request/zoho-api.types';

export type SheetExtendRequest = {
  _type?: 'SheetExtendRequest';
  id?: string;
  content?: string;
  entry_requirements?: string;
  measure_sheet?: LookUp;
  short_desc_goal?: string;
  teaching_method?: string;
  status?: string;
};

export type SheetExtendRequestRelatedList<T> = T extends MeasureSheetEntry
  ? 'attachment_two'
  : T extends Attachment
  ? 'Attachments'
  : never;
