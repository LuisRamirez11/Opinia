# Backend API - Opinia

API REST para la aplicación Opinia, construida con Express.js y Supabase.

### Tecnologías

- Node.js
- Express.js
- Supabase

### Librerías Principales

- @supabase/supabase-js
- cors
- dotenv
- serverless-http

### Endpoints

- **GET /api/paises**: Listar todos los países.
- **POST /api/paises**: Crear un nuevo país.
- **GET /api/empresas**: Listar empresas (filtro: `pais_id`).
- **POST /api/empresas**: Crear una nueva empresa.
- **GET /api/sedes**: Listar sedes (filtros: `pais_id`, `empresa_id`).
- **GET /api/preguntas**: Listar preguntas activas (filtro: `empresa_id`).
- **POST /api/preguntas**: Crear una nueva pregunta.
- **POST /api/encuestas**: Enviar una respuesta de encuesta.
- **GET /api/encuestas/reporte**: Obtener reporte de resultados.

### Instrucciones de ejecución

1. Instalar dependencias: `npm install`
2. Configurar variables de entorno en `.env`:
   - `SUPABASE_URL`
   - `SUPABASE_SECRET_KEY`
   - `PORT`
3. Ejecutar en desarrollo: `npm run dev`
