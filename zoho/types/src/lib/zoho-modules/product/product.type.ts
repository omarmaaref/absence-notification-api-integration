import { LookUp } from '../../zoho-request/zoho-api.types';
import { Attachment } from '../attachment/attachment.type';
import { Deal } from '../deal/deal.type';
import { Contact } from '../contact/contact.type';
import { KTNEnrolment } from '../enrolment/KTNEnrolment.type';
import { QualificationPlanEntry } from '../qualification-plan-entry/qualification-plan-entry.type';
import { Lead } from '../lead/lead.type';
import { MeasureSheetEntry } from '../measure-sheet-entry/measure-sheet-entry.type';

// "Maßnahmen"
export type Product = {
  // branding
  _type: 'Products';

  // key
  id: string;
  Name?: string;
  // Strings
  Zertifikats_Id?: string;
  Produkt_Id?: string;
  Product_Code?: string;
  Product_Name?: string;
  Abschlussbezeichnung?: string;
  external_id?: string;

  // Numbers
  durationInWeeks?: number;
  Unterrichtseinheiten?: number;

  // Booleans
  isOnline?: boolean;

  // Arrays
  includedCourses?: IncludedCourses[]; // aka Subform

  // from https://www.zoho.com/crm/developer/docs/api/v7/get-records.html
  // The $has_more JSON object in the response
  // renders the API names of the subforms,
  // multi-select lookup fields and multi-user
  // lookup fields in the module with boolean values
  // to indicate whether or not there are
  // more records in these fields in the module.
  // This key is rendered in the response
  // only when you fetch a specific record.
  $has_more?: {
    [key: string]: boolean;
  };
};

export type IncludedCourses = {
  id: string;
  course: LookUp;
  Parent_Id: LookUp;
  courseID: string;
  status: string;
  order: number;
  durationInWeeks: number;
};

export type ProductRelatedList<T> = T extends Attachment
  ? 'Attachments'
  : T extends Deal
  ? 'Deals'
  : T extends Contact
  ? 'Contacts'
  : T extends KTNEnrolment
  ? 'Kursteilnahme'
  : T extends QualificationPlanEntry
  ? 'Qualiplan_Eintr_ge'
  : T extends Lead
  ? 'Leads'
  : T extends MeasureSheetEntry
  ? 'measures_sheet_entires'
  : never;
