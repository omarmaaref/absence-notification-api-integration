import { Note } from '../note/note.type';
import { LookUp } from '../../zoho-request/zoho-api.types';

export interface MeasureSheetEntry {
  _type?: 'MeasureSheetEntry';
  id?: string;
  fulltime_teaching_units_per_week?: number;
  module_number?: number;
  certificate_entry_id?: string;
  comment?: string;
  external_id?: string;
  measure_sheet?: LookUp;
  certificate_entry?: LookUp;
  extend_request?: LookUp;
  learning_method?: string;
  teaching_method?: string;
  last_entry_date?: string;
  measure_sheet_end_date?: string;
  status?: string;
  days?: number;
  teaching_units?: number;
  price?: number;
  product_name?: string;
  measure_sheet_number?: string;
  jurisdiction?: string;
  category_name?: string;
}

export type MeasureSheetEntryRelatedList<T> = T extends Note ? 'Notes' : never;
