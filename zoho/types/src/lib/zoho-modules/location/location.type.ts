import { Attachment } from '../attachment/attachment.type';
import { Note } from '../note/note.type';
import { Lead } from '../lead/lead.type';
import { HardwareRental } from '../hardware-rental/hardware-rental.type';
import { Deal } from '../deal/deal.type';
import { ActionSheet } from '../action-sheet/action-sheet.type';

export interface Location {
  _type: 'Location';
  street?: string;
  zipCode?: string;
  city?: string;
}

export type LocationRelatedList<T> = T extends Note
  ? 'Notes'
  : T extends Attachment
  ? 'Attachments'
  : T extends Lead
  ? 'Standort1'
  : T extends Deal
  ? 'Standorte_Abschl_sse'
  : T extends ActionSheet
  ? 'Ma_nahmeb_gen'
  : T extends HardwareRental
  ? 'Erwartete_Hardware'
  : never;
