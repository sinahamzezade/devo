# Smart Insurance Application Portal

A dynamic insurance application system allowing users to apply for different types of insurance through dynamic forms. The system includes a NestJS backend with TypeORM and SQLite.

## Features

### Backend

- Dynamic form structures for different insurance types (Health, Car, Home)
- RESTful API endpoints for fetching form definitions, submitting forms, and retrieving submissions
- Conditional form fields based on user responses
- SQLite database with models for insurance templates, fields, and submissions
- Data validation with class-validator

## API Endpoints

- `GET /api/insurance/forms` - Get all available insurance form templates
- `GET /api/insurance/forms/:type` - Get a specific insurance form template by type
- `POST /api/insurance/forms/submit` - Submit a completed insurance form
- `GET /api/insurance/forms/submissions` - Get all submitted applications in a customizable list format
- `GET /api/insurance/columns` - Get available columns for the list view

## Project Structure

```
.
├── backend/               # NestJS backend
│   ├── src/
│   │   ├── insurance/     # Insurance module
│   │   │   ├── dto/       # Data transfer objects
│   │   │   ├── entities/  # TypeORM entities
│   │   │   ├── insurance.controller.ts
│   │   │   ├── insurance.module.ts
│   │   │   └── insurance.service.ts
│   │   ├── migrations/    # Database migrations
│   │   ├── app.module.ts
│   │   ├── main.ts
│   │   └── seed.ts        # Database seeding script
│   ├── data/              # SQLite database files
│   │   └── insurance.sqlite
│   └── package.json
└── README.md
```

## Getting Started

### Installation

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Running the Application

To run the application in production mode:

1. Make sure you're in the root directory of the project
2. Run the following command:

```bash
./run.sh
```

This script will:

- Reset and seed the database
- Build both frontend and backend
- Start both services in production mode

To stop the application, press `Ctrl+C` in the terminal.

### Development Mode

If you want to run the application in development mode:

```bash
# Start the backend in development mode
cd backend
npm run start:dev

# In a separate terminal, start the frontend in development mode
cd frontend
npm run dev
```

The server will be running at http://localhost:3000 by default.

## Database

The application uses SQLite with the database file located at `backend/data/insurance.sqlite`. The database includes the following tables:

- `insurance_form_templates` - Stores information about different insurance form templates
- `insurance_form_fields` - Stores field definitions for each template with conditional logic
- `insurance_submissions` - Stores user-submitted form data

## Technologies Used

- NestJS
- TypeORM
- SQLite
- Class Validator
- RESTful API

## Example Form Structure

Forms are built dynamically based on JSON structures stored in the database. Each form includes fields with:

- Basic properties (label, type, placeholder, etc.)
- Validation rules
- Conditional logic (show/hide based on other field values)

Example Health Insurance form might include:

- Personal details
- Medical history
- Gender-specific questions (pregnancy status for female applicants)
- Pre-existing conditions
