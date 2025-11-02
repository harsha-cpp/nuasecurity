const http = require('http');

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/flag') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    const flag = process.env.SSRF_FLAG || '';
    res.end(flag);
    return;
  }
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('not found');
});

server.listen(PORT, '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(`int-flag-service listening on ${PORT}`);
});



