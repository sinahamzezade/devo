import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { InsuranceService } from './insurance.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { FormStructure, Submission } from './types/form.types';

@Controller('api/insurance')
export class InsuranceController {
  constructor(private readonly insuranceService: InsuranceService) {}

  @Get('forms')
  async getAllForms(): Promise<FormStructure[]> {
    return this.insuranceService.getAllForms();
  }

  @Get('forms/submissions')
  async getSubmissions(@Query('type') type?: string) {
    const submissions = await this.insuranceService.getSubmissions();
    const columns = await this.insuranceService.getColumnDefinitions();

    // Filter by type if provided
    const filteredSubmissions = type
      ? submissions.filter((sub: Submission) => sub.type === type)
      : submissions;

    return {
      columns: columns.columns,
      data: filteredSubmissions,
    };
  }

  @Get('forms/:type')
  async getFormByType(@Param('type') type: string): Promise<FormStructure> {
    return this.insuranceService.getFormByType(type);
  }

  @Post('forms/submit')
  @HttpCode(HttpStatus.CREATED)
  async submitForm(
    @Body() createSubmissionDto: CreateSubmissionDto,
  ): Promise<Submission> {
    return this.insuranceService.submitForm(createSubmissionDto);
  }

  @Get('columns')
  async getColumnDefinitions() {
    return this.insuranceService.getColumnDefinitions();
  }

  @Get('test')
  async testConnection() {
    const count = await this.insuranceService.getTemplateCount();
    return { count };
  }
}
