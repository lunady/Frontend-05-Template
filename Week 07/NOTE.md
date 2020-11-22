Atom
Expression
Statement
Structure
Program / Module



运算优先级：

1.Expression：
    Member  
    a.b  
    a[b]  
    foo\`string\`  
    super.b  
    super['b']  
    new.target  
    new Foo()  
    
    New
    new Foo
    
2.Reference: 在标准中的类型
Object
Key

delete / assign

3. Expression
Call
    foo()  
    super()  
    foo()['b']  
    foo().b  
    foo()\`abc\`  
    
left handside/ right handside

【参考资料】
[运算符优先级](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_Precedence)    


---


## 类型转换

### 装箱与拆箱 boxing && unBoxing
> 每当读取一个基本类型的时候，后台就会创建一个对应的基本包装类型对象，从而让我们能够调用一些方法来操作这些数据。


#### unBoxing
1.ToPrimitive
2.ToString & valueOf
3.Symbol.ToPrimitive

> Object与Boolean、String、Number类型比较，需要先进行toPremitive(obj)，得到的结果，再进行 == 比较。  
ToPrimitive(A)通过尝试依次调用 A 的A.toString() 和 A.valueOf() 方法，将参数 A 转换为原始值（Primitive）。


ex: 加法优先valueOf

#### Boxing
| 类型 | 对象 | 值 |
|  ----  | ----  | ----  |
| Number  | new Number(1) | 1 |
| String  | new String("a") | "a" |
| Boolean  | new Boolean(true) | true |
| Symbol  | new Object(Symbol("a")) | Symbol("a") |



### NumberToString
[NumberToString](https://blog.csdn.net/weixin_33937778/article/details/88768506?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522160603359219724838564499%2522%252C%2522scm%2522%253A%252220140713.130102334.pc%255Fall.%2522%257D&request_id=160603359219724838564499&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~first_rank_v2~rank_v28-4-88768506.pc_search_result_no_baidu_js&utm_term=NumberToString&spm=1018.2118.3001.4449)



### Completion Record
[[type]]  
[[value]]  
[[target]]  

[JavaScript执行运行时 再解（四）](https://www.cnblogs.com/ssaylo/p/13156637.html)


## Realm
【参考资料】
[1](https://jakearchibald.com/2017/arrays-symbols-realms/)   
[2](https://kuaibao.qq.com/s/20181227A17SPM00?refer=spider)   
