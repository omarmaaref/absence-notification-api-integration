import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { LookUp, LookUpDTO } from '../../zoho-request/zoho-api.types';
import { IncludedCourses, Product } from './product.type';
import { Type } from 'class-transformer';

export class ProductDTO implements Product {
  // auto injected before validation
  @IsString()
  @Matches(/Products/i)
  _type: 'Products';

  // key
  @IsString()
  id: string;

  // Strings -------------------
  @IsString()
  @IsOptional()
  Zertifikats_Id?: string;

  @IsString()
  @IsOptional()
  Name?: string;

  @IsString()
  @IsOptional()
  Produkt_Id?: string;

  @IsString()
  @IsOptional()
  Product_Code?: string;

  @IsString()
  @IsOptional()
  Product_Name?: string;

  @IsString()
  @IsOptional()
  Abschlussbezeichnung?: string;

  @IsString()
  @IsOptional()
  external_id?: string;

  // Numbers -----------------------
  @IsNumber()
  @IsOptional()
  durationInWeeks?: number;

  @IsNumber()
  @IsOptional()
  Unterrichtseinheiten?: number;

  // Booleans
  @IsBoolean()
  @IsOptional()
  isOnline?: boolean;

  // Arrays ------------------------
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => IncludedCoursesDTO)
  includedCourses?: IncludedCourses[];

  // $has_more ---------------------
  @IsOptional()
  @IsObject()
  $has_more?: {
    [key: string]: boolean;
  };
}

class IncludedCoursesDTO implements IncludedCourses {
  @IsString()
  id: string;

  @ValidateNested({ each: true })
  @Type(() => LookUpDTO)
  course: LookUp;

  @ValidateNested({ each: true })
  @Type(() => LookUpDTO)
  Parent_Id: LookUp;

  @IsString()
  courseID: string;

  @IsString()
  status: string;

  @IsNumber()
  order: number;

  @IsNumber()
  durationInWeeks: number;
}
