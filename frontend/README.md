# Smart Insurance Application Portal

A dynamic insurance application portal that allows users to apply for different types of insurance through smart, adaptive forms.

## Features

- 🧠 **Smart Dynamic Forms**: Forms adapt based on user input with conditional logic
- 🔄 **Dynamic API Integration**: Form structures fetched from an API
- 📊 **Customizable Application List**: View, filter, and manage submissions with a configurable list view
- 🌗 **Dark Mode**: Toggle between light and dark modes
- 📱 **Responsive Design**: Optimized for all device sizes

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **State Management**: React Context API, React Query
- **Styling**: Tailwind CSS, Material UI
- **Form Handling**: React Hook Form with Yup validation

## Setup Instructions

1. **Clone the repository**

```bash
git clone <repository-url>
cd devotel-assignment/frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Run the development server**

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## API Usage

The application interacts with a backend API with the following endpoints:

- `GET /api/insurance/forms` - Fetches dynamic form structures
- `POST /api/insurance/forms/submit` - Submits the completed form data
- `GET /api/insurance/forms/submissions` - Retrieves a list of submitted applications

All API calls are handled through the service layer in `src/services/api.ts`.

## Project Structure

```
frontend/
├── src/
│   ├── app/               # Next.js app router pages
│   ├── components/        # React components
│   │   ├── DynamicForm/   # Form components
│   │   ├── Navigation/    # Navigation components
│   │   └── SubmissionsList/ # Submission list components
│   ├── context/           # React context providers
│   ├── services/          # API service layer
│   └── types/             # TypeScript type definitions
├── public/                # Static assets
├── package.json           # Dependencies and scripts
└── README.md              # Project documentation
```

## Implementation Details

### Dynamic Form Rendering

Forms are entirely dynamic, with the structure fetched from the API. Each form:

- Supports conditional fields that appear/disappear based on user input
- Validates input data in real-time
- Can have nested sections and fields
- Dynamically fetches options from APIs for select fields

### Customizable List View

The submissions list provides:

- Column selection for customizing the view
- Sorting by any column
- Filtering by multiple criteria
- Full-text search across all fields
- Pagination for handling large datasets

## License

[MIT](LICENSE)
