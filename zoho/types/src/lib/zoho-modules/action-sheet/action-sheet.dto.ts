import {
  IsArray,
  IsDate,
  IsDateString,
  IsIn,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { File } from '../../zoho-request/zoho-api.types';
import { ActionSheet } from './action-sheet.type';
import { Transform, Type } from 'class-transformer';

// TEST DTO
export class ActionSheetDTO implements ActionSheet {
  // auto injected before validation
  @IsString()
  @Matches(/ActionSheet/)
  _type: 'ActionSheet';

  @IsString()
  id: string;

  // Strings -----------------------------------
  @IsString()
  @IsOptional()
  Name?: string;

  @IsString()
  @IsOptional()
  measureSheetCategory?: string;

  @IsString()
  @IsOptional()
  actionNumber?: string;

  @IsOptional()
  @IsString()
  shortQuestionnaireDate?: string;

  @IsOptional()
  @IsString()
  sheetKind?: string;

  @IsOptional()
  @IsString()
  locationId?: string;

  // Dates -------------------------------------
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startOfValidity?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endOfValidity?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  lastDayOfEntry?: Date;

  // Arrays -----------------------------------
  @IsOptional()
  @IsArray()
  @IsIn(['VZ', 'TZ', 'BG'], { each: true })
  formOfTeaching?: ('VZ' | 'TZ' | 'BG')[];

  // Special ----------------------------------
  // TODO !!! nested array validator
  @IsOptional()
  @IsArray()
  measureSheetUpload?: File[];
}
