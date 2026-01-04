import { LookUp, Tag } from '../../zoho-request/zoho-api.types';
import { Note } from '../note/note.type';
import { Attachment } from '../attachment/attachment.type';

export type CourseEnrollment = {
  id?: string;
  _type: 'CourseEnrollment';
  name?: string;
  course_version?: LookUp;
  contact?: LookUp;
  deal?: LookUp;
  status?: string;
  start_date?: string;
  product?: LookUp;
  certificate_entry_id?: string;
  end_date?: string;
  result?: number;
  earlier_start_date?: string;
  measure_sheet_entry?: LookUp;
  position?: number;
  start_course?: boolean;
  end_course?: boolean;
  certificate_entry?: LookUp;
};

export type EnrolmentRelatedList<T> = T extends Note
  ? 'Notes'
  : T extends Attachment
  ? 'Attachments'
  : never;
