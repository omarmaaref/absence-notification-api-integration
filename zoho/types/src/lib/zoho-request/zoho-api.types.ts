// import { z } from 'zod';
/*****************************
 *  Zoho API
 *
 *  see:
 *  https://www.zoho.com/crm/developer/docs/api/v7/get-records.html
 *  https://crmsandbox.zoho.eu/crm/stagingnewabsences/settings/api/modules/CustomModule2?step=FieldsList
 *
 *
 **/

import { Deal, DealRelatedList } from '../zoho-modules/deal/deal.type';
import {
  KTNEnrolment,
  KTNEnrolmentRelatedList,
} from '../zoho-modules/enrolment/KTNEnrolment.type';

import { ZohoModules, ModuleName } from '../zoho-modules/zoho.modules';
import {
  ZohoInternalRequestParameters,
  ZohoRequestParameters,
} from './request.type';
import { IsOptional, IsString } from 'class-validator';
import {
  QualificationPlan,
  QualificationPlanRelatedList,
} from '../zoho-modules/qualification-plan/qualification-plan.type';
import {
  SheetExtendRequest,
  SheetExtendRequestRelatedList,
} from '../zoho-modules/sheet-extend-request/sheet-extend-request.type';
import { Lead, LeadRelatedList } from '../zoho-modules/lead/lead.type';
import {
  Account,
  AccountRelatedList,
} from '../zoho-modules/account/account.type';
import { Course, CourseRelatedList } from '../zoho-modules/course/course.type';
import {
  AccountsReceivable,
  AccountsReceivableRelatedList,
} from '../zoho-modules/accounts-receivable/accounts-receivable.type';
import {
  ActionSheet,
  ActionSheetRelatedList,
} from '../zoho-modules/action-sheet/action-sheet.type';
import {
  Contact,
  ContactRelatedList,
} from '../zoho-modules/contact/contact.type';
import { Quote, QuoteRelatedList } from '../zoho-modules/quote/quote.type';
import { Debtor, DebtorRelatedList } from '../zoho-modules/debtor/debtor.type';
import {
  Hardware,
  HardwareRelatedList,
} from '../zoho-modules/hardware/hardware.type';
import {
  HardwareRental,
  HardwareRentalRelatedList,
} from '../zoho-modules/hardware-rental/hardware-rental.type';
import { LocationRelatedList } from '../zoho-modules/location/location.type';
import {
  MeasureSheetEntry,
  MeasureSheetEntryRelatedList,
} from '../zoho-modules/measure-sheet-entry/measure-sheet-entry.type';
import {
  Product,
  ProductRelatedList,
} from '../zoho-modules/product/product.type';
import {
  QualificationPlanEntry,
  QualificationPlanEntryRelatedList,
} from '../zoho-modules/qualification-plan-entry/qualification-plan-entry.type';
import {
  Transaction,
  TransactionRelatedList,
} from '../zoho-modules/transaction/transaction.type';
import {
  WelcomeEvent,
  WelcomeEventRelatedList,
} from '../zoho-modules/welcome-event/welcome-event.type';
import { Note } from '../zoho-modules/note/note.type';
import {
  Absence,
  AbsenceRelatedList,
} from '../zoho-modules/absence/absence.type';
import { Location } from '@nestjs/schematics';
import {
  DegreeDesignation,
  DegreeDesignationRelatedList,
} from '../zoho-modules/degree-designation/degree-designation.types';

/***********
 * common Zoho-module property Types
 */
export type LookUp = {
  id?: string;
  name?: string;
  external_id?: string | undefined;
};
export class LookUpDTO implements LookUp {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  external_id: string | undefined;
}

export type Tag = {
  name: string;
  id: string;
  color_code: string;
};

export type File = {
  extn: string; //"png",
  is_Preview_Available: true;
  download_Url: string; //"/crm/org20079331230/specific/ViewAttachment?fileId=604x81de1dd7e30f44c91b25b5221270dd32f&module=CustomModule2&parentId=399644000007603271&creatorId=399644000001406199&id=399644000008352686&name=Bildschirmfoto+vom+2023-10-27+10-33-12.png&downLoadMode=default",
  delete_Url: string; //"/crm/org20079331230/deleteattachment.do?attachmentid=399644000008352686&module=CustomModule2&id=399644000007603271&creatorId=399644000001406199&fromFileUploadField=true&nextStep=relatedlist&isajax=true&fieldId=399644000008344529&fromPage=edit",
  entity_Id: number; //399644000007603260,
  mode: string; //"",
  original_Size_Byte: string; //"25155",
  preview_Url: string; //"/crm/org20079331230/ViewImage?fileId=604x81de1dd7e30f44c91b25b5221270dd32f&module=CustomModule2&parentId=399644000007603271&creatorId=399644000001406199&id=399644000008352686&name=Bildschirmfoto+vom+2023-10-27+10-33-12.png&downLoadMode=inline",
  file_Name: string; //"Bildschirmfoto vom 2023-10-27 10-33-12.png",
  file_Id: string; //"604x81de1dd7e30f44c91b25b5221270dd32f",
  attachment_Id: string; //"399644000008352686",
  file_Size: string; //"25.16 KB",
  creator_Id: number; //399644000001406200,
  link_Docs: number; //0
};

//api response for modify or delete operations
export type ZohoModifyResponse<T extends ZohoModules> = {
  code: string;
  details: {
    id: string;
  } & Partial<T>;
  message: string;
  status: string;
};

// ????????????????

//return all names that are available in the related module
export type RelatedModuleName<U, T> = U extends Lead
  ? LeadRelatedList<T>
  : U extends Account
  ? AccountRelatedList<T>
  : U extends AccountsReceivable
  ? AccountsReceivableRelatedList<T>
  : U extends ActionSheet
  ? ActionSheetRelatedList<T>
  : U extends Contact
  ? ContactRelatedList<T>
  : U extends Course
  ? CourseRelatedList<T>
  : U extends Deal
  ? DealRelatedList<T>
  : U extends Quote
  ? QuoteRelatedList<T>
  : U extends Debtor
  ? DebtorRelatedList<T>
  : U extends KTNEnrolment
  ? KTNEnrolmentRelatedList<T>
  : U extends Hardware
  ? HardwareRelatedList<T>
  : U extends HardwareRental
  ? HardwareRentalRelatedList<T>
  : U extends Location
  ? LocationRelatedList<T>
  : U extends MeasureSheetEntry
  ? MeasureSheetEntryRelatedList<T>
  : U extends Product
  ? ProductRelatedList<T>
  : U extends QualificationPlan
  ? QualificationPlanRelatedList<T>
  : U extends QualificationPlanEntry
  ? QualificationPlanEntryRelatedList<T>
  : U extends Transaction
  ? TransactionRelatedList<T>
  : U extends WelcomeEvent
  ? WelcomeEventRelatedList<T>
  : U extends Absence
  ? AbsenceRelatedList<T>
  : U extends SheetExtendRequest
  ? SheetExtendRequestRelatedList<T>
  : U extends DegreeDesignation
  ? DegreeDesignationRelatedList<T>
  : never;

//general
export type Triggers = {
  workflow: string;
  approval: string;
  blueprint: string;
};

type externalIdHeader = { ['X-EXTERNAL']?: string }; //if using external id fields for api https://www.zoho.com/crm/developer/docs/api/v7/records-api-ext-id-overview.html
type ifModifiedSinceHeader = { ['If-Modified-Since']?: string }; //only get thous records that have been since the given date modified
type ifUnmodifiedSinceHeader = { ['If-Unmodified-Since']?: string }; //only update thous records that have not been since the given date modified

//base request with module
export type ZohoModuleRequest<T extends ZohoModules> = {
  module: ModuleName<T>;
};

//request with module and id
export type ZohoIdRequest<T extends ZohoModules> = ZohoModuleRequest<T> & {
  id: string;
};

export type ZohoUploadAttachmentRequest<T extends ZohoModules> =
  ZohoIdRequest<T> &
    ZohoModuleRequest<T> & {
      fileName: string;
    } & { rawBody: Buffer } & { deleteExisting: boolean };

export type ZohoDeleteAttachmentByNameRequest<T extends ZohoModules> =
  ZohoIdRequest<T> & {
    fileName: string;
  };

export type ZohoDeleteAttachmentRequest<T extends ZohoModules> =
  ZohoIdRequest<T> & {
    attachmentId: string;
  };
//get
//get request with module and params
export type ZohoGetParams = {
  params: ZohoRequestParameters;
};

export type ZohoInternalGetRequest<T extends ZohoModules> =
  ZohoModuleRequest<T> &
    Partial<ZohoInternalRequestParameters<T>> &
    ZohoGetOptions;

export type ZohoGetRequest<T extends ZohoModules> = ZohoModuleRequest<T> &
  Partial<ZohoGetParams> &
  ZohoGetOptions;

//get request with module and id and optional params
export type ZohoInternalGetByIdRequest<T extends ZohoModules> =
  ZohoIdRequest<T> & Partial<ZohoInternalGetRequest<T>> & ZohoGetOptions;

//get request with module and id and optional params
export type ZohoGetByIdRequest<T extends ZohoModules> = ZohoIdRequest<T> &
  Partial<ZohoGetParams> &
  ZohoGetOptions;

export type ZohoGetRequestHeaders = {
  headers?: ifModifiedSinceHeader & externalIdHeader;
};
export type ZohoGetOptions = {
  options?: ZohoGetRequestHeaders;
};

//related
//related module names
export type ZohoGetRelatedModule<
  T extends ZohoModules,
  U extends ZohoModules
> = {
  relatedModule: RelatedModuleName<U, T>;
};

//T Related Module
//U Parent Module
export type ZohoInternalGetRelatedRequest<
  T extends ZohoModules,
  U extends ZohoModules
> = ZohoIdRequest<U> &
  ZohoGetRelatedModule<T, U> &
  ZohoInternalRequestParameters<T> &
  ZohoGetOptions;

//T Related Module
//U Parent Module
export type ZohoGetRelatedRequest<
  T extends ZohoModules,
  U extends ZohoModules
> = ZohoIdRequest<U> &
  ZohoGetRelatedModule<T, U> &
  ZohoGetParams &
  ZohoGetOptions;

export type ZohoGeneralGetRequest<
  T extends ZohoModules,
  U extends ZohoModules = T
> = ZohoModuleRequest<U> &
  Partial<ZohoIdRequest<U>> &
  Partial<ZohoGetParams> &
  ZohoGetOptions &
  Partial<ZohoGetRelatedModule<T, U>>;

//zoho create/update/insert types
export type ZohoChangeTriggerOption = {
  trigger?: (keyof Triggers)[]; //Trigger workflow, approval or/and blueprint
  headers?: externalIdHeader;
};

// base headers for all change related api requests
export type ZohoChangeHeaders = {
  headers?: ifUnmodifiedSinceHeader;
};

export type ZohoChangeBaseOptions = {
  options?: ZohoChangeTriggerOption;
};

export type ZohoData<T extends ZohoModules> = {
  data: Partial<T>[];
};

export type ZohoDataRequest<T extends ZohoModules> = ZohoModuleRequest<T> &
  ZohoData<T>;

export type ZohoChangeRequest<T extends ZohoModules> = ZohoDataRequest<T> &
  ZohoModuleRequest<T> & {
    options?: Partial<ZohoUpsertOptions<T>>;
  };
//base body to combine trigger and duplicate check options back if need
export type ZohoChangeBaseRequestBody<T extends ZohoModules> =
  ZohoChangeTriggerOption & Partial<ZohoDuplicateCheckRequestOption<T>>;

export type ZohoChangeRequestBody<T extends ZohoModules> =
  ZohoChangeBaseRequestBody<T> & ZohoData<T>;

//zoho create
export type ZohoCreateRequest<T extends ZohoModules> = ZohoDataRequest<T> &
  ZohoChangeBaseOptions;

//zoho update
export type ZohoUpdateOptions = {
  options?: ZohoChangeTriggerOption & ZohoChangeHeaders;
};
export type ZohoUpdateRequest<T extends ZohoModules> = ZohoDataRequest<T> &
  ZohoUpdateOptions;

//zoho upsert
/**
 * set field base for updating if existing record important only fields in module with unique check are allowed
 */
export type ZohoDuplicateCheckRequestOption<T extends ZohoModules> = {
  duplicate_check_fields: (keyof T)[];
};

/**
 * all API options for upsert
 */
export type ZohoUpsertOptions<T extends ZohoModules> = ZohoChangeTriggerOption &
  ZohoChangeHeaders &
  ZohoDuplicateCheckRequestOption<T>;

export type ZohoUpsertRequest<T extends ZohoModules> = ZohoDataRequest<T> & {
  options: ZohoUpsertOptions<T>;
};

//delete
//trigger workflows with delete trigger
export type ZohoDeleteWTTrigger = {
  wf_trigger?: boolean; //trigger workflow
};

//ids of records to delete
export type ZohoDeleteIds = {
  ids: string[];
};

//other optional parameters
export type ZohoDeleteParams = {
  params?: ZohoDeleteWTTrigger;
};

export type ZohoDeleteHeaders = {
  headers?: externalIdHeader;
};
export type ZohoDeleteOptions = {
  options?: ZohoDeleteHeaders & ZohoDeleteWTTrigger & ZohoDeleteParams;
};
export type ZohoDeleteIdsRequest<T extends ZohoModules> = ZohoModuleRequest<T> &
  ZohoDeleteIds &
  ZohoDeleteOptions;

//zoho search types
export type ZohoSearchQueryParam = EMailQueryParam &
  CriteriaQueryParam &
  PhoneQueryParam &
  WordQueryParam;

export interface EMailQueryParam {
  email?: string;
}

export interface CriteriaQueryParam {
  criteria?: string;
}
export interface PhoneQueryParam {
  phone?: string;
}

export interface WordQueryParam {
  word?: string;
}
export type ZohoSearchParam = {
  params: ZohoSearchQueryParam;
};

export type ZohoSearchOptions = {
  options?: ZohoGetRequestHeaders;
};

export type ZohoSearchRequest<T extends ZohoModules> = ZohoModuleRequest<T> &
  ZohoSearchParam &
  Partial<ZohoSearchOptions>;

export type ZohoDeleteByIdRequest<T extends ZohoModules> =
  ZohoModuleRequest<T> & {
    ids: string[];
  };
