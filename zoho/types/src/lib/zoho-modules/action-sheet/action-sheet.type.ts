import { File, LookUp } from '../../zoho-request/zoho-api.types';
import { Note } from '../note/note.type';
import { Attachment } from '../attachment/attachment.type';
import { Deal } from '../deal/deal.type';
import { Quote } from '../quote/quote.type';
import { MeasureSheetEntry } from '../measure-sheet-entry/measure-sheet-entry.type';
import { SheetExtendRequest } from '../sheet-extend-request/sheet-extend-request.type';

// Maßnahmenbogen --------------------------
export type ActionSheet = {
  // Branding
  _type: 'ActionSheet';

  // key
  id: string;
  // strings
  copy_measure_sheet?: LookUp;
  Name?: string;
  measureSheetCategory?: string;
  actionNumber?: string;
  shortQuestionnaireDate?: string | null;
  sheetKind?: string;
  locationId?: string;

  // dates
  startOfValidity?: Date;
  endOfValidity?: Date;
  lastDayOfEntry?: Date;

  // array
  formOfTeaching?: ('VZ' | 'TZ' | 'BG')[];
  measureSheetUpload?: File[];
};

export type ActionSheetRelatedList<T> = T extends Note
  ? 'Notes'
  : T extends Attachment
  ? 'Attachments'
  : T extends Deal
  ? 'Abschl_sse_Ma_nahmenummer'
  : T extends Quote
  ? 'Angebote'
  : T extends MeasureSheetEntry
  ? 'sheet_entries'
  : T extends SheetExtendRequest
  ? 'extend_requests'
  : never;

export interface MeasureSheetPageContentDTO {
  title: string;
  date: string;
  measure: Attachment2MeasureDTO[][];
}

export interface Attachment2MeasureDTO {
  title: string;
  price: string;
  durationInDays: number;
  durationInUE: number;
  certificateId: string;
}
