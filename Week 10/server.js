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
    display: inline-block;
    font-size: 30px;
    flex: 1;
    height: 100px;
}
.sp {
    margin-bottom: 20px;
}
div {
    display: flex;
    flex-wrap: nowrap;
    width: 80px;
    height: 400px;
}
p {
width: 60px;
height: 50px;
}
</style>
</head>
<body>
<div style="background-color: aqua">
  <div style="color: aqua" class="sp">11</div>
  <p >22</p>
  <div >33</div>
  <p>p4</p>
</div>
<img src="123" alt="123" />
</body>
</html>
        `)

    })
}).listen(8080)

console.log("start!");
