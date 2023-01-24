const http = require('http')
const fs = require('fs')

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'content-type': 'text/html' })
  fs.createReadStream('index.html').pipe(res)
})

const port = 3000;
const host = 'localhost';

server.listen(port, host, () => console.log('Server is running!'))