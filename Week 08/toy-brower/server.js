const http = require("http");

http.createServer((request, response) => {
  let body = [];
  request.on('error', err => {
    console.error(err);
  }).on('data', chunk => {
    body.push(chunk.toString())
  }).on('end', err => {
    console.log("body:", body);
    // body = Buffer.concat(body).toString();

    response.writeHead(200, {
      'Content-type': 'text/html'
    })
    response.end("hello world \n")
  })
}).listen(8080)

console.log("start!");
