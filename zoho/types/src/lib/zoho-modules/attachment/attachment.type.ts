import { LookUp } from '../../zoho-request/zoho-api.types';

export interface Attachment {
  _type: 'Attachment';
  id: string;
  Owner: LookUp;
  File_Name: string;
  Created_Time: string;
}
