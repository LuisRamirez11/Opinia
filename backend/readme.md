# Backend API - Opinia

This is the backend for the Opinia project, built with Express.js and Supabase.

## Project Structure

The project has been refactored for professionalism and maintainability:

- **src/app.js**: Express application setup and middleware configuration.
- **src/index.js**: Server entry point.
- **src/controllers/**: Logic for handling requests (separation of concerns).
- **src/routes/**: Route definitions mapping to controllers.
- **src/middleware/**: Custom middleware (e.g., centralized error handling).
- **src/config/**: Configuration files (database connection).

## Prerequisites

- Node.js
- Supabase account and project

## Setup

1.  Install dependencies:

    ```bash
    npm install
    ```

2.  Environment Variables:
    Create a `.env` file in the root directory with:
    ```env
    SUPABASE_URL=your_supabase_url
    SUPABASE_SECRET_KEY=your_supabase_key
    PORT=3000
    ```

## Running the Server

### Development

```bash
npm run dev
```

(Ensure `nodemon` is installed or use `node src/index.js`)

### Production

The application is ready for serverless deployment (e.g., AWS Lambda, Vercel) via `serverless-http`.

## API Endpoints

- **GET /api/paises**: List all countries.
- **POST /api/paises**: Create a new country.
- **GET /api/empresas?pais_id={id}**: List companies for a specific country.
- **POST /api/empresas**: Create a new company.
- **GET /api/sedes**: List headquarters (optional filters: `pais_id`, `empresa_id`).
- **GET /api/preguntas?empresa_id={id}**: List active questions for a company.
- **POST /api/preguntas**: Create a new question.
- **POST /api/encuestas**: Submit a new survey response.
- **GET /api/encuestas/reporte**: Get survey results report.
