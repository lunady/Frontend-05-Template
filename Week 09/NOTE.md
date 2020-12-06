
【参考资料】  
[whatwg tokenization](https://html.spec.whatwg.org/multipage/parsing.html#tokenization)   
[css specifics](https://css-tricks.com/specifics-on-css-specificity/)


【问题】
Hi,助教你好，我在 client.js 文件中解析完成后 
```
let dom = parser.parserHTML(res.body);
console.log(JSON.stringify(dom, null , "    "));
```

打印报错
```
(node:95917) UnhandledPromiseRejectionWarning: TypeError: Converting circular structure to JSON
    at JSON.stringify (<anonymous>)
    at /Users/luna/Documents/toy-brower/client.js:238:22
    at <anonymous>
    at process._tickCallback (internal/process/next_tick.js:188:7)
(node:95917) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). (rejection id: 1)
(node:95917) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.

```

我怀疑可能是 parser.js 中 `emit` 函数中
```
 top.children.push(element);
 element.parent = top;
```
看了半天没有解决，能不能请助教帮忙看一下，是哪里有问题，感谢
