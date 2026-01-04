import { Transaction } from '../transaction/transaction.type';
import { Note } from '../note/note.type';
import { AccountsReceivable } from '../accounts-receivable/accounts-receivable.type';
import { Attachment } from '../attachment/attachment.type';
import { LookUp } from '../../zoho-request/zoho-api.types';

export interface Debtor {
  _type?: 'Debtor';
  KOST1?: string;
  Tag?: [{ name: string }];
  Gegenkonto?: string;
  id?: string;
  Buchungstext?: string;
  recalculated?: boolean;
  Unerwartet_Betrag?: boolean;
  Abschluss?: LookUp;
  Contact?: LookUp;
  BGS_Nummer?: string;
  Abschluss_ID?: string;
  Gesamt_Betrag?: number;
  DurationInMonths?: string;
  Name?: string;
  Gesamtanzahl?: number;
  expected_monthly_amount?: number;
  account: LookUp;
}
export type DebtorRelatedList<T> = T extends Note
  ? 'Notes'
  : T extends Transaction
  ? 'Zahlungseing_nge'
  : T extends AccountsReceivable
  ? 'account_receivables'
  : T extends Attachment
  ? 'Attachments'
  : never;
