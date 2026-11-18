import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

export const prerender = false;

const json = (body: object, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const POST: APIRoute = async ({ request }) => {
  let data: { dni?: unknown; opcion?: unknown };
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: 'Solicitud inválida.' }, 400);
  }

  const dni = String(data.dni ?? '').trim();
  const opcion = String(data.opcion ?? '');

  if (!/^\d{8}$/.test(dni)) {
    return json({ ok: false, error: 'El DNI debe tener exactamente 8 dígitos.' }, 400);
  }
  if (opcion !== 'candidato' && opcion !== 'blanco') {
    return json({ ok: false, error: 'Elige una opción válida.' }, 400);
  }

  const { error } = await supabase.from('votos').insert({ dni, opcion });

  if (error) {
    // 23505 = violación de restricción UNIQUE -> ese DNI ya votó
    if (error.code === '23505') {
      return json({ ok: false, error: 'Este DNI ya registró su voto.' }, 409);
    }
    console.error(error);
    return json({ ok: false, error: 'No se pudo guardar el voto. Intenta de nuevo.' }, 500);
  }

  return json({ ok: true });
};
