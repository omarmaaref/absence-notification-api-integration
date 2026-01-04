import { Attachment } from '../attachment/attachment.type';
import { Note } from '../note/note.type';
import { QualificationPlan } from '../qualification-plan/qualification-plan.type';
import { LookUp } from '../../zoho-request/zoho-api.types';
import { Expose } from 'class-transformer';

export interface ZohoBaseDTO {
  Created_By?: string;
  Modified_By?: string;
  id?: string;
  Currency?: string;
  Description?: string;
  Exchange_Rate?: number;
  Ownership?: string;
}

export interface CreateCourseAppointmentDTO {
  hours_per_week: number;
  startDate: string; //x
  vacationStart?: string; //x
  vacationEnd?: string;
}

export interface ZohoCourseBaseDTO extends ZohoBaseDTO {
  Name?: string;
  Kurs_ID?: string;
  order?: number;
  startDate?: string;
  durationInWeeks: number;
  endDate?: string;
  kurse?: LookUp;
  measure?: LookUp;
  companyCourseId?: string;
  mkReplacement?: boolean;
  Course_id_new?: string;
  teaching_units?: number;
  firstCourseOfMeasure?: boolean;
  lastCourseOfMeasure?: boolean;
}

export interface CreateZohoBaseCourseAppointmentDTO extends ZohoCourseBaseDTO {
  id?: string;
  companyCourseId?: string;
  kurse?: LookUp;
  Kurse?: LookUp;
  measure?: LookUp;
  order: number;
  durationInWeeks: number;
  mkReplacement: boolean;
  main_category_priority: number;
  sub_category_priority: number;
  sub_level_priority: number;
  level_priority: number;
  teaching_units?: number;
}

export interface QuotedItem {
  measureCategory: string;
  product_title_1: string;
  certificate_id: string;
  Product_Name: {
    Product_Code: string;
    name: string;
    id: string;
  };
  is_shell: boolean;
  product_title: string;
  List_Price: number;
  Unterrichtseinheiten: number;
  module_number?: number | null;
  product_id: string;
  Online: boolean;
}

export type Quote = {
  _type: 'Quote';
  funding_instrument?: string;
  degree_designation: LookUp;
  ptb_template_id?: string;
  quote_template_id?: string;
  startDate?: string;
  hours_per_week_2?: number;
  pdf_status: string;
  suitability_assessment: LookUp;
  id: string;
  measure_sheet_status: string;
  degree_title: string;
  Tag?: LookUp[];
  createdAt?: string;
  Quote_Stage: string;
  offerNumber: string;
  product_package?: LookUp;
  product_package_degree_designation?: string;
  Deal_Name?: LookUp;
  hours_per_week: number;
  measuresSheet?: LookUp;
  Contact_Name?: LookUp;
  Quoted_Items?: QuotedItem[];
  vacationStart?: string;
  vacationEnd?: string;
  Enddatum?: string;
  durationInWeeksPT?: number;
  durationInMonthsPT?: number;
  durationInWeeksFT?: number;
  durationInMonthsFT?: number;
  educationTimeKind?: string;
  Learning_Method?: string;
  totalEU?: number;
  price?: number;
  avgPricePerEU?: number;
  otherLearningContent?: boolean;
  Subject?: string;
  measureNumber?: string;
  Account_Name?: LookUp;
  additionalAgreement?: string;
  Billing_City?: string;
  Billing_Code?: string;
  Billing_Street?: string;
  alternative_quote?: LookUp;
  measure_sheet_category_name?: string;
  Sub_Total?: number;
  Grand_Total?: number;
  Tax?: number;
  Discount?: number;
  payment_plan?: 'Einmalzahlung' | 'Monatliche Zahlung';
};

export type QuoteRelatedList<T> = T extends Note
  ? 'Notes'
  : T extends QualificationPlan
  ? 'Qualifizierungsplan'
  : T extends Attachment
  ? 'Attachments'
  : T extends Quote
  ? 'Followup_Quotes'
  : never;

export class QuoteMeasureSheetDTO
  implements
    Pick<
      Quote,
      | 'pdf_status'
      | 'id'
      | 'measuresSheet'
      | 'measureNumber'
      | 'measure_sheet_status'
    >
{
  @Expose()
  id: string;
  @Expose()
  measureNumber: string;
  @Expose()
  measuresSheet: LookUp;
  @Expose()
  pdf_status: string;
  @Expose()
  measure_sheet_status: string;
}
