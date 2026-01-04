import { Attachment } from '../attachment/attachment.type';
import { Note } from '../note/note.type';
import { LookUp } from '../../zoho-request/zoho-api.types';

export interface HardwareRental {
  _type: 'HardwareRental';
  requested_hardware: string;
  id: string;
  course?: LookUp;
  start_date?: string;
  end_date?: string;
  reserved_hardware?: string;
  recipient_type?: string;
  deal?: LookUp;
  rental_duration_type?: string;
  recipient_other?: string;
  street_other?: string;
  plz_other?: string;
  city_other?: string;
  contact_hardware_group?: string;
  location?: LookUp;
  packing_station_number?: string;
  post_number?: string;
  plz_packing_station?: string;
  city_packing_station?: string;
}
export type HardwareRentalRelatedList<T> = T extends Note
  ? 'Notes'
  : T extends Attachment
  ? 'Attachments'
  : never;
