# Project Alpha — Constitución de Arquitectura de Frontend

> **Documento vivo.** Toda decisión técnica que contradiga este archivo debe primero actualizar este archivo.
> Cualquier PR que viole las reglas aquí definidas es inválido sin excepción.

> **Sobre los ejemplos de código.** Los bloques de código usan nombres genéricos con la notación
> `{Feature}`, `{Entity}`, `{operationId}`, etc. Son **plantillas universales**, no referencias al dominio actual.
> Los nombres concretos del proyecto se derivan de los `operationId` definidos en `docs/openapi.yaml`.

---

## 1. Resumen Ejecutivo

Project Alpha Frontend sigue **Screaming Architecture** (Feature-First).
El objetivo es que la estructura de carpetas grite el negocio, no el framework.
Un desarrollador nuevo debe poder identificar qué hace la aplicación leyendo solo los nombres de las carpetas.

**Stack:** React · Vite · TypeScript strict · TanStack Query · Orval · Tailwind CSS · Zustand (condicional — ver sección 8) · Storybook · React Hook Form + Zod

**Fuente de verdad del contrato API:** Repositorio de especificaciones (`alpha_spec`).
El cliente HTTP y los hooks de TanStack Query se **generan automáticamente** desde el OpenAPI en:
`../alpha_spec/docs/openapi.yaml` — ruta local relativa (los tres repos conviven bajo `project_alpha/`).
Ningún tipo de API ni función de fetching se escribe a mano.
El backend (`alpha_backend`) sincroniza su copia local gitignored desde el mismo contrato con `npm run sync-api`.

---

## 2. Principios Fundamentales

### 2.1 Feature-First
Todo lo relacionado a una funcionalidad de negocio vive junto: componentes, hooks de estado local, lógica de transformación, y tipos propios de esa feature. Las carpetas se organizan por **qué hace** la aplicación, no por **qué tipo de archivo** es.

### 2.2 El OpenAPI es la única fuente de tipos de API
Los tipos que vienen del backend no se escriben a mano. Se generan con Orval desde el OpenAPI de `alpha_spec` (`../alpha_spec/docs/openapi.yaml`). Si un tipo no existe en el OpenAPI, no existe en el frontend.

### 2.3 TanStack Query gestiona el estado asíncrono
El 90% del estado de la aplicación es estado del servidor (datos que vienen de la API). TanStack Query lo gestiona: cache, loading, error, refetch. No se crean stores globales (Zustand, Redux, Context) para datos que vienen de la API.

### 2.4 `shared/` es ciego al negocio
Los componentes en `shared/` son **stateless**. Reciben props, renderizan UI. No conocen conceptos de negocio como "Plan", "Subscription" o "Customer". Si un componente de `shared/` importa algo de `features/`, el código es inválido.

### 2.5 Zustand es la herramienta designada para estado de UI global complejo
Zustand **no se instala por defecto**. Se incorpora únicamente cuando aparece estado de UI que se comparte entre features y que TanStack Query o Context no resuelven bien (ej: notificaciones toast globales, wizard multi-step que persiste entre rutas, estado de un carrito). Cuando ese caso exista, Zustand es la herramienta elegida — no Redux, no Jotai, no un Context gigante. La decisión de incorporarlo debe quedar documentada en este archivo.

**Casos incorporados:**

| Fecha | Caso | Ubicación | Justificación |
|---|---|---|---|
| 2026-06-12 | Sistema de toasts global (DESIGN_SYSTEM.md §10) | `core/toast/toast.store.ts` | Cumple las 3 condiciones de §8.2: no viene de la API, lo disparan todas las features y lo renderiza el layout global, y cambia con frecuencia (Context causaría re-renders en cada toast). |

### 2.6 Los componentes de feature no tienen estilos de presentación propios
Los componentes de `features/` **no escriben estilos visuales directamente**. No usan clases de Tailwind que definan colores, tipografía, bordes, sombras ni radios. Toda decisión de apariencia se delega a los componentes atómicos y moleculares de `shared/`.

```typescript
// ✅ correcto — la feature consume componentes shared que encapsulan el estilo
import { Card, Button, Badge } from '@/shared';
return <Card><Badge variant="success">Activo</Badge><Button variant="primary">Editar</Button></Card>;

// ❌ incorrecto — la feature escribe estilos visuales propios
return <div className="bg-white rounded-lg shadow p-6 border border-gray-200">...</div>;
```

**Razón:** Esta regla es lo que hace posible una renovación visual completa (Nivel 3) regenerando solo la capa `shared/` — sin tocar ninguna feature. Si las features tienen estilos propios, una renovación de diseño requiere editar toda la aplicación.

**Excepción permitida:** Clases de Tailwind estructurales y de layout son aceptables en features — `flex`, `grid`, `gap-*`, `space-*`, `p-*`/`m-*`, `w-full`, `max-w-*`, `overflow-hidden`, `col-span-*`. El layout interno de una página (disposición y espaciado entre bloques) es responsabilidad de la feature. Lo que no está permitido es cualquier clase que defina apariencia: **colores, tipografía, bordes, sombras o radios**.

**Enforcement:** Esta regla se verifica automáticamente con `npm run lint:design` (`scripts/check-design-compliance.mjs`), que corre también en el hook `pre-push`. Una violación bloquea el push.

---

## 3. Estructura de Directorios

```
frontend/
├── src/
│   ├── api/                           # ← GENERADO AUTOMÁTICAMENTE. No editar manualmente.
│   │   ├── generated/
│   │   │   ├── model/                 # Tipos e interfaces — importar desde @/api/generated/model
│   │   │   │   └── {entity}.ts
│   │   │   └── {tag}/{tag}.ts         # Hooks TanStack Query por tag del OpenAPI (modo tags-split)
│   │   └── client.ts                  # Configuración base de axios (único archivo editable)
│   │
│   ├── features/                      # Funcionalidades de negocio
│   │   └── {feature}/                 # Una carpeta por feature
│   │       ├── components/            # Componentes exclusivos de esta feature
│   │       │   └── {Feature}{Role}.tsx
│   │       ├── hooks/                 # Hooks de estado local o composición de hooks generados
│   │       │   └── use-{feature}.ts
│   │       ├── utils/                 # Transformaciones y lógica pura de esta feature
│   │       │   └── {feature}.utils.ts
│   │       ├── types/                 # Tipos locales de esta feature (no de API)
│   │       │   └── {feature}.types.ts
│   │       ├── store/                 # (Opcional) Store Zustand — solo si aplica sección 2.5
│   │       │   └── {feature}.store.ts
│   │       └── index.ts               # Barrel export — única entrada pública de la feature
│   │
│   ├── shared/                        # Componentes UI reutilizables
│   │   ├── components/
│   │   │   ├── atoms/                 # Unidades indivisibles (Button, Input, Badge)
│   │   │   │   └── {Component}/
│   │   │   │       ├── {Component}.tsx
│   │   │   │       └── index.ts
│   │   │   └── molecules/             # Composición de átomos (FormField, Card, Modal)
│   │   │       └── {Molecule}/
│   │   │           ├── {Molecule}.tsx
│   │   │           └── index.ts
│   │   └── index.ts                   # Barrel export de shared
│   │
│   ├── core/                          # Configuración global transversal
│   │   ├── auth/                      # Lógica de autenticación
│   │   ├── providers/                 # React providers (QueryClientProvider, etc.)
│   │   ├── router/                    # Definición de rutas
│   │   └── config/                    # Variables de entorno y constantes globales
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── orval.config.ts                    # Configuración del generador de API (input: URL del backend)
├── FRONTEND_ARCHITECTURE.md
├── tailwind.config.ts
├── vite.config.ts
└── package.json
                                       # Nota: NO hay docs/openapi.yaml en este repo.
                                       # El OpenAPI vive en alpha_spec y Orval lo
                                       # consume por ruta local relativa.
```

---

## 4. La Capa `api/` — Código Generado

**Ruta:** `src/api/`
**Regla crítica:** Esta carpeta está bajo control de Orval. **Ningún archivo dentro de `src/api/generated/` se edita manualmente.** Editar un archivo generado es inválido — el próximo `npm run generate-api` lo sobreescribirá.

### 4.1 Flujo de Generación

```
../alpha_spec/docs/openapi.yaml
      │  (repositorio de especificaciones — fuente de verdad)
      ▼ npm run generate-api
      │
      ├── src/api/generated/model/{schema}.ts    ← interfaces y tipos
      └── src/api/generated/{tag}/{tag}.ts       ← hooks TanStack Query por tag
```

El comando `npm run generate-api` debe ejecutarse cada vez que cambie el `openapi.yaml` en `alpha_spec`. Orval lee el spec por ruta local en cada ejecución. Es el paso 3 del flujo de orquestación del proyecto.

### 4.2 Convención de Hooks Generados

Orval genera hooks usando los `operationId` del OpenAPI como base:

| `operationId` en OpenAPI | Hook generado           | Tipo TanStack Query |
|--------------------------|-------------------------|---------------------|
| `getPlans`               | `useGetPlans()`         | `useQuery`          |
| `getPlanById`            | `useGetPlanById(id)`    | `useQuery`          |
| `createPlan`             | `useCreatePlan()`       | `useMutation`       |
| `subscribeCustomer`      | `useSubscribeCustomer()`| `useMutation`       |
| `validateAccess`         | `useValidateAccess()`   | `useMutation`       |

**Regla:** Los `operationId` del `openapi.yaml` en `alpha_spec` son la única fuente que controla los nombres de los hooks. Si el nombre de un hook no es intuitivo, se corrige el `operationId` en `alpha_spec/docs/openapi.yaml`, no el código generado.

### 4.3 Configuración de Orval

```typescript
// orval.config.ts
import { defineConfig } from 'orval';

export default defineConfig({
  alphaSpec: {
    input: '../alpha_spec/docs/openapi.yaml', // ← ruta local, sin red, sin token
    output: {
      mode: 'tags-split',
      target: './src/api/generated',
      schemas: './src/api/generated/model',
      client: 'react-query',
      httpClient: 'axios',
      prettier: true,
      override: {
        mutator: {
          path: './src/api/client.ts',
          name: 'customInstance',
        },
      },
    },
  },
});
```

El input apunta al `openapi.yaml` de `alpha_spec` por ruta relativa — requiere tener los tres repos clonados bajo el mismo directorio raíz (`project_alpha/`). La opción `prettier: true` garantiza que el código generado sale formateado en cada ejecución.

El path alias `@` se configura en `vite.config.ts`:

```typescript
// vite.config.ts (extracto relevante)
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

**Regla de importación de tipos de API:** Los tipos del backend se importan **siempre** desde `@/api/generated/model`. Nunca se escriben a mano. La fuente de verdad de esos tipos es el `openapi.yaml` de `alpha_spec` — si un tipo necesita un cambio, se modifica allí, no en el frontend.

### 4.4 Cliente HTTP Base

```typescript
// src/api/client.ts — el único archivo de src/api/ que se edita manualmente
import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// La autenticación de Project Alpha utiliza HttpOnly Cookies gestionadas por el backend.
// Para que el navegador adjunte las cookies automáticamente en llamadas cross-origin (si aplica),
// habilitamos withCredentials. NO se utiliza localStorage para guardar tokens JWT.
axiosInstance.defaults.withCredentials = true;

// Interceptores de peticiones para manejo adicional (ej: validaciones pre-vuelo)
axiosInstance.interceptors.request.use((config) => {
  return config;
});

// customInstance es el mutator que Orval inyecta en cada llamada generada
export const customInstance = <T>(config: Parameters<typeof axiosInstance>[0]): Promise<T> => {
  return axiosInstance(config).then(({ data }) => data);
};
```

---

## 5. La Capa `features/` — Funcionalidades de Negocio

**Ruta:** `src/features/`
**Regla crítica:** Una feature puede importar de `shared/` y de `src/api/generated/`. Nunca de otra feature directamente. La comunicación entre features ocurre a través del router o de `core/`.

### 5.1 Anatomía de una Feature

```
features/{feature}/
├── components/          ← componentes que conocen el negocio de esta feature
├── hooks/               ← composición de hooks generados + estado local
├── utils/               ← transformaciones puras (sin efectos secundarios)
├── types/               ← tipos locales (no vienen del OpenAPI)
├── store/               ← (opcional) store Zustand si la feature tiene estado UI complejo compartido
└── index.ts             ← barrel export: única puerta de entrada pública
```

**Regla del `index.ts`:** Solo se exporta lo que otras partes de la aplicación necesitan ver. Los detalles internos de implementación no se exportan.

**Regla de `store/`:** La carpeta `store/` solo existe si la feature tiene estado de UI que no puede resolverse con `useState` o `useReducer` local. Su existencia debe justificarse. Si el estado solo lo usa un componente, no hay store.

### 5.2 Componentes de Feature

Nombrar con el patrón `{Feature}{Role}`:

| Rol          | Descripción                                      | Ejemplo                   |
|--------------|--------------------------------------------------|---------------------------|
| `Page`       | Componente raíz de una ruta. Orquesta la feature.| `PlansPage`               |
| `List`       | Renderiza una colección de items                 | `PlanList`                |
| `Card`       | Renderiza un item individual                     | `PlanCard`                |
| `Form`       | Formulario de creación o edición                 | `SubscriptionForm`        |
| `Detail`     | Vista de detalle de un item                      | `PlanDetail`              |
| `Empty`      | Estado vacío de una lista                        | `PlanEmpty`               |
| `Skeleton`   | Placeholder de carga                             | `PlanSkeleton`            |

**Reglas de componentes de feature:**
- Pueden usar hooks generados por Orval directamente.
- Pueden tener estado local (`useState`, `useReducer`) para UI (modal abierto, tab activo, etc.).
- No contienen lógica de transformación de datos compleja — eso va en `utils/`.
- No reciben datos "crudos" de la API y los transforman inline — usan hooks de `hooks/`.

#### Gestión de Formularios
- Todo formulario se implementa utilizando **React Hook Form**.
- La validación del esquema se delega a **Zod**, utilizando `zodResolver`.
- Los esquemas Zod deben derivarse idealmente de los tipos generados por Orval (`@/api/generated/model`) para garantizar la consistencia con el contrato del backend.

### 5.3 Hooks de Feature

Los hooks de `hooks/` componen los hooks generados y agregan lógica de UI:

```typescript
// features/{feature}/hooks/use-{feature}.ts
import { use{Operation} } from '@/api/generated/{entity}.hooks';
import { {FeatureType} } from '../types/{feature}.types';

export function use{Feature}() {
  const { data, isLoading, error } = use{Operation}();

  // Transformaciones, derivaciones, manejo de estados especiales
  const {derivedValue} = data ? {transform}(data) : {defaultValue};

  return {
    {derivedValue},
    isLoading,
    error,
  };
}
```

**Reglas de hooks de feature:**
- Reciben parámetros de UI, no parámetros de API directamente.
- Retornan valores listos para renderizar — los componentes no transforman datos.
- Nunca hacen `fetch` directamente — siempre usan hooks generados de `src/api/`.

### 5.4 Utils de Feature

Son **funciones puras**: entrada → salida, sin efectos secundarios, sin imports de React.

```typescript
// features/{feature}/utils/{feature}.utils.ts

export function {transformName}(input: {InputType}): {OutputType} {
  // transformación pura
}

export function {formatName}(value: {Type}): string {
  // formateo para display
}
```

**Reglas de utils:**
- Sin imports de React, hooks, ni librerías de estado.
- Testeables con Vitest sin montar componentes.
- Si una función util se necesita en más de una feature, se mueve a `shared/utils/`.

---

## 6. La Capa `shared/` — Componentes UI

**Ruta:** `src/shared/`
**Regla crítica:** `shared/` no importa nada de `features/`. Si un componente de `shared/` necesita conocer el negocio, no pertenece a `shared/`.

### 6.1 Atomic Design

```
shared/components/
├── atoms/       ← indivisibles: Button, Input, Badge, Spinner, Avatar
└── molecules/   ← composición de átomos: FormField, Card, Modal, Table, Tabs
```

No se usa la categoría `organisms` deliberadamente — los organismos son responsabilidad de `features/`.

**Regla de Desarrollo UI (Storybook):**
Todos los componentes dentro de `shared/` (átomos y moléculas) deben desarrollarse y documentarse utilizando **Storybook** (`npm run storybook`). Esto garantiza el desarrollo aislado y asegura que los componentes sean verdaderamente ciegos a la lógica de negocio y estado global.

### 6.2 Anatomía de un Componente Shared

```typescript
// shared/components/atoms/{Component}/{Component}.tsx

interface {Component}Props {
  // props explícitas y tipadas
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export function {Component}({ variant = 'primary', size = 'md', ...props }: {Component}Props) {
  return (
    <element
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
      )}
      {...props}
    />
  );
}
```

**Reglas de componentes shared:**
- Props tipadas explícitamente — sin `any`, sin props no documentadas.
- Variantes controladas por Tailwind con `cn()` (clsx + tailwind-merge).
- Sin estado interno complejo — máximo un `useState` para toggle simple (ej: modal abierto).
- Sin llamadas a la API ni imports de hooks generados.
- Sin imports de `features/`.

### 6.3 Barrel Exports

Cada átomo y molécula exporta desde su `index.ts`:

```typescript
// shared/components/atoms/{Component}/index.ts
export { {Component} } from './{Component}';
export type { {Component}Props } from './{Component}';
```

```typescript
// shared/index.ts
export * from './components/atoms/{Component}';
export * from './components/molecules/{Molecule}';
```

El consumidor importa siempre desde el barrel, nunca desde la ruta interna:

```typescript
// ✅ correcto
import { Button, Card } from '@/shared';

// ❌ incorrecto
import { Button } from '@/shared/components/atoms/Button/Button';
```

---

## 7. La Capa `core/` — Configuración Global

**Ruta:** `src/core/`
**Propósito:** Configuración transversal que no pertenece a ninguna feature ni a `shared/`.

```
core/
├── auth/
│   ├── auth.context.tsx        ← AuthContext + AuthProvider
│   └── use-auth.ts             ← hook de acceso al contexto
├── providers/
│   └── AppProviders.tsx        ← composición de todos los providers
├── router/
│   └── router.tsx              ← definición de rutas con React Router
└── config/
    └── env.ts                  ← variables de entorno tipadas
```

**Reglas de `core/`:**
- `core/` puede importar de `shared/` pero no de `features/`.
- Las rutas en `router.tsx` referencian páginas de `features/` a través de lazy imports.
- **React Router vs TanStack Query:** La carga principal de datos se delega a TanStack Query dentro de las features. Los `loaders` de React Router (v6+) pueden utilizarse opcionalmente para hacer *pre-fetch* de queries de TanStack Query a nivel de ruta y evitar waterfalls, pero el estado final se lee siempre con `useQuery` en el componente.
- Las variables de entorno se acceden **siempre** a través de `core/config/env.ts`, nunca con `import.meta.env.VITE_*` directamente en componentes.

```typescript
// core/config/env.ts
export const env = {
  apiUrl: import.meta.env.VITE_API_URL,
  appEnv: import.meta.env.VITE_APP_ENV ?? 'development',
} as const;
```

---

## 8. Gestión de Estado

### 8.1 Árbol de decisión

```
¿El dato viene de la API?
    └─ SÍ → TanStack Query (hook generado por Orval)
    └─ NO → ¿Se comparte entre features y cambia frecuentemente?
                └─ SÍ → Zustand (ver sección 2.5 — solo si el caso está justificado)
                └─ NO → ¿Se comparte entre componentes dentro de core/?
                            └─ SÍ → Context en core/ (auth, theme, locale)
                            └─ NO → ¿Es estado de UI complejo dentro de una feature?
                                        └─ SÍ → useReducer local en la feature
                                        └─ NO → useState local en el componente
```

**Regla:** Zustand no se instala preventivamente. Se instala cuando un caso concreto llega al nodo "Zustand" de este árbol y no puede resolverse de otra forma. Ese momento se documenta aquí.

### 8.2 Cuándo usar Zustand — criterios concretos

Zustand es la respuesta correcta cuando se cumplen **las tres** condiciones:

- El estado no viene de la API (si viene → TanStack Query)
- El estado se comparte entre dos o más features (si no → useReducer/useState local)
- El estado cambia con frecuencia y Context causaría re-renders innecesarios

Ejemplos válidos: sistema de notificaciones toast globales, wizard de onboarding multi-step que persiste entre rutas, estado de selección múltiple en una tabla que afecta acciones en otra feature.

### 8.3 Patrón de store Zustand (cuando aplica)

```typescript
// features/{feature}/store/{feature}.store.ts
import { create } from 'zustand';

interface {Feature}Store {
  {stateField}: {Type};
  {action}: ({param}: {Type}) => void;
}

export const use{Feature}Store = create<{Feature}Store>((set) => ({
  {stateField}: {initialValue},
  {action}: ({param}) => set({ {stateField}: {param} }),
}));
```

### 8.4 Patrones de TanStack Query

```typescript
// Queries (GET) — en componentes o hooks de feature
const { data, isLoading, error } = use{Entity}();

// Mutations (POST/PUT/DELETE) — con invalidación de cache
const { mutate, isPending } = use{Operation}({
  mutation: {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['{entity}'] });
    },
  },
});
```

**Reglas de TanStack Query:**
- Las `queryKey` se definen en los hooks generados — no se inventan en los componentes.
- La invalidación de cache tras una mutación es responsabilidad del hook de feature, no del componente.
- Los estados `isLoading` y `error` se manejan en el componente más cercano al usuario, no en un HOC global.

---

## 9. Convenciones de Naming

| Elemento               | Convención                          | Ejemplo                          |
|------------------------|-------------------------------------|----------------------------------|
| Feature folder         | `kebab-case`                        | `subscription-management/`       |
| Componente de feature  | `{Feature}{Role}.tsx` en PascalCase | `PlanCard.tsx`                   |
| Componente shared      | PascalCase                          | `Button.tsx`                     |
| Hook de feature        | `use-{feature}.ts` en kebab-case    | `use-plan-management.ts`         |
| Hook generado (Orval)  | `use{OperationId}` en PascalCase    | `useCreatePlan`                  |
| Utils                  | `{feature}.utils.ts`                | `subscription.utils.ts`          |
| Tipos locales          | `{feature}.types.ts`                | `plan.types.ts`                  |
| Barrel export          | siempre `index.ts`                  | `features/plans/index.ts`        |
| Variables de entorno   | `VITE_` prefix en `.env`            | `VITE_API_URL`                   |
| Archivos               | `kebab-case` siempre                | `plan-card.tsx` → `PlanCard.tsx` |

**Nota sobre archivos vs clases:** Los archivos van en `kebab-case`, los componentes y clases en `PascalCase`. `plan-card.tsx` exporta `PlanCard`.

---

## 10. Mapeo OpenAPI → Frontend

Cada `operationId` del contrato en el `openapi.yaml` de `alpha_spec` tiene un mapeo exacto en el frontend:

| `operationId`       | Hook generado            | Feature que lo consume          |
|---------------------|--------------------------|---------------------------------|
| `getPlans`          | `useGetPlans()`          | `features/plans/`               |
| `createPlan`        | `useCreatePlan()`        | `features/plans/`               |
| `subscribeCustomer` | `useSubscribeCustomer()` | `features/subscriptions/`       |
| `validateAccess`    | `useValidateAccess()`    | `features/access-control/`      |
| `getHealth`         | `useGetHealth()`         | `features/dashboard/` o `core/` |

> Agregar un endpoint al `openapi.yaml` de `alpha_spec` sin ejecutar `npm run generate-api` en el frontend y consumirlo en la feature correspondiente **no está permitido**.

---

## 11. Manejo de Errores

### 11.1 Errores de API

TanStack Query captura los errores de red y HTTP automáticamente. El manejo se hace en capas:

| Capa               | Responsabilidad                                              |
|--------------------|--------------------------------------------------------------|
| `client.ts`        | Interceptor global: errores 401 → redirect a login           |
| Hook de feature    | Errores de negocio específicos (404, 409, 422)               |
| Componente         | Renderizar el estado de error al usuario                     |
| `ErrorBoundary`    | Errores de render inesperados — último recurso               |

**Ubicación de Error Boundaries:**
- Existirá un `ErrorBoundary` global en `App.tsx` para atrapar fallos catastróficos.
- Cada página principal de una feature (`{Feature}Page`) debe estar envuelta en su propio `ErrorBoundary` (por ejemplo, a nivel del router). Así, si una feature colapsa, la aplicación general y el menú de navegación siguen funcionando.

### 11.2 Formato de Error del Backend

Los errores del backend siguen el formato definido en el `openapi.yaml` de `alpha_spec` (schema `ErrorResponse`):

```typescript
// Tipo generado automáticamente por Orval
interface ErrorResponse {
  statusCode: number;
  error: string;       // snake_case — ej: "plan_not_found"
  message: string;
  timestamp: string;
  path: string;
}
```

Los componentes leen `error.response.data.error` para mostrar mensajes específicos, nunca `error.message` genérico.

---

## 12. Estrategia de Testing

Project Alpha sigue la estructura de la **Pirámide de Testing** para garantizar resiliencia sin ralentizar el desarrollo.

### 12.1 Unit Tests (Pruebas Unitarias)
- **Herramienta:** Vitest
- **Alcance:** Lógica pura. Obligatorio para todo archivo en `features/{feature}/utils/` y `shared/utils/`. Altamente recomendado para hooks que contienen lógica compleja desconectada de UI.
- **Ejecución:** Frecuente (`npm run test`).

### 12.2 Component Tests (Pruebas de Componentes)
- **Herramienta:** React Testing Library + Vitest
- **Alcance:** Obligatorio para componentes de `shared/` para asegurar que las props y variantes renderizan correctamente. En `features/`, se probarán los estados críticos de la UI mockeando TanStack Query.
- **Ejecución:** Frecuente (`npm run test`).

### 12.3 End-to-End (E2E) Tests
- **Herramienta:** Playwright
- **Alcance:** Flujos críticos de usuario (Happy Paths). Por ejemplo: "El usuario se registra, elige un plan y ve el dashboard". Simulan un navegador real con una base de datos de pruebas.
- **Ejecución:** En CI/CD o antes de fusiones importantes a la rama principal (`npm run test:e2e`).

---

## 13. Flujo de Git

### 13.1 Ramas

| Rama | Propósito |
|---|---|
| `main` | Rama protegida. Solo recibe cambios vía Pull Request. Nunca se pushea directamente. |
| `feat/{descripcion}` | Nueva funcionalidad |
| `fix/{descripcion}` | Corrección de bug |
| `chore/{descripcion}` | Mantenimiento, dependencias, config |
| `docs/{descripcion}` | Solo documentación |

### 13.2 Flujo de trabajo

```
# 1. Partir siempre de main actualizado
git checkout main && git pull

# 2. Crear rama de feature
git checkout -b feat/nombre-descriptivo

# 3. Desarrollar y commitear
git add <archivos>
git commit -m "feat: descripción del cambio"

# 4. Pushear la rama y abrir PR hacia main
git push origin feat/nombre-descriptivo
# → Abrir PR en GitHub: feat/nombre-descriptivo → main
```

### 13.3 Protecciones

- **Hook local (`pre-push`):** Bloquea pushes directos a `main`. Se instala automáticamente con `npm install`.
- **Branch protection en GitHub:** `main` debe tener habilitado "Require a pull request before merging" en Settings → Branches.

### 13.4 Convención de commits

Seguir [Conventional Commits](https://www.conventionalcommits.org/):

| Prefijo | Cuándo usarlo |
|---|---|
| `feat:` | Nueva funcionalidad |
| `fix:` | Corrección de bug |
| `chore:` | Mantenimiento sin impacto en lógica |
| `docs:` | Solo documentación |
| `refactor:` | Refactor sin cambio de comportamiento |
| `test:` | Agregar o corregir tests |

---

## 14. Checklist de PR

Antes de aprobar cualquier Pull Request, verificar:

- [ ] No existe ningún tipo de API escrito a mano en `src/` fuera de `src/api/generated/`
- [ ] Los tipos de API se importan desde `@/api/generated/model`, nunca se escriben a mano
- [ ] Ningún archivo dentro de `src/api/generated/` fue editado manualmente
- [ ] Los hooks de TanStack Query se usan para todo dato que viene de la API
- [ ] Ningún componente de `shared/` importa de `features/`
- [ ] Ninguna feature importa directamente de otra feature
- [ ] Ningún componente de `features/` usa clases de Tailwind de apariencia (colores, tipografía, bordes, sombras, radios) — solo consume componentes de `shared/`; las clases estructurales de layout y espaciado (`flex`, `grid`, `gap-*`, `space-*`, `p-*`/`m-*`, `w-full`, `max-w-*`) están permitidas
- [ ] Las variables de entorno se acceden solo a través de `core/config/env.ts`
- [ ] Los barrel exports (`index.ts`) están actualizados en la feature modificada
- [ ] El `operationId` nuevo en el OpenAPI (en `alpha_spec`) tiene su hook generado y consumido
- [ ] La nomenclatura sigue las convenciones de la sección 9
- [ ] `npm run generate-api` se ejecutó después del último cambio en el `openapi.yaml` de `alpha_spec`
- [ ] Si se agregó `store/` a una feature, el caso está justificado según sección 2.5 y 8.2
