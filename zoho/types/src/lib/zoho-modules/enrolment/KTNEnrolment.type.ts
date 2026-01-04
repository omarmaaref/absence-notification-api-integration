import { LookUp, Tag } from '../../zoho-request/zoho-api.types';
import { ZohoModules } from '../zoho.modules';
import { Deal } from '../deal/deal.type';
import { Product } from '../product/product.type';
import { Course } from '../course/course.type';
import { Note } from '../note/note.type';
import { Attachment } from '../attachment/attachment.type';

// Enrolment (Kursteilnahme) -------------------------------
export interface KTNEnrolment {
  // Branding
  _type: 'Kursteilnahme';

  // key
  id: string;

  // Lookups
  measure?: LookUp;
  Kurse?: LookUp;

  // Strings
  Name?: string;
  integrationMessages?: string;
  course_type?: string;
  measureCode?: string;
  companyCourseId?: string;
  azureUserId?: string;
  Status?: string; // pretty sure this in NOT just any string
  certificate_entry_id?: string;
  deviating_degree_title?: string;
  Unterrichtsart?: string;

  // number
  uw_without_vacation?: number;
  teaching_units?: number;
  durationInWeeks?: number;
  Reihenfolge?: number;
  percentage?: number;
  UE?: number;

  // boolean
  mkReplacement?: boolean;
  Zertifikat_erstellt?: boolean;
  Startkurs?: boolean;
  Letzter_Kurs?: boolean;

  // Dates
  Kursende?: Date;
  Kursstart?: Date;

  // Objects
  Kursteilnahmen?: {
    name: string;
    id: string;
  };
  Abschluss?: {
    name: string;
    id: string;
  };

  // special
  softwareLicenses?: string | string[] | null;
}

export type KTNEnrolmentRelatedList<T> = T extends Note
  ? 'Notes'
  : T extends Attachment
  ? 'Attachments'
  : never;
