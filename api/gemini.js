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

  // Parse path parameter forwarded by Vercel rewrite
  const pathParam = req.query.path || '';
  const path = '/' + pathParam;
  
  // Reconstruct query parameters
  const query = { ...req.query };
  delete query.path; // Remove path parameter

  const searchParams = new URLSearchParams();
  for (const [key, val] of Object.entries(query)) {
    if (Array.isArray(val)) {
      val.forEach(v => searchParams.append(key, v));
    } else {
      searchParams.set(key, val);
    }
  }

  // Inject server environment key if present
  if (process.env.GEMINI_API_KEY) {
    searchParams.set('key', process.env.GEMINI_API_KEY);
  }

  const queryString = searchParams.toString();
  const pathWithQuery = path + (queryString ? '?' + queryString : '');
  const targetUrl = `https://generativelanguage.googleapis.com` + pathWithQuery;

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
