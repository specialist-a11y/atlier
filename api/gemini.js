import https from 'https';

export default function handler(req, res) {
  // CORS Headers
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
  delete query.path;

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
  const targetUrl = `https://generativelanguage.googleapis.com${path}${queryString ? '?' + queryString : ''}`;

  const reqOpts = {
    method: req.method,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const proxyReq = https.request(targetUrl, reqOpts, (proxyRes) => {
    // Forward status code
    res.statusCode = proxyRes.statusCode || 200;
    
    // Forward relevant headers
    if (proxyRes.headers['content-type']) {
      res.setHeader('Content-Type', proxyRes.headers['content-type']);
    }

    // Pipe raw response stream directly to client
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (e) => {
    res.status(500).json({ error: { message: e.message } });
  });

  // Write POST body if present
  if (req.method === 'POST' && req.body) {
    proxyReq.write(JSON.stringify(req.body));
  }
  
  proxyReq.end();
}
