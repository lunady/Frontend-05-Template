const net = require("net");

class Request {
  constructor(options) {
    this.method = options.method || "GET";
    this.host = options.host;
    this.port = options.port || 80;
    this.path = options.path || "/";
    this.body = options.body || {};
    this.headers = options.headers || {};
    if (!this.headers["Content-Type"]) {
      this.headers["Content-Type"] = "application/x-www-form-urlencoded";
    }
    if (this.headers["Content-Type"] === "application/json") {
      this.bodyText = JSON.stringify(this.bodyText)
    } else if (this.headers["Content-Type"] === "application/x-www-form-urlencoded") {
      this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join("&");
    }
    this.headers["Content-Length"] = this.bodyText.length;
  }

  toString() {
    return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key => `${key}:${this.headers[key]}`).join("\r\n")}\r
\r
${this.bodyText}`
  }

  send(connection) {
    return new Promise((resolve, reject) => {
      const parser = new ResponseParser()
      if (connection) {
        connection.write(this.toString())
      } else {
        connection = net.createConnection({
          host: this.host,
          port: this.port,
        }, () => {
          console.log(this);
          connection.write(this.toString())
        })
      }
      connection.on("data", data => {
        console.log(data.toString());
        // 解析接口返回数据
        parser.receive(data.toString());
        if (parser.isFinished) {
          resolve(parser.response);
          connection.end();
        }
      })
      connection.on("error", data => {
        reject(parser.response);
        connection.end();
      })
    })
  }
}

class ResponseParser {
  constructor() {
    this.WAITING_STATUS_LINE = 0;
    this.WAITING_STATUS_LINE_END = 1;
    this.WAITING_HEADERS_NAME = 2;
    this.WAITING_HEADERS_SPACE = 3;
    this.WAITING_HEADERS_VALUE = 4;
    this.WAITING_HEADERS_LINE_END = 5;
    this.WAITING_HEADERS_BLOCK_END = 6;
    this.WAITING_BODY = 7;

    this.current = this.WAITING_STATUS_LINE;
    this.statusLine = '';
    this.headers = {};
    this.headerName = '';
    this.headerValue = '';
    this.bodyParser = null;
  }

  receive(string) {
    // console.log(string);
    // debugger;
    for (let i = 0; i < string.length; i++) {
      this.receiveChar(string.charAt(i))
    }
  }

  receiveChar(char) {
    // console.log(char);
    // debugger;
    if (this.current === this.WAITING_STATUS_LINE) {
      // HTTP/1.1 200 OK\r
      if (char === '\r') {
        this.current = this.WAITING_STATUS_LINE_END;
      } else {
        this.statusLine += char;
      }
    } else if (this.current === this.WAITING_STATUS_LINE_END) {
      // HTTP/1.1 200 OK\r\n
      if (char === '\n') {
        this.current = this.WAITING_HEADERS_NAME;
      }
    } else if (this.current === this.WAITING_HEADERS_NAME) {
      // Content-type: text/html
      if (char === ':') {
        this.current = this.WAITING_HEADERS_SPACE;
      } else if (char === '\r') {
        // 上一行 header 结束了紧接着\r\n 说明整个header解析结束
        this.current = this.WAITING_HEADERS_BLOCK_END;
        // 进入解析 body
        if (this.headers['Transfer-Encoding'] === 'chunked') {
          this.bodyParser = new TrunkedBodyParser();
        }
      } else {
        this.headerName += char;
      }
    } else if (this.current === this.WAITING_HEADERS_SPACE) {
      // Content-type: text/html 冒号后的空格
      if (char === ' ') {
        this.current = this.WAITING_HEADERS_VALUE;
      }
    } else if (this.current === this.WAITING_HEADERS_VALUE) {
      // Content-type: text/html\r\n 解释value结束
      if (char === '\r') {
        this.headers[this.headerName] = this.headerValue;
        this.headerName = '';
        this.headerValue = '';
        this.current = this.WAITING_HEADERS_LINE_END;
      } else {
        this.headerValue += char;
      }
    } else if (this.current === this.WAITING_HEADERS_LINE_END) {
      // Content-type: text/html\r\n 一行结束
      if (char === '\n') {
        // 查找一下一行的header
        this.current = this.WAITING_HEADERS_NAME;
      }
    } else if (this.current === this.WAITING_HEADERS_BLOCK_END) {
      // 全部 header 解析结束
      if (char === '\n') {
        this.current = this.WAITING_BODY;
      }
    } else if (this.current === this.WAITING_BODY) {
      this.bodyParser.receivedChar(char);
    }
  }

  get isFinished() {
    return this.bodyParser && this.bodyParser.isFinished;
  }

  get response() {
    this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);
    return {
      statusCode: RegExp.$1,
      statusText: RegExp.$2,
      headers: this.headers,
      body: this.bodyParser.content.join("")
    };
  }
}

class TrunkedBodyParser {
  constructor() {
    this.WAITING_LENGTH = 0;
    this.WAITING_LENGTH_LINE_END = 1;
    this.READING_TRUNK = 2;
    this.WAITING_NEW_LINE = 3;
    this.WAITING_NEW_LINE_END = 4;

    this.length = 0;
    this.content = [];
    this.isFinished = false;

    this.current = this.WAITING_LENGTH;
  }

  receivedChar(char) {
    // debugger;
    if (this.current === this.WAITING_LENGTH) {
      if (char === '\r') {
        if(this.length === 0){
          this.isFinished = true;
        }
        this.current = this.WAITING_LENGTH_LINE_END;
      } else {
        // length 是 16进制
        this.length *= 16;
        this.length += parseInt(char, 16);
      }
    } else if (this.current === this.WAITING_LENGTH_LINE_END) {
      if (char === '\n') {
        this.current = this.READING_TRUNK;
      }
    } else if (this.current === this.READING_TRUNK) {
      this.content.push(char);
      this.length--;
      if(this.length === 0){
        this.current = this.WAITING_NEW_LINE;
      }
    } else if (this.current === this.WAITING_NEW_LINE) {
      if(char === '\r'){
        this.current = this.WAITING_NEW_LINE_END
      }
    } else if (this.current === this.WAITING_NEW_LINE_END) {
      if(char === '\n'){
        this.current = this.WAITING_LENGTH;
      }
    }
  }

}

void async function () {
  let request = new Request({
    method: "POST",
    host: "127.0.0.1",
    port: "8080",
    path: "/",
    headers: {
      ["X-Foo2"]: "customed"
    },
    body: {
      name: "Aki"
    },
  })
  let res = await request.send()
  console.log(res);
}()


/*

HTTP/1.1 200 OK
Content-type: text/html
Date: Sun, 29 Nov 2020 07:56:43 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Transfer-Encoding: chunked

d
hello world

0

* */
