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
        // response.end("hello world \n")
        response.end(
`<html>
<head>
<style>
body {
 background-color: palevioletred;       
}
span {
    font-size: 30px;
}
.sp {
    margin-bottom: 20px;
}
</style>
</head>
<body>
<div style="background-color: aqua">
<span style="color: aqua" class="sp">12345</span>
</div>
<img src="123" alt="123" />
</body>
</html>
        `)

    })
}).listen(8080)

console.log("start!");