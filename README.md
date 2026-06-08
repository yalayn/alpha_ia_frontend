# Project Alpha — Frontend

React frontend para el SaaS B2B Freemium **Project Alpha**.  
Sigue **Screaming Architecture** (Feature-First): la estructura de carpetas refleja el negocio, no el framework.

---

## Stack

| Tecnología | Rol |
|---|---|
| React + Vite + TypeScript strict | Base de la aplicación |
| TanStack Query | Estado asíncrono y caché del servidor |
| Orval | Generación automática de hooks y tipos desde OpenAPI |
| Axios | Cliente HTTP base |
| Tailwind CSS | Estilos |
| React Hook Form + Zod | Formularios y validación |
| Zustand | Estado de UI global complejo (condicional) |
| Storybook | Desarrollo y documentación de componentes |
| Vitest + React Testing Library | Unit y component tests |
| Playwright | Tests E2E |

---

## Prerequisitos

- **Node.js** v18 o superior
- **npm** v9 o superior
- Los tres repositorios del ecosistema deben ser hermanos bajo el mismo directorio padre:

```
/[directorio-raíz]/
├── alpha_spec/       ← repo alpha_spec (fuente de verdad del contrato)
├── alpha_backend/    ← repo alpha_backend
└── alpha_frontend/   ← este repo
```

> Esta estructura es obligatoria para que `generate-api` pueda leer el `openapi.yaml` de forma local sin necesidad de red ni tokens.

---

## Instalación y arranque

```bash
# 1. Instalar dependencias
npm install

# 2. Generar hooks y tipos desde el contrato OpenAPI
npm run generate-api

# 3. Iniciar el servidor de desarrollo
npm run dev
```

La aplicación quedará disponible en `http://localhost:5173`.

El paso 2 lee `../alpha_spec/docs/openapi.yaml` y genera automáticamente los hooks de TanStack Query y los tipos en `src/api/generated/`. **Nunca editar esa carpeta a mano.**

> **Nota:** el backend debe estar corriendo localmente para que las llamadas a la API funcionen. Ver [`alpha_backend/README.md`](../alpha_backend/README.md).

---

## Comandos disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Compila para producción |
| `npm run preview` | Previsualiza el build de producción |
| `npm run generate-api` | Regenera hooks y tipos desde `openapi.yaml` |
| `npm run test` | Ejecuta unit y component tests (Vitest) |
| `npm run test:ui` | Abre la interfaz visual de Vitest |
| `npm run test:coverage` | Reporte de cobertura |
| `npm run test:e2e` | Ejecuta tests E2E (Playwright) |
| `npm run storybook` | Inicia Storybook en modo desarrollo |
| `npm run build-storybook` | Compila Storybook estático |

---

## Arquitectura

La aplicación se organiza en tres capas principales:

```
src/
├── api/generated/   ← GENERADO. No editar. Hooks y tipos desde OpenAPI.
├── features/        ← Una carpeta por funcionalidad de negocio
└── shared/          ← Componentes UI reutilizables (atoms, molecules)
```

Para el detalle completo de convenciones, reglas y patrones de generación:  
→ [`FRONTEND_ARCHITECTURE.md`](./FRONTEND_ARCHITECTURE.md)

---

## Flujo de trabajo

Este repo forma parte de un ecosistema de tres repositorios coordinados por el [`MASTER_PLAN`](../alpha_spec/MASTER_PLAN.md).

**Convención de ramas:**

| Rama | Contenido |
|---|---|
| `main` | Solo features `✅ Implementado` |
| `feat/SPE-XXX` | Trabajo activo de una feature — misma rama en los tres repos |

**Antes de implementar una feature:**

```bash
# 1. Crear la rama (misma en los tres repos)
git checkout -b feat/SPE-XXX

# 2. Sincronizar el contrato si hubo cambios en alpha_spec/
npm run generate-api
```

---

## Tests

El proyecto sigue la **Pirámide de Testing**:

- **Unit Tests** — lógica pura en `utils/` y hooks complejos (`npm run test`)
- **Component Tests** — estados críticos de UI con RTL (`npm run test`)
- **E2E Tests** — happy paths de usuario con Playwright (`npm run test:e2e`)
