import { HardwareRental } from '../hardware-rental/hardware-rental.type';
import { QualificationPlanEntry } from '../qualification-plan-entry/qualification-plan-entry.type';
import { Note } from '../note/note.type';
import { Attachment } from '../attachment/attachment.type';
import { KTNEnrolment } from '../enrolment/KTNEnrolment.type';

export interface Course {
  _type: 'Course';
  course_id?: string;
  id?: string;
}

export type CourseRelatedList<T> = T extends Note
  ? 'Notes'
  : T extends Attachment
  ? 'Attachments'
  : T extends KTNEnrolment
  ? 'Contacts9'
  : T extends KTNEnrolment
  ? 'Software_Lizenz1'
  : T extends QualificationPlanEntry
  ? 'Qualiplan_Eintr_ge'
  : T extends HardwareRental
  ? 'Hardwareverleihe'
  : never;
