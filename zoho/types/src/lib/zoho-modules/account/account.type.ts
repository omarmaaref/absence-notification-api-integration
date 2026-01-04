import { Note } from '../note/note.type';
import { Attachment } from '../attachment/attachment.type';
import { Deal } from '../deal/deal.type';
import { Contact } from '../contact/contact.type';
import { Product } from '../product/product.type';
import { Quote } from '../quote/quote.type';
import { Lead } from '../lead/lead.type';

export interface Account {
  // Branding
  _type: 'Account';
}

export type AccountRelatedList<T> = T extends Note
  ? 'Notes'
  : T extends Attachment
  ? 'Attachments'
  : T extends Deal
  ? 'Deals'
  : T extends Contact
  ? 'Contacts'
  : T extends Product
  ? 'Products'
  : T extends Quote
  ? 'Quotes'
  : T extends Account
  ? 'Child_Accounts'
  : T extends Deal
  ? 'Related_List_Name_1'
  : T extends Lead
  ? 'Agentur_Leads'
  : never;
