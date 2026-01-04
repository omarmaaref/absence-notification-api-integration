import { LookUp } from '../../zoho-request/zoho-api.types';
import { Attachment } from '../attachment/attachment.type';
import { Note } from '../note/note.type';

export interface AccountsReceivable {
  _type?: 'AccountsReceivable';
  id?: string;
  accounts_receivable_valid?: boolean;
  amount?: number;
  auto_id?: number;
  billing_number?: string;
  contact?: LookUp;
  cost_center_one_account_number?: string;
  counter_account?: string;
  date?: string;
  due_date?: string;
  deal?: LookUp;
  deal_id?: string;
  debtor?: LookUp;
  debtor_account_number?: number;
  education_voucher_number?: string;
  external_id?: string;
  last_payment?: boolean;
  order?: number;
  Name?: string;
  unique?: string;
}

export type AccountsReceivableRelatedList<T> = T extends Note
  ? 'Notes'
  : T extends Attachment
  ? 'Attachments'
  : never;
