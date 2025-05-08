import {
  IsNotEmpty,
  IsObject,
  IsNumber,
  IsString,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SubmissionData } from '../types/form.types';

// We use a dynamic object for form data
export interface FormData {
  [key: string]: any;
}

export class CreateSubmissionDto {
  @IsObject()
  @IsNotEmpty()
  data: SubmissionData;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  templateId: number;

  @IsString()
  @IsOptional()
  type?: string;
}
