# Votación con Astro + Supabase

Web de votación con dos opciones (una persona y voto en blanco). Guarda el DNI y el voto, bloquea DNI repetidos y muestra resultados en vivo.

## 1. Preparar Supabase

1. Crea un proyecto en https://supabase.com
2. Abre **SQL Editor**, pega el contenido de `supabase.sql` y ejecútalo.
3. En **Project Settings → API** copia la *Project URL* y la clave **service_role**.

## 2. Configurar y correr

```bash
cp .env.example .env     # y pega tus datos de Supabase
npm install
npm run dev              # http://localhost:4321
```

- `/` → formulario de votación
- `/resultados` → resultados con porcentajes (se actualiza cada 15 s)

Para cambiar el nombre de la persona o el título, edita `src/config.ts`.

## 3. Publicar

```bash
npm run build
npm start                # servidor Node en dist/server/entry.mjs
```

Funciona en cualquier hosting con Node (Railway, Render, Fly.io, VPS). Define `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` como variables de entorno del hosting.

## Cómo evita votar dos veces

La columna `dni` de la tabla `votos` es `UNIQUE`. Si el DNI ya existe, Supabase rechaza el insert (código 23505) y la API responde "Este DNI ya registró su voto". La restricción vive en la base de datos, así que no se puede saltar desde el navegador.

## Seguridad

- La clave `service_role` solo se usa en el servidor (`src/lib/supabase.ts`). Nunca la pongas en código del navegador ni la subas a Git.
- La tabla tiene RLS activado sin políticas: nadie puede leerla con la clave pública.
