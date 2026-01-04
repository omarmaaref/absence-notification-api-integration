import { LookUp, LookUpDTO } from '../../zoho-request/zoho-api.types';
import { Attachment } from 'airtable/lib/attachment';
import { Note } from '../note/note.type';
import { QualificationPlanEntry } from '../qualification-plan-entry/qualification-plan-entry.type';
import { AirtableBaseDTO } from '@company/airtable-lib';
import { ZohoCourseBaseDTO } from '../quote/quote.type';
import { LearningPlanItem } from '@company/content-generation-lib';

export type QualificationPlan = {
  // branding
  _type: 'qualificationPlans';

  // key
  id: string;

  // lookup
  quote?: LookUp;
  deal?: LookUp;

  // string
  status?: string;

  // date
  startDate: string;
  endDate?: string;
};

export interface ZohoBaseCourseAppointmentDTO extends ZohoCourseBaseDTO {
  id?: string;
  companyCourseId?: string;
  kurse: LookUp;
  measure: LookUp;
  startDate: string;
  endDate: string;
  startDateData?: Date;
  endDateData?: Date;
  durationInWeeks: number;
  firstCourseOfMeasure?: boolean;
  lastCourseOfMeasure?: boolean;
  order: number;
  mkReplacement: boolean;
  teaching_units?: number;
}

export type QualificationPlanRelatedList<T> = T extends Note
  ? 'Notes'
  : T extends QualificationPlanEntry
  ? 'Eintrag'
  : T extends Attachment
  ? 'Attachments'
  : never;

export class AirtableLegalHolidaysDTO extends AirtableBaseDTO {
  next_up_coming_date: string;
}

export class AirtableMKAppointment extends AirtableBaseDTO {
  active_enrollment_count: number;
  start_date: string;
}

export interface AirtableZohoCourseVersionDTO extends AirtableBaseDTO {
  id: string;
  course_version: string;
  course_id: string;
  course_name: string;
  course_content_topic_point_with_teaching_units: string[];
}

export interface AirtableCourseSortDTO {
  id: string;
  course_id: string;
  course_name: string;
  main_category_priority: number;
  sub_category_priority: number;
  level_priority: number;
  sub_level_priority: number;
  teaching_weeks_ft: number;
  zoho_crm_pa_ids: string[];
  project_work_zoho_ids: string[];
  course_content_topics_with_ue: string[];
  teaching_units: number;
  required_courses_ids: string[];
  required_courses_names: string[];
  course_status?: string;
}

export interface CourseSortDTO {
  companyId: string;
  name: string;
  main_category_priority: number;
  sub_category_priority: number;
  level_priority: number;
  sub_level_priority: number;
  measureCertificateEntryId?: string;
  pas?: ZohocompanyCourseIdDTO[];
  durationInWeeks: number;
  isMeasureStartCourse?: boolean;
  isMeasureEndCourse?: boolean;
  mkReplacement?: boolean;
  course_content_topics_with_ue: string[];
  teaching_units?: number;
  required_courses_ids?: string[];
  required_courses_names?: string[];
}

export interface AirtableZohoProductDTO extends AirtableBaseDTO {
  learning_plan: string;
  learning_method?: string;
  included_courses_ids: string[];
  product_title: string;
  chance_and_potentials_female: string;
  course_airtable_ids: string[];
  certificate_entry_id: string;
  degree_designation: string[];
  chance_and_potentials: string;
  measures_sheet_categories_ids: string[];
  measure_sheet_category_names: string[];
  product_included_courses_names: string[];
  potential_course_replacement_names: string[];
  main_course_name: string[];
  main_course_teaching_units: number[];
  potential_course_replacement_ids: string[];
  female_labor_market_relevance_quote: string;
  male_labor_market_relevance_quote: string;
  certificate_title: string;
  certificate_full_time_teaching_units_per_week: number[];
}

export interface AirtableMeasuresDTO {
  learning_plan: LearningPlanItem[];
  included_courses_ids: string[];
  potential_course_replacement_ids: string[];
  main_course_name: string;
  main_course_teaching_units: number;
  certificate_id?: string;
  chance_and_potentials?: string;
  chance_and_potentials_female?: string;
  degree_designation: string;
  title: string;
  learning_method?: string;
  courses: CourseSortDTO[];
  measure_sheet_category_names?: string[];
  measures_sheet_categories_ids: string[];
  product_included_courses_names: string[];
  potential_course_replacement_names: string[];
  female_labor_market_relevance_quote: string;
  male_labor_market_relevance_quote: string;
  certificate_full_time_teaching_units_per_week?: number[];
}

export interface ZohocompanyCourseIdDTO {
  zohoId: string;
  companyId: string;
}

export interface AirtableCourseDTO {
  companyId: string;
  name: string;
  hours: number;
  main_category_priority: number;
  sub_category_priority: number;
  level_priority: number;
  sub_level_priority: number;
  zohoId: string;
  pas: ZohocompanyCourseIdDTO[];
  durationInWeeks: number;
  course_content_topics_with_ue: string[];
  measureCertificateEntryId: string;
}

export interface CourseRelatedProjectWork {
  companyCourseId: string;
  paIds: ZohocompanyCourseIdDTO[];
}

export interface AirtableLectureFreePeriodDTO {
  is_monday?: boolean;
  lecture_free_period_id?: string;
  start_date: Date;
  end_date: Date;
}

export interface CoursePAMapping {
  companyCourseId: string;
  paIds: ZohocompanyCourseIdDTO[];
}
