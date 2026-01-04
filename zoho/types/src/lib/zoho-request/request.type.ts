/*****************************
 *  Authentication
 */
import { LookUp } from './zoho-api.types';
import { ZohoModules } from '../zoho-modules/zoho.modules';

// represents a valid response from Zoho oauth
export type ZohoAccessTokenResponse = {
  access_token: string;
  scope: string;
  api_domain: string;
  token_type: string;
  expires_in: number;
};

// represents a error response from Zoho oauth
export type ZohoAccessTokenErrorResponse = {
  error: string;
};

export type ZohoBaseRequestParameters = {
  ids?: string; // To retrieve specific records based on their unique ID. i.e: 4150868000001944196
  cvid?: string; // To get the list of records based on custom views.

  // internal parts
  page?: number;
  per_page?: number; // defaults to 200
  page_token?: string; //  mandatory to fetch more than 2000 records by pagination
  sort_order?: 'desc' | 'asc'; // defaults to desc
  sort_by?: 'id' | 'Created_Time' | 'Modified_Time'; //  defaults to "id"
  converted?: 'true' | 'false' | 'both'; // defaults to "false"
  territory_id?: string; // To get the list of records based on the territory.
  include_child?: boolean; // To include records from the child territories.Default value is false.
};

/*****************************
 *  Request-Parameters & Response
 */
// represents the parameters for a GET request to Zoho
export type ZohoRequestParameters = ZohoBaseRequestParameters & {
  fields: string; // only allow typed field values for the chosen Zoho Module Type
};

export type ZohoInternalRequestParameters<T extends ZohoModules> = {
  params: ZohoBaseRequestParameters & {
    fields: (keyof T)[]; // only allow typed field values for the chosen Zoho Module Type
  };
};

// represents a response from Zoho
export type ZohoResponse<T> = {
  data: T[];
  info: {
    // call: boolean,
    count: number;
    per_page: number;
    sort_by: string;
    sort_order: 'desc' | 'asc';
    page: number;
    page_token_expiry: string | undefined;
    previous_page_token: string | undefined;
    next_page_token: string | undefined;
    more_records: boolean;
  };
};

export class ZohoCreateResponse {
  'code': string;
  'details': ZohoCreateResponseDetails;
  'message': string;
  'status': string;
}

export class ZohoCreateResponseDetails {
  'Modified_Time': string;
  'Modified_By': LookUp;
  'Created_Time': string;
  'id': string;
  'Created_By': LookUp;
  '$approval_state': string;
}
