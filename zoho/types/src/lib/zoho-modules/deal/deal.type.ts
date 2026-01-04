import { LookUp, Tag } from '../../zoho-request/zoho-api.types';
import { Note } from '../note/note.type';
import { Contact } from '../contact/contact.type';
import { Attachment } from '../attachment/attachment.type';
import { Product } from '../product/product.type';
import { KTNEnrolment } from '../enrolment/KTNEnrolment.type';
import { Debtor } from '../debtor/debtor.type';
import { HardwareRental } from '../hardware-rental/hardware-rental.type';
import { QualificationPlan } from '../qualification-plan/qualification-plan.type';
import { AccountsReceivable } from '../accounts-receivable/accounts-receivable.type';
import { Quote } from '../quote/quote.type';
import { Absence } from '../absence/absence.type';
import { ContactRole } from './contact-role.type';
import { AbsenceNotification } from '../absence-notification/absence-notification.type';

// Deal -------------------------------
export type Deal = {
  // branding
  _type: 'Deals';
  // key
  id: string;
  consultation_protocol?: string;
  learning_method?: string;
  // Lookups
  Berater?: LookUp;
  Standort?: LookUp;
  actionSheet?: LookUp;
  Account_Name?: LookUp;
  contract_template_id?: string;
  // Strings
  Closing_Date?: string;
  lastDayOfParticipation?: string;
  vacationStart?: string;
  vacationEnd?: string;
  Amount?: number;
  BGS_Nummer?: string;
  examination_regulation?: string;
  additionalAgreement?: string;
  Deal_Name?: string;
  Abschluss_ID?: string;
  startDate?: string;
  endDate?: string;
  educationTimeKind?: string;
  hours_per_week?: number;
  Ma_nahmenummer1?: string; // Massnahmenummer
  Stage?: string;
  // Arrays
  Tag?: Tag[];

  // Objects
  Contact_Name?: {
    name: string;
    id: string;
  };
  Modified_By?: {
    name: string;
    id: string;
    email: string;
  };
  recipient_type?: string;
  receiver_type: string;
  business_type?: string;
  preferred_language?: string;
  product_languages?: string[];
  overall_degree_title?: string;
  recipient_other?: string;
  street_other?: string;
  plz_other?: string;
  city_other?: string;
  packing_station_number?: string;
  post_number?: string;
  plz_packing_station?: string;
  city_packing_station?: string;
  funding_instrument?: string;
  Absence_Notifications?: AbsenceNotification[] | { Absence_Notifications: { id: string } }[];
};

export type DealRelatedList<T> = T extends Note
  ? 'Notes'
  : T extends ContactRole
  ? 'Contact_Roles'
  : T extends Contact
  ? 'Contact_Roles'
  : T extends Attachment
  ? 'Attachments'
  : T extends Quote
  ? 'Quotes'
  : T extends Product
  ? 'Products'
  : T extends KTNEnrolment
  ? 'Kursteilnahme'
  : T extends Debtor
  ? 'Erwarteter_Zahlungseingang'
  : T extends HardwareRental
  ? 'hardware_rentals'
  : T extends QualificationPlan
  ? 'Qualifizierungsplan'
  : T extends AccountsReceivable
  ? 'expected_payments'
  : T extends Absence
  ? 'Absences'

  : never;
