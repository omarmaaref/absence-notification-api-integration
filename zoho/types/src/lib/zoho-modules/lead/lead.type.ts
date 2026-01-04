import { Attachment } from '../attachment/attachment.type';
import { Note } from '../note/note.type';
import { Product } from '../product/product.type';

export interface Lead {
  _type: 'Lead';
}

export type LeadRelatedList<T> = T extends Note
  ? 'Notes'
  : T extends Attachment
  ? 'Attachments'
  : T extends Product
  ? 'Products'
  : never;
