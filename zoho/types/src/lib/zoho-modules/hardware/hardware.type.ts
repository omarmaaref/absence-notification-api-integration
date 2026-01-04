import { HardwareRental } from '../hardware-rental/hardware-rental.type';

export interface Hardware {
  _type: 'Hardware';
  last_usage: string;
}

export type HardwareRelatedList<T> = T extends HardwareRental
  ? 'Verleihe'
  : never;
