# Privasee Exercise

A full-stack application which fulfils the brief at https://privaseeio.notion.site/Senior-Full-Stack-Developer-Task-2-0-5418be4397be46519630db8ca4436ad5

The app uses Auth0 for users authentication. Any user should be able to access with a Google account
or register with an email and password.
If logging in is prevented by Auth0, please email carboni@robertocarboni.it

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

## Project Structure

```
privasee-exercise/
├── packages/
│   ├── frontend/     # Next.js frontend application
│   ├── backend/      # Express.js backend API
│   └── types/        # Shared TypeScript types
├── package.json      # Root package.json
└── README.md
```

## Setup Instructions

1. Clone the repository

```bash
git clone https://github.com/carboni-rob/privasee-exercise.git
cd privasee-exercise
```

2. Install dependencies

```bash
npm install
```

3. Configure environment variables

Backend (.env in packages/backend):

```env
PORT=3001
AIRTABLE_API_KEY=your_airtable_api_key
AIRTABLE_BASE_ID=your_airtable_base_id
```

Frontend (.env.local in packages/frontend):

```env
AUTH0_SECRET=''
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL=''
AUTH0_CLIENT_ID=''
AUTH0_CLIENT_SECRET=''
NEXT_PUBLIC_AUTH0_API_ACCESS_TOKEN=''
```

## Running the Application

1. Development mode

```bash
# Start both frontend and backend in development mode
npm run dev

# Or start them separately:
npm run dev -w @privasee/frontend
npm run dev -w @privasee/backend
```

The applications will be available at:

- Frontend: http://localhost:3000
- Backend: http://localhost:3001

2. Production build

```bash
# Build all packages
npm run build

# Start in production mode
npm start
```

## Features

- Create, read, update, and delete questions
- Assign questions to users
- Bulk assign multiple questions
- Filter questions by assignee
- Search functionality
- User management through Auth0

## API Endpoints

### Records

- GET /api/records - Get all records (supports filtering)
- POST /api/records - Create a new record
- GET /api/records/:id - Get a specific record
- PUT /api/records/:id - Update a record
- DELETE /api/records/:id - Delete a record
- POST /api/records/bulk/assign - Bulk assign records

## Environment Variables

### Backend

- `PORT`: Server port (default: 3001)
- `AIRTABLE_API_KEY`: Your Airtable API key
- `AIRTABLE_BASE_ID`: Your Airtable base ID

### Frontend

- `AUTH0_SECRET`: A long, secret value used to encrypt the session cookie
- `AUTH0_BASE_URL`: The base url of the application
- `AUTH0_ISSUER_BASE_URL`: The url of your Auth0 tenant domain
- `AUTH0_CLIENT_ID`: The Auth0 application's Client ID
- `AUTH0_CLIENT_SECRET`: The Auth0 application's Client Secret
- `NEXT_PUBLIC_AUTH0_API_ACCESS_TOKEN`: The token to access Auth0 apis

## Development

1. Create new types in packages/types/src/index.ts
2. Build types before use:

```bash
npm run build -w @privasee/types
```

3. Import types in frontend/backend:

```typescript
import { Record } from "@privasee/types";
```

## Troubleshooting

1. If you get module not found errors:

   - Make sure all packages are installed
   - Rebuild the types package
   - Clear the Next.js cache (rm -rf packages/frontend/.next)
