import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['warn', 'error'],
});

async function main() {
  try {
    // Clear existing data
    console.log('Clearing existing data...');
    await prisma.insuranceSubmission.deleteMany({});
    await prisma.insuranceFormField.deleteMany({});
    await prisma.insuranceFormSection.deleteMany({});
    await prisma.insuranceFormTemplate.deleteMany({});

    console.log('Creating health insurance form...');
    // Create a health insurance form
    const healthTemplate = await prisma.insuranceFormTemplate.create({
      data: {
        name: 'Health Insurance Form',
        type: 'health',
        description: 'Form for health insurance applications',
      },
    });

    // Create sections
    const personalSection = await prisma.insuranceFormSection.create({
      data: {
        name: 'Personal Information',
        order: 1,
        templateId: healthTemplate.id,
      },
    });

    const medicalSection = await prisma.insuranceFormSection.create({
      data: {
        name: 'Medical History',
        order: 2,
        templateId: healthTemplate.id,
      },
    });

    // Create fields one by one
    await prisma.insuranceFormField.create({
      data: {
        name: 'fullName',
        type: 'text',
        label: 'Full Name',
        required: true,
        sectionId: personalSection.id,
        templateId: healthTemplate.id,
      },
    });

    await prisma.insuranceFormField.create({
      data: {
        name: 'email',
        type: 'email',
        label: 'Email Address',
        required: true,
        validation: JSON.stringify({
          required: true,
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
        }),
        sectionId: personalSection.id,
        templateId: healthTemplate.id,
      },
    });

    await prisma.insuranceFormField.create({
      data: {
        name: 'age',
        type: 'number',
        label: 'Age',
        required: true,
        validation: JSON.stringify({
          required: true,
          min: 18,
          max: 120,
        }),
        sectionId: personalSection.id,
        templateId: healthTemplate.id,
      },
    });

    await prisma.insuranceFormField.create({
      data: {
        name: 'gender',
        type: 'radio',
        label: 'Gender',
        required: true,
        options: JSON.stringify([
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' },
          { label: 'Other', value: 'other' },
          { label: 'Prefer not to say', value: 'not_specified' },
        ]),
        sectionId: personalSection.id,
        templateId: healthTemplate.id,
      },
    });

    await prisma.insuranceFormField.create({
      data: {
        name: 'pregnancyStatus',
        type: 'radio',
        label: 'Pregnancy Status',
        required: false,
        options: JSON.stringify([
          { label: 'Currently pregnant', value: 'pregnant' },
          { label: 'Planning pregnancy in next 12 months', value: 'planning' },
          { label: 'Not applicable', value: 'not_applicable' },
        ]),
        conditions: JSON.stringify([
          { field: 'gender', operator: 'equals', value: 'female' },
        ]),
        sectionId: personalSection.id,
        templateId: healthTemplate.id,
      },
    });

    await prisma.insuranceFormField.create({
      data: {
        name: 'existingConditions',
        type: 'checkbox',
        label: 'Do you have any existing medical conditions?',
        required: true,
        sectionId: medicalSection.id,
        templateId: healthTemplate.id,
      },
    });

    await prisma.insuranceFormField.create({
      data: {
        name: 'conditionDetails',
        type: 'text',
        label: 'Please describe your medical conditions',
        required: false,
        placeholder: 'List any diagnosed conditions',
        conditions: JSON.stringify([
          { field: 'existingConditions', operator: 'equals', value: true },
        ]),
        sectionId: medicalSection.id,
        templateId: healthTemplate.id,
      },
    });

    console.log('Creating car insurance form...');
    // Create a car insurance form
    const carTemplate = await prisma.insuranceFormTemplate.create({
      data: {
        name: 'Car Insurance Form',
        type: 'car',
        description: 'Form for car insurance applications',
      },
    });

    // Create sections
    const carPersonalSection = await prisma.insuranceFormSection.create({
      data: {
        name: 'Personal Information',
        order: 1,
        templateId: carTemplate.id,
      },
    });

    const carVehicleSection = await prisma.insuranceFormSection.create({
      data: {
        name: 'Vehicle Information',
        order: 2,
        templateId: carTemplate.id,
      },
    });

    // Add personal information fields for car insurance
    await prisma.insuranceFormField.create({
      data: {
        name: 'fullName',
        type: 'text',
        label: 'Full Name',
        required: true,
        sectionId: carPersonalSection.id,
        templateId: carTemplate.id,
      },
    });

    await prisma.insuranceFormField.create({
      data: {
        name: 'email',
        type: 'email',
        label: 'Email Address',
        required: true,
        validation: JSON.stringify({
          required: true,
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
        }),
        sectionId: carPersonalSection.id,
        templateId: carTemplate.id,
      },
    });

    await prisma.insuranceFormField.create({
      data: {
        name: 'phone',
        type: 'tel',
        label: 'Phone Number',
        required: true,
        validation: JSON.stringify({
          required: true,
          pattern: '^\\+?[1-9]\\d{1,14}$',
        }),
        sectionId: carPersonalSection.id,
        templateId: carTemplate.id,
      },
    });

    await prisma.insuranceFormField.create({
      data: {
        name: 'address',
        type: 'text',
        label: 'Address',
        required: true,
        sectionId: carPersonalSection.id,
        templateId: carTemplate.id,
      },
    });

    await prisma.insuranceFormField.create({
      data: {
        name: 'dateOfBirth',
        type: 'date',
        label: 'Date of Birth',
        required: true,
        validation: JSON.stringify({
          required: true,
          min: '1900-01-01',
          max: new Date().toISOString().split('T')[0],
        }),
        sectionId: carPersonalSection.id,
        templateId: carTemplate.id,
      },
    });

    await prisma.insuranceFormField.create({
      data: {
        name: 'hasAccidents',
        type: 'radio',
        label: 'Have you had any accidents?',
        required: true,
        options: JSON.stringify([
          { label: 'Yes', value: 'yes' },
          { label: 'No', value: 'no' },
        ]),
        sectionId: carVehicleSection.id,
        templateId: carTemplate.id,
      },
    });

    await prisma.insuranceFormField.create({
      data: {
        name: 'accidentCount',
        type: 'number',
        label: 'Number of Accidents',
        required: false,
        validation: JSON.stringify({
          min: 1,
        }),
        conditions: JSON.stringify([
          { field: 'hasAccidents', operator: 'equals', value: 'yes' },
        ]),
        sectionId: carVehicleSection.id,
        templateId: carTemplate.id,
      },
    });

    console.log('Creating home insurance form...');
    // Create a home insurance form
    const homeTemplate = await prisma.insuranceFormTemplate.create({
      data: {
        name: 'Home Insurance Form',
        type: 'home',
        description: 'Form for home insurance applications',
      },
    });

    // Create sections
    const homePropertySection = await prisma.insuranceFormSection.create({
      data: {
        name: 'Property Information',
        order: 1,
        templateId: homeTemplate.id,
      },
    });

    // Add personal information section for home insurance
    const homePersonalSection = await prisma.insuranceFormSection.create({
      data: {
        name: 'Personal Information',
        order: 0,
        templateId: homeTemplate.id,
      },
    });

    // Add personal information fields for home insurance
    await prisma.insuranceFormField.create({
      data: {
        name: 'fullName',
        type: 'text',
        label: 'Full Name',
        required: true,
        sectionId: homePersonalSection.id,
        templateId: homeTemplate.id,
      },
    });

    await prisma.insuranceFormField.create({
      data: {
        name: 'email',
        type: 'email',
        label: 'Email Address',
        required: true,
        validation: JSON.stringify({
          required: true,
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
        }),
        sectionId: homePersonalSection.id,
        templateId: homeTemplate.id,
      },
    });

    await prisma.insuranceFormField.create({
      data: {
        name: 'phone',
        type: 'tel',
        label: 'Phone Number',
        required: true,
        validation: JSON.stringify({
          required: true,
          pattern: '^\\+?[1-9]\\d{1,14}$',
        }),
        sectionId: homePersonalSection.id,
        templateId: homeTemplate.id,
      },
    });

    await prisma.insuranceFormField.create({
      data: {
        name: 'address',
        type: 'text',
        label: 'Current Address',
        required: true,
        sectionId: homePersonalSection.id,
        templateId: homeTemplate.id,
      },
    });

    await prisma.insuranceFormField.create({
      data: {
        name: 'dateOfBirth',
        type: 'date',
        label: 'Date of Birth',
        required: true,
        validation: JSON.stringify({
          required: true,
          min: '1900-01-01',
          max: new Date().toISOString().split('T')[0],
        }),
        sectionId: homePersonalSection.id,
        templateId: homeTemplate.id,
      },
    });

    // Only add example of conditional field here
    await prisma.insuranceFormField.create({
      data: {
        name: 'hasSecurity',
        type: 'radio',
        label: 'Do you have a security system?',
        required: true,
        options: JSON.stringify([
          { label: 'Yes', value: 'yes' },
          { label: 'No', value: 'no' },
        ]),
        sectionId: homePropertySection.id,
        templateId: homeTemplate.id,
      },
    });

    await prisma.insuranceFormField.create({
      data: {
        name: 'securitySystemType',
        type: 'select',
        label: 'Security System Type',
        required: false,
        options: JSON.stringify([
          { label: 'Basic Alarm', value: 'basic' },
          { label: 'Camera System', value: 'camera' },
          { label: 'Monitored Service', value: 'monitored' },
          { label: 'Smart Home Security', value: 'smart' },
        ]),
        conditions: JSON.stringify([
          { field: 'hasSecurity', operator: 'equals', value: 'yes' },
        ]),
        sectionId: homePropertySection.id,
        templateId: homeTemplate.id,
      },
    });

    console.log('Seed data created successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
