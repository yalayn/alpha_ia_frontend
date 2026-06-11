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
