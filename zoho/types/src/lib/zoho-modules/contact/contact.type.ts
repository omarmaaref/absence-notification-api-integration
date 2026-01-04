import { Note } from '../note/note.type';
import { Attachment } from '../attachment/attachment.type';
import { Debtor } from '../debtor/debtor.type';
import { Lead } from '../lead/lead.type';
import { HardwareRental } from '../hardware-rental/hardware-rental.type';
import { AccountsReceivable } from '../accounts-receivable/accounts-receivable.type';
import { Deal } from '../deal/deal.type';
import { KTNEnrolment } from '../enrolment/KTNEnrolment.type';
import { Product } from '../product/product.type';
import { QualificationPlan } from '../qualification-plan/qualification-plan.type';
import { Absence } from '../absence/absence.type';
import { LookUp } from '../../zoho-request/zoho-api.types';
import { CourseEnrollment } from '../course-enrollment/course-enrollment.type';

export interface Contact {
  _type: 'Contact';
  Email?: string;
  Azure_Login_Email?: string;
  account_role?: string;
  id?: string;
  Moodle_Account_fertig?: boolean;
  Account_Nummer?: number;
  Account_Name?: LookUp;
  moodleUsername?: string;
  OneTimePassword?: string;
  AzureUserId?: string;
  Mailing_Zip?: string;
  Mailing_Street?: string;
  Salutation?: string;
  First_Name?: string;
  Full_Name?: string;
  Mailing_City?: string;
  Mobile?: string;
  Last_Name?: string;
  Moodle_Account_erstellen?: boolean;
  Fehlernachricht?: string;
}

export type ContactRelatedList<T> = T extends Note
  ? 'Notes'
  : T extends Deal
  ? 'Deals'
  : T extends KTNEnrolment
  ? 'Kurse19'
  : T extends Attachment
  ? 'Attachments'
  : T extends Debtor
  ? 'Erwarteter_Zahlungseingang'
  : T extends Product
  ? 'Products'
  : T extends Lead
  ? 'reference_Contact'
  : T extends HardwareRental
  ? 'Verliehene_Hardware'
  : T extends QualificationPlan
  ? 'Qualifizierungspl_ne'
  : T extends AccountsReceivable
  ? 'expected_payments'
  : T extends Absence
  ? 'Absences'
  : T extends CourseEnrollment
  ? 'enrollments'
  : never;
