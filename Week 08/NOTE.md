### 米利型有限状态机  
在计算理论中，米利型有限状态机（英语：Mealy machine）是基于它的当前状态和输入生成输出的有限状态自动机（更精确的叫有限状态变换器）。这意味着它的状态图将为每个转移边包括输入和输出二者。与输出只依赖于机器当前状态的摩尔有限状态机不同，它的输出与当前状态和输入都有关。但是对于每个Mealy机都有一个等价的Moore机，该等价的Moore机的状态数量上限是所对应Mealy机状态数量和输出数量的乘积加1。

## transfer-encoding
Transfer-Encoding: chunked 表示输出的内容长度不能确定

数据以一系列分块的形式进行发送。 Content-Length 首部在这种情况下不被发送。在每一个分块的开头需要添加当前分块的长度，以十六进制的形式表示，后面紧跟着 '\r\n' ，之后是分块本身，后面也是'\r\n' 。终止块是一个常规的分块，不同之处在于其长度为0。终止块后面是一个挂载（trailer），由一系列（或者为空）的实体消息首部构成。


待补充  
【参考资料】  
[tokenization](https://html.spec.whatwg.org/multipage/parsing.html#tokenization)  
[Transfer-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Transfer-Encoding)  
[HTTP 协议中的 Transfer-Encoding](https://blog.csdn.net/u014569188/article/details/78912469)  

[从有限状态机的角度去理解KMP](https://www.cnblogs.com/courtier/p/4273193.html)
