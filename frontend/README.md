# Opinia - Sistema de Evaluación de Servicio

Este proyecto es una solución técnica enfocada en la **simplicidad, usabilidad y escalabilidad** para la recolección de encuestas de satisfacción en puntos de servicio.

## 🚀 Ejecución del Proyecto

1.  Instalar dependencias:
    ```bash
    npm install
    ```
2.  Correr en modo desarrollo:
    ```bash
    npm run dev
    ```

## 🏗 Arquitectura y Decisiones Técnicas

El desarrollo se guió por el principio de **KISS (Keep It Simple, Stupid)** y la priorización del valor para el usuario final, alineado con los requerimientos de la evaluación técnica.

### 1. Gestión de Catálogos (Países, Empresas, Sedes)

**Decisión**: Se optó por **NO implementar un CRUD (Interfaz de Administración)** para los catálogos en esta fase inicial.
**Justificación**:

- El requerimiento explícito permite que los catálogos sean "precargados o definidos según criterio".
- Dado el volumen inicial bajo y la prioridad de tiempo, el esfuerzo de desarrollo se centró en **perfeccionar el flujo del usuario final (la encuesta)** y la **integridad de los datos**, en lugar de crear herramientas internas de administración que no aportan valor directo al cliente en el MVP.
- **Mejora Futura**: Implementar un Backoffice seguro para la gestión dinámica de estos datos.

### 2. Exportación de Datos (CSV vs JSON)

**Decisión**: Implementación de exportación directa a **CSV**.
**Justificación**:

- Aunque un JSON es más fácil de generar técnicamente, es inaccesible para el usuario operativo (Gerentes de Sede).
- El CSV permite abrir los resultados inmediatamente en Excel/Sheets, cumpliendo con el criterio de **usabilidad** y permitiendo análisis instantáneo sin transformación de datos.

### 3. Frontend & UX

**Tecnología**: React + Vite + Pico CSS.
**Enfoque**:

- **Pico CSS**: Elegido para garantizar una estructura semántica y responsive sin la sobrecarga de clases utilitarias masivas, manteniendo el código limpio y mantenible.
- **Diseño**: Interfaz "Distraction-free" enfocada en la tasa de finalización de la encuesta.
- **Feedback**: Sistema robusto de notificaciones y estados de carga para mantener al usuario informado en todo momento.

## 🔮 Roadmap / Mejoras

Con más tiempo, las siguientes características serían prioritarias:

- **Panel Administrativo (Backoffice)**: Para ABM de empresas y preguntas.
- **Dashboard de Analítica**: Visualización gráfica de las respuestas en tiempo real.
- **Autenticación**: Login para administradores.

---

**Desarrollado para Evaluación Técnica 2026**
