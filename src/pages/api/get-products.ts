// src/pages/api/get-products.ts
import { BACK_API } from 'astro:env/client';

export async function get({ request }) {
  const cookieHeader = request.headers.get('cookie') || '';

  const flaskResponse = await fetch(`${BACK_API}/api/get-products`, {
    method: 'GET',
    headers: {
      Cookie: cookieHeader
    }
  });

  if (!flaskResponse.ok) {
    return new Response(JSON.stringify({ error: 'No autorizado o error del servidor Flask' }), {
      status: flaskResponse.status,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const data = await flaskResponse.json();

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  });
}
