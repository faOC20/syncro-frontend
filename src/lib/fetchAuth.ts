export async function fetchAuth(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const response = await fetch(url, options);
  
    if (response.status === 401) {
      // Redirige desde Astro del lado del servidor
      return new Response(null, {
        status: 302,
        headers: { Location: '/auth' }
      });
    }
  
    return response;
  }
  