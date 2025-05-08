import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { Prisma } from '@prisma/client';
import { FormField, FormSection, FormStructure, Submission } from './types/form.types';

type InsuranceFormTemplateWithRelations =
  Prisma.InsuranceFormTemplateGetPayload<{
    include: {
      fields: true;
      sections: {
        include: {
          fields: true;
        }
      };
    };
  }>;

@Injectable()
export class InsuranceService {
  constructor(private prisma: PrismaService) {}

  private mapDatabaseFieldToFormField(dbField: any): FormField {
    const formField: FormField = {
      id: dbField.name,
      type: dbField.type,
      label: dbField.label,
      required: dbField.required,
    };

    if (dbField.placeholder) {
      formField.placeholder = dbField.placeholder;
    }

    if (dbField.options) {
      try {
        formField.options = JSON.parse(dbField.options);
      } catch (e) {
        console.error('Error parsing options:', e);
      }
    }

    if (dbField.validation) {
      try {
        formField.validation = JSON.parse(dbField.validation);
      } catch (e) {
        console.error('Error parsing validation:', e);
      }
    }

    if (dbField.conditions) {
      try {
        formField.conditions = JSON.parse(dbField.conditions);
      } catch (e) {
        console.error('Error parsing conditions:', e);
      }
    }

    if (dbField.apiEndpoint) {
      formField.apiEndpoint = dbField.apiEndpoint;
    }

    // Handle nested fields if they exist
    if (dbField.nestedFields && dbField.nestedFields.length > 0) {
      formField.fields = dbField.nestedFields.map(this.mapDatabaseFieldToFormField.bind(this));
    }

    return formField;
  }

  private transformDatabaseFormToFrontendFormat(
    dbForm: any,
  ): FormStructure {
    const formStructure: FormStructure = {
      id: String(dbForm.id), 
      title: dbForm.name,
      type: dbForm.type,
    };

    // Transform sections
    if (dbForm.sections && dbForm.sections.length > 0) {
      formStructure.sections = dbForm.sections
        .sort((a: any, b: any) => a.order - b.order)
        .map((section: any): FormSection => ({
          id: String(section.id),
          title: section.name,
          fields: section.fields && Array.isArray(section.fields)
            ? section.fields
                .sort((a: any, b: any) => a.order - b.order)
                .map(this.mapDatabaseFieldToFormField.bind(this))
            : [],
        }));
    }

    // Handle fields that are directly on the form template (not in sections)
    const rootFields = dbForm.fields && Array.isArray(dbForm.fields)
      ? dbForm.fields.filter((field: any) => !field.sectionId)
      : [];
      
    if (rootFields.length > 0) {
      formStructure.fields = rootFields
        .sort((a: any, b: any) => a.order - b.order)
        .map(this.mapDatabaseFieldToFormField.bind(this));
    }

    return formStructure;
  }

  async getFormByType(type: string): Promise<FormStructure> {
    const form = await this.prisma.insuranceFormTemplate.findFirst({
      where: { type },
      include: {
        fields: true,
        sections: {
          include: {
            fields: true,
          },
        },
      },
    });

    if (!form) {
      throw new NotFoundException(`Form template with type ${type} not found`);
    }

    return this.transformDatabaseFormToFrontendFormat(form);
  }

  async getAllForms(): Promise<FormStructure[]> {
    const forms = await this.prisma.insuranceFormTemplate.findMany({
      include: {
        fields: true,
        sections: {
          include: {
            fields: true,
          },
        },
      },
    });

    return forms.map(this.transformDatabaseFormToFrontendFormat.bind(this));
  }

  async submitForm(
    createSubmissionDto: CreateSubmissionDto,
  ): Promise<any> {
    const submission = await this.prisma.insuranceSubmission.create({
      data: {
        templateId: createSubmissionDto.templateId,
        data: JSON.stringify(createSubmissionDto.data),
        status: 'pending',
      },
    });
    return submission;
  }

  async getSubmissions(): Promise<Submission[]> {
    const submissions = await this.prisma.insuranceSubmission.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return submissions.map(submission => ({
      id: String(submission.id),
      ...JSON.parse(submission.data),
      status: submission.status,
      createdAt: submission.createdAt,
    }));
  }

  async getColumnDefinitions(): Promise<{ columns: string[] }> {
    // Return available columns for the list view
    return {
      columns: [
        'id',
        'fullName',
        'email',
        'age',
        'type',
        'status',
        'createdAt',
      ],
    };
  }

  async getTemplateCount(): Promise<number> {
    const count = await this.prisma.insuranceFormTemplate.count();
    return count;
  }
}
