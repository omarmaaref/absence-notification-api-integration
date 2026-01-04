import {
  IsArray,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { LookUp, LookUpDTO, Tag } from '../../zoho-request/zoho-api.types';
import { Deal } from './deal.type';
import { Transform, Type } from 'class-transformer';
import { ModuleName } from '../zoho.modules';

export class DealDTO implements Deal {
  recipient_type?: string | undefined;
  receiver_type: string;
  business_type?: string | undefined;
  preferred_language?: string | undefined;
  product_languages?: string[] | undefined;
  overall_degree_title?: string | undefined;
  recipient_other?: string | undefined;
  street_other?: string | undefined;
  plz_other?: string | undefined;
  city_other?: string | undefined;
  packing_station_number?: string | undefined;
  post_number?: string | undefined;
  plz_packing_station?: string | undefined;
  city_packing_station?: string | undefined;
  // auto injected before validation
  @IsString()
  @Matches(/Deals/i)
  _type: 'Deals';

  // key
  @IsString()
  id: string;

  // Lookups -----------------------------------
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => LookUpDTO)
  @ValidateIf((object, value) => value !== null)
  actionSheet: LookUp;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => LookUpDTO)
  @ValidateIf((object, value) => value !== null)
  Berater: LookUp;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => LookUpDTO)
  @ValidateIf((object, value) => value !== null)
  Standort: LookUp;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => LookUpDTO)
  @ValidateIf((object, value) => value !== null)
  Account_Name: LookUp;

  // Strings -----------------------------------
  @IsString()
  @IsOptional()
  @ValidateIf((object, value) => value !== null)
  Closing_Date: string;

  @IsString()
  @IsOptional()
  @ValidateIf((object, value) => value !== null)
  lastDayOfParticipation: string;

  @IsString()
  @IsOptional()
  @ValidateIf((object, value) => value !== null)
  vacationStart: string;

  @IsString()
  @IsOptional()
  @ValidateIf((object, value) => value !== null)
  vacationEnd: string;

  @IsNumber()
  @IsOptional()
  @ValidateIf((object, value) => value !== null)
  Amount: number;

  @IsString()
  @IsOptional()
  @ValidateIf((object, value) => value !== null)
  BGS_Nummer: string;

  @IsString()
  @IsOptional()
  @ValidateIf((object, value) => value !== null)
  examination_regulation: string;

  @IsString()
  @IsOptional()
  @ValidateIf((object, value) => value !== null)
  additionalAgreement: string;

  @IsString()
  @IsOptional()
  @ValidateIf((object, value) => value !== null)
  Deal_Name: string;

  @IsString()
  @IsOptional()
  @ValidateIf((object, value) => value !== null)
  Abschluss_ID: string;

  @IsString()
  @IsOptional()
  @ValidateIf((object, value) => value !== null)
  startDate: string;

  @IsString()
  @IsOptional()
  @ValidateIf((object, value) => value !== null)
  endDate: string;

  @IsString()
  @IsOptional()
  @ValidateIf((object, value) => value !== null)
  educationTimeKind: string;

  // Arrays -----------------------------------
  @IsArray()
  @IsOptional()
  Tag?: Tag[];

  // Objects -----------------------------------
  @IsObject()
  @IsOptional()
  Contact_Name?: {
    name: string;
    id: string;
  };
  @IsObject()
  @IsOptional()
  Modified_By?: {
    name: string;
    id: string;
    email: string;
  };
}
