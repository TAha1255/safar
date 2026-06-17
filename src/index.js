export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ status: 'Travel Proxy is running!' }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    try {
      const body = await request.json();
      // API Key يأتي من Secret الآمن في Cloudflare
      const apiKey = env.CLAUDE_API_KEY;
      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(body.payload)
      });
      const data = await resp.json();
      return new Response(JSON.stringify(data), {
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500,
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }
      });
    }
  }
}
