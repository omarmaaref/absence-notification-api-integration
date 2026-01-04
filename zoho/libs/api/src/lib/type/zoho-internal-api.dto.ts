import {
  ZohoModuleRequest,
  ZohoModules,
  ModuleName,
  ZohoIdRequest,
  ZohoRequestParameters,
  ZohoData,
  Triggers,
  ZohoGetRelatedModule,
  RelatedModuleName,
  ZohoDuplicateCheckRequestOption,
  ZohoDeleteIds,
  ZohoDeleteAttachmentRequest,
  ZohoSearchQueryParam,
} from '@company/zoho-types';
import { IsArray } from 'class-validator';

export class ZohoModulePathParam<T extends ZohoModules>
  implements ZohoModuleRequest<T>
{
  module: ModuleName<T>;
}

export class ZohoModuleIdPathParam<T extends ZohoModules>
  extends ZohoModulePathParam<T>
  implements ZohoIdRequest<T>
{
  override module: ModuleName<T>;
  id: string;
}

export class ZohoDeleteAttachmentPathParam<T extends ZohoModules>
  extends ZohoModulePathParam<T>
  implements ZohoDeleteAttachmentRequest<T>
{
  override module: ModuleName<T>;
  id: string;
  attachmentId: string;
}

export class ZohoModuleRelatedParam<
    T extends ZohoModules,
    U extends ZohoModules
  >
  extends ZohoModuleIdPathParam<T>
  implements ZohoGetRelatedModule<U, T>
{
  override module: ModuleName<T>;
  override id: string;
  relatedModule: RelatedModuleName<T, U>;
}

export class ZohoCreateChangeBaseBody<T extends ZohoModules>
  implements ZohoData<T>
{
  data: T[];
}

export class ZohoCreateTriggerBody<
  T extends ZohoModules
> extends ZohoCreateChangeBaseBody<T> {
  override data: T[];
  trigger: (keyof Triggers)[];
}

export class ZohoUpsertRequest<T extends ZohoModules>
  extends ZohoCreateTriggerBody<T>
  implements ZohoDuplicateCheckRequestOption<T>
{
  override data: T[];
  override trigger: (keyof Triggers)[];
  duplicate_check_fields: (keyof T)[];
}

export class ZohoDeleteIdsQuery implements ZohoDeleteIds {
  @IsArray()
  ids: string[];
}

export class ZohoGetParams implements ZohoRequestParameters {
  fields: string;
  ids?: string;
  cvid?: string | undefined;
  page?: number | undefined;
  per_page?: number | undefined;
  page_token?: string | undefined;
  sort_order?: 'desc' | 'asc' | undefined;
  sort_by?: 'id' | 'Created_Time' | 'Modified_Time' | undefined;
  converted?: 'true' | 'false' | 'both' | undefined;
  territory_id?: string | undefined;
  include_child?: boolean | undefined;
}

//seach
export class ZohoSearchQuery implements ZohoSearchQueryParam {
  criteria?: string;
  email?: string;
  phone?: string;
  word?: string;
}
