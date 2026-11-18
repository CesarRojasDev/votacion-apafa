-- Ejecuta esto en Supabase -> SQL Editor

create table if not exists votos (
  id bigint generated always as identity primary key,
  dni text not null unique check (dni ~ '^[0-9]{8}$'),  -- unique = un DNI solo puede votar una vez
  opcion text not null check (opcion in ('candidato', 'blanco')),
  created_at timestamptz not null default now()
);

-- Seguridad: con RLS activado y SIN políticas, nadie con la clave pública
-- puede leer ni escribir. Solo el servidor (clave service_role) accede.
alter table votos enable row level security;
