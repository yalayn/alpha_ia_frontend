#!/usr/bin/env node
/**
 * Regla 2.6 — FRONTEND_ARCHITECTURE.md
 *
 * Los componentes de `features/` no escriben clases Tailwind de APARIENCIA
 * (colores, tipografía, bordes, sombras, radios) — eso vive en `shared/`.
 * Las clases estructurales de layout y espaciado SÍ están permitidas.
 *
 * Uso: npm run lint:design
 * Sale con código 1 listando archivo:línea de cada violación.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const FEATURES_DIR = join(process.cwd(), 'src', 'features');

// Paletas: tokens del design system + colores default de Tailwind
const COLOR_NAMES = [
  'brand', 'success', 'warning', 'error', 'info',
  'surface', 'subtle', 'muted', 'background', 'foreground', 'border',
  'white', 'black', 'transparent', 'current', 'inherit',
  'slate', 'gray', 'zinc', 'neutral', 'stone', 'red', 'orange', 'amber',
  'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue',
  'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose',
].join('|');

// Variantes (hover:, sm:, focus-visible:, etc.) se quitan antes de evaluar
const VARIANT_PREFIX = /^([a-z-]+:)+/;

const FORBIDDEN = [
  {
    category: 'color',
    regex: new RegExp(
      `^(bg|text|border|ring|divide|outline|decoration|fill|stroke|from|via|to|accent|caret)-(${COLOR_NAMES})(-|$|\\/)`,
    ),
  },
  { category: 'color arbitrario', regex: /^(bg|text|border|ring)-\[/ },
  {
    category: 'tipografía',
    regex: /^(text-(xs|sm|base|md|lg|[2-9]?xl)$|text-\[|font-|leading-|tracking-|italic$|underline$|line-through$|uppercase$|lowercase$|capitalize$)/,
  },
  { category: 'borde', regex: /^(border$|border-[trblxy]$|border-\d|divide-[xy])/ },
  { category: 'sombra', regex: /^shadow(-|$)/ },
  { category: 'radio', regex: /^rounded(-|$)/ },
];

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return walk(path);
    return /\.(tsx|ts)$/.test(entry.name) && !/\.(test|stories)\./.test(entry.name) ? [path] : [];
  });
}

function checkToken(token) {
  const bare = token.replace(VARIANT_PREFIX, '');
  const hit = FORBIDDEN.find(({ regex }) => regex.test(bare));
  return hit ? hit.category : null;
}

const violations = [];

for (const file of walk(FEATURES_DIR)) {
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    // Solo strings dentro de literales — suficiente para className y cn()
    for (const [, str] of line.matchAll(/["'`]([^"'`]*)["'`]/g)) {
      for (const token of str.split(/\s+/).filter(Boolean)) {
        const category = checkToken(token);
        if (category) {
          violations.push({ file: relative(process.cwd(), file), line: i + 1, token, category });
        }
      }
    }
  });
}

if (violations.length > 0) {
  console.error('\n🚫 Regla 2.6 violada — clases de apariencia en features/:\n');
  for (const v of violations) {
    console.error(`  ${v.file}:${v.line}  "${v.token}" (${v.category})`);
  }
  console.error(
    `\n  ${violations.length} violación(es). La apariencia se delega a componentes de shared/.`,
  );
  console.error('  Ver FRONTEND_ARCHITECTURE.md §2.6.\n');
  process.exit(1);
}

console.log('✅ Regla 2.6 — sin clases de apariencia en features/.');
