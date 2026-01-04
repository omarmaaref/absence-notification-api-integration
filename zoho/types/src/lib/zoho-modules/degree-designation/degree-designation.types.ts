import { AirtableBaseDTO } from '@company/airtable-lib';
import { Attachment } from '../attachment/attachment.type';
import { Note } from '../note/note.type';
import { Quote } from '../quote/quote.type';

export type DegreeDesignation = {
  _type?: 'degree_designation';
  Name?: string;
  company_id?: string;
  id?: string;
  external_id?: string;
  status?: string;
  exclude_shell_requirement?: boolean;
};

export interface AirtableDegreeDesignationDTO extends AirtableBaseDTO {
  id: string;
  degree_designation_id: string;
  male_labor_market_relevance: string;
  female_labor_market_relevance: string;
}

export type DegreeDesignationRelatedList<T> = T extends Note
  ? 'Notes'
  : T extends Attachment
  ? 'Attachments'
  : T extends Quote
  ? 'Quotes'
  : never;
