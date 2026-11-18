import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.SUPABASE_URL ?? process.env.SUPABASE_URL;
const key =
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  throw new Error('Faltan SUPABASE_URL y/o SUPABASE_SERVICE_ROLE_KEY en el archivo .env');
}

// Cliente solo para el servidor (usa la clave secreta).
export const supabase = createClient(url, key, {
  auth: { persistSession: false },
});
