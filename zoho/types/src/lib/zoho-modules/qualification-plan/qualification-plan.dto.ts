import {
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { LookUp, LookUpDTO } from '../../zoho-request/zoho-api.types';
import { Type } from 'class-transformer';
import { QualificationPlan } from './qualification-plan.type';

export class QualificationPlanDTO implements QualificationPlan {
  // auto injected before validation
  @IsString()
  @Matches(/qualificationPlans/)
  _type: 'qualificationPlans';

  @IsString()
  id: string;

  // lookup
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => LookUpDTO)
  quote?: LookUp;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => LookUpDTO)
  deal?: LookUp;

  // string
  @IsOptional()
  status?: string;

  // dates
  @Type(() => Date)
  @IsDate()
  startDate: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: string;
}
