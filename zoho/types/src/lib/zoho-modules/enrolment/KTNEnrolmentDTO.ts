import {
  IsArray,
  IsBoolean,
  IsDate,
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
import { Transform, Type } from 'class-transformer';
import { KTNEnrolment } from './KTNEnrolment.type';

// Enrolment (Kursteilnahme) -------------------------------
export class KTNEnrolmentDTO implements KTNEnrolment {
  // auto injected before validation
  @IsString()
  @Matches(/Kursteilnahme/i)
  _type: 'Kursteilnahme';

  @IsString()
  id: string;

  // Lookups -----------------------------------
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => LookUpDTO)
  @ValidateIf((object, value) => value !== null)
  measure?: LookUp;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => LookUpDTO)
  @ValidateIf((object, value) => value !== null)
  Kurse?: LookUp;

  // Strings -----------------------------------
  @IsString()
  @IsOptional()
  @ValidateIf((object, value) => value !== null)
  Name?: string;

  @IsString()
  @IsOptional()
  @ValidateIf((object, value) => value !== null)
  integrationMessages?: string;

  @IsString()
  @IsOptional()
  @ValidateIf((object, value) => value !== null)
  course_type?: string;

  @IsString()
  @IsOptional()
  @ValidateIf((object, value) => value !== null)
  measureCode?: string;

  @IsString()
  @IsOptional()
  @ValidateIf((object, value) => value !== null)
  companyCourseId?: string;

  @IsString()
  @IsOptional()
  @ValidateIf((object, value) => value !== null)
  azureUserId?: string;

  @IsString()
  @IsOptional()
  @ValidateIf((object, value) => value !== null)
  Status?: string;

  @IsString()
  @IsOptional()
  @ValidateIf((object, value) => value !== null)
  certificate_entry_id?: string;

  @IsString()
  @IsOptional()
  @ValidateIf((object, value) => value !== null)
  deviating_degree_title?: string;

  @IsString()
  @IsOptional()
  @ValidateIf((object, value) => value !== null)
  Unterrichtsart?: string;

  // number
  @IsNumber()
  @IsOptional()
  @ValidateIf((object, value) => value !== null)
  uw_without_vacation?: number;

  @IsNumber()
  @IsOptional()
  @ValidateIf((object, value) => value !== null)
  teaching_units?: number;

  @IsNumber()
  @IsOptional()
  @ValidateIf((object, value) => value !== null)
  durationInWeeks?: number;

  @IsNumber()
  @IsOptional()
  @ValidateIf((object, value) => value !== null)
  Reihenfolge?: number;

  @IsNumber()
  @IsOptional()
  @ValidateIf((object, value) => value !== null)
  percentage?: number;

  @IsNumber()
  @IsOptional()
  @ValidateIf((object, value) => value !== null)
  UE?: number;

  // boolean
  @IsBoolean()
  @IsOptional()
  mkReplacement?: boolean;

  @IsBoolean()
  @IsOptional()
  Zertifikat_erstellt?: boolean;

  @IsBoolean()
  @IsOptional()
  Startkurs?: boolean;

  @IsBoolean()
  @IsOptional()
  Letzter_Kurs?: boolean;

  // Dates
  @Type(() => Date)
  @IsOptional()
  @IsDate()
  Kursstart?: Date;

  @Type(() => Date)
  @IsOptional()
  @IsDate()
  Kursende?: Date;

  // Objects
  @IsObject()
  @IsOptional()
  Kursteilnahmen?: {
    name: string;
    id: string;
  };
  @IsObject()
  @IsOptional()
  Abschluss?: {
    name: string;
    id: string;
  };

  // special - requres a custom validator
  @IsOptional()
  softwareLicenses?: string | string[] | null;
}
