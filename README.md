# Opinia Backend

Backend para el sistema de encuestas Opinia, construido con Node.js, Express y Serverless Framework para despliegue en AWS Lambda.

## Descripción

Este servicio maneja la lógica de negocio para las encuestas, conectándose a una base de datos Supabase. Está diseñado para ser desplegado como una función Lambda serverless, pero también puede ejecutarse localmente.

## Requisitos Previos

- Node.js 18.x o superior
- Cuenta en AWS (para despliegue)
- Proyecto en Supabase (para base de datos)

## Instalación

1.  Clonar el repositorio (si no lo has hecho):

    ```bash
    git clone <url-del-repo>
    cd opinia/backend
    ```

2.  Instalar dependencias:
    ```bash
    npm install
    ```

## Configuración

El proyecto utiliza variables de entorno para la configuración.

### Desarrollo Local

Crea un archivo `.env` en la raíz del directorio `backend` con las siguientes variables:

```ini
SUPABASE_URL=tu_url_de_supabase
SUPABASE_KEY=tu_service_role_key_o_anon_key
NODE_ENV=development
```

> **Nota:** El archivo `.env` permite que la aplicación se conecte a Supabase localmente. Al desplegar con `serverless deploy`, si este archivo no está excluido en `.serverlessignore` o `.gitignore`, se subirá junto con el código, permitiendo que la Lambda acceda a estas variables.

## Uso

### Ejecutar Localmente

Para desarrollo, puedes usar `nodemon` (si está configurado) o `serverless-offline` para simular el entorno Lambda.

```bash
# Opción recomendada para desarrollo rápido
npm run dev
# O si usas serverless-offline
npx serverless offline
```

### Endpoints Principales

- `GET /`: Verifica el estado del servicio.
  - Respuesta: `{ "status": "ok", "service": "opinia-backend", ... }`

## Despliegue

Para desplegar en AWS Lambda utilizando Serverless Framework:

1.  Configura tus credenciales de AWS:

    ```bash
    aws configure
    ```

2.  Ejecuta el comando de despliegue:
    ```bash
    npx serverless deploy
    ```

Esto empaquetará la aplicación y la subirá a AWS, devolviendo la URL del API Gateway.

## Estructura del Proyecto

- `src/app.js`: Configuración de la aplicación Express y middlewares.
- `src/index.js`: Punto de entrada para la función Lambda (`handler`).
- `src/routes/`: Definición de rutas de la API.
- `serverless.yml`: Configuración de infraestructura (AWS Lambda, API Gateway).
