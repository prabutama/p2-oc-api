const http = require('http');

const options = {
  host: 'localhost',
  port: process.env.PORT,
  path: '/health',
  timeout: 5000
};

const req = http.get(options, (res) => {
  if (res.statusCode === 200) {
    process.exit(0); // sehat
  } else {
    process.exit(1); // tidak sehat
  }
});

req.on('error', () => process.exit(1));
req.setTimeout(5000, () => {
  req.abort();
  process.exit(1);
});
