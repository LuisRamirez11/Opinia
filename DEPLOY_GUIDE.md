# Guía de Despliegue Frontend (AWS S3 + CloudFront)

Esta guía detalla los pasos para desplegar la aplicación React optimizada en AWS utilizando S3 para almacenamiento y CloudFront para distribución global y SSL.

## 1. Generar Build de Producción

Primero, aseguramos que el código esté limpio y listo.

```bash
cd frontend
npm run build
```

Esto generará una carpeta `dist/` con los archivos HTML, CSS y JS optimizados. Vite usará automáticamente la URL definida en `.env.production`.

## 2. Crear Bucket S3 (Almacenamiento)

```bash
# Cambia 'opinia-frontend-prod' por un nombre único
aws s3 mb s3://opinia-frontend-prod
```

### Configurar como sitio web (Opcional si usas CloudFront puro, pero recomendable para pruebas)

```bash
aws s3 website s3://opinia-frontend-prod --index-document index.html --error-document index.html
```

### Política de Privacidad (Hacerlo público para CloudFront o usar OAI)

Para simplificar (método bucket público):

1. Desactiva "Block Public Access" en la consola o CLI.
2. Añade política de bucket para lectura pública.

## 3. Subir Archivos

```bash
aws s3 sync dist/ s3://opinia-frontend-prod --delete
```

## 4. Crear Distribución CloudFront (CDN + SSL)

Este paso es mejor hacerlo desde la consola AWS por la complejidad de parámetros, pero básicamente:

1.  **Origin Domain**: Selecciona tu bucket S3.
2.  **Viewer Protocol Policy**: Redirect HTTP to HTTPS.
3.  **Default Root Object**: index.html
4.  **Error Pages**: Configura 404 para que responda con `/index.html` (código 200) para manejar el routing de React.

## Comandos Rápidos para Actualizar

Cada vez que hagas cambios en el frontend:

1.  `npm run build`
2.  `aws s3 sync dist/ s3://opinia-frontend-prod --delete`
3.  Invalidar caché de CloudFront (opcional pero recomendado):
    `aws cloudfront create-invalidation --distribution-id <ID> --paths "/*"`
