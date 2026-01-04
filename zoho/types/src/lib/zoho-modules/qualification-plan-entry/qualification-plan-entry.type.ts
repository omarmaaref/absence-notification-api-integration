import { Note } from '../note/note.type';
import { Attachment } from '../attachment/attachment.type';
import { LookUp } from '../../zoho-request/zoho-api.types';

export interface QualificationPlanEntry {
  _type?: 'QualificationPlanEntry';
  id?: string;
  companyCourseId?: string;
  mkReplacement?: boolean;
  kurse?: LookUp;
  startDateData?: Date;
  endDateData?: Date;
  deviating_degree_title?: string;
  Name?: string;
  status?: string;
  hours?: number;
  qualificationPlan?: LookUp;
  startDate?: string;
  endDate?: string;
  durationInWeeks?: number;
  firstCourseOfMeasure?: boolean;
  lastCourseOfMeasure?: boolean;
  teaching_units?: number;
  measure?: LookUp;
  order?: number;
}

export type QualificationPlanEntryRelatedList<T> = T extends Note
  ? 'Notes'
  : T extends Attachment
  ? 'Attachments'
  : never;
