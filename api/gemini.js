export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Extract path and query parameters
  const fullUrl = req.url || '';
  const pathWithQuery = fullUrl.replace(/^\/api\/gemini/, '');
  
  // Safe URL parsing
  const urlObj = new URL(pathWithQuery, 'https://generativelanguage.googleapis.com');
  
  // Inject server environment key if present
  if (process.env.GEMINI_API_KEY) {
    urlObj.searchParams.set('key', process.env.GEMINI_API_KEY);
  }
  
  const targetUrl = urlObj.toString();

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: req.method === 'POST' ? JSON.stringify(req.body) : undefined
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (e) {
    return res.status(500).json({ error: { message: e.message } });
  }
}
