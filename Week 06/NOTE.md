## Number
IEEE754标准 双精度(64位)浮点数

![img](https://img-blog.csdn.net/20170715123840325?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvYWJjZHUx/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

|  名称   | 长度  | 比特位置  |
|  ----  | ----  | ----  |
| 符号位 Sign (S）  | 1bit | b63 |
| 指数部分Exponent（E）| 11bit | b62-b52 |
| 尾数部分Mantissa (M）| 52bit | b51-b0 |

双精度的指数部分（E）采用的偏置码为1023  
求值方法:
```
(-1)^S*(1.M)*2^(E-1023) 
```
注意：双精度数也可用%f格式输出，它的有效位一般为16位，给出小数6位。（这一点在计算金额的时候尤为重要，超过有效位的数字是无意义的，一般会出错。）  

>精度位总共是 53 bit，因为用科学计数法表示，所以首位固定的 1 就没有占用空间。即公式中 (M + 1) 里的 1。另外公式里的 1023 是 2^11 的一半。小于 1023 的用来表示小数，大于 1023 的用来表示整数。指数可以控制到 2^1024 - 1，而精度最大只达到 2^53 - 1，两者相比可以得出 JavaScript 实际可以精确表示的数字其实很少。

#### 举例分析：
double a=1024

(1024)10 = (10000000000)2 = 1*2^10;

以Double在内存中存储：

S=0;

E=(10+1023)10=10000001001;

M=1(省略);

### 精度损失
```javascript
0.1 + 0.2 != 0.3 // true
9999999999999999 == 10000000000000001 // true
```
#### 举例分析：
double a=0.8125  
针对小数部分 0.8125，采用乘 2 取整，顺序排列转为二进制
```
0.8125 * 2 = 1.625  |
0.625 * 2 = 1.25    | 顺序排列
0.25 * 2 = 0.5      |
0.5 * 2 = 1         ↓
```
得小数部分的二进制为 1101    

根据上面的知识将十进制小数 0.1 转为二进制：  
```
0.1 * 2 = 0.2
0.2 * 2 = 0.4 // 注意这里
0.4 * 2 = 0.8
0.8 * 2 = 1.6
0.6 * 2 = 1.2
0.2 * 2 = 0.4 // 注意这里，循环开始
0.4 * 2 = 0.8
0.8 * 2 = 1.6
0.6 * 2 = 1.2
...
```
可以发现有限十进制小数 0.1 却转化成了无限二进制小数 0.00011001100...，可以看到精度在转化过程中丢失了！   
能被转化为有限二进制小数的十进制小数的最后一位必然以 5 结尾(因为只有 0.5 * 2 才能变为整数)。所以十进制中一位小数 0.1 ~ 0.9 当中除了 0.5 之外的值在转化成二进制的过程中都丢失了精度。  

0.1以Double在内存中存储：  
S=0;  
E=(-4 + 1023)10=01111111011;  
M=1001100110011001100110011001100110011001100110011010;    

### JavaScript 的最大安全数是如何来的  
根据双精度浮点数的构成，精度位数是 53 bit。安全数的意思是在 -2^53 ~ 2^53 内的整数(不包括边界)与唯一的双精度浮点数互相对应。举个例子比较好理解：
``` 
Math.pow(2, 53) === Math.pow(2, 53) + 1 // true
```
`Math.pow(2, 53)` 竟然与` Math.pow(2, 53) + 1 `相等！这是因为` Math.pow(2, 53) + 1` 已经超过了尾数的精度限制(53 bit)，在这个例子中` Math.pow(2, 53)` 和 `Math.pow(2, 53) + 1 `对应了同一个双精度浮点数。所以` Math.pow(2, 53)` 就不是安全数了。

最大的安全数为 Math.pow(2, 53) - 1，即 9007199254740991。  


参考资料    

[IEEE754标准 单精度(32位)/双精度(64位)浮点数解码](https://blog.csdn.net/qq_42802219/article/details/96972346)  
[JavaScript 十进制小数转为二进制精度问题及解决方案](http://www.cainiaoxueyuan.com/gcs/6802.html)  
[JavaScript 浮点数陷阱及解法](https://github.com/camsong/blog/issues/9)  
[What Every Computer Scientist Should Know About Floating-Point Arithmetic](https://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html) 


---

## String
①Unicode其实应该是一个码值表。（百度百科：Unicode的功用是为每一个字符提供一个唯一的代码（即一组数字））。

②UTF-8/UTF-16/UTF-32是通过对Unicode码值进行对应规则转换后，编码保持到内存/文件中。UTF-8/UTF-16/UTF-32都是可变长度的编码方式。（后面将进行Unicode码值转换为UTF-8的说明）。

③我们平常说的 “Unicode编码是2个字节” 这句话，其实是因为windows默认的Unicode编码就是UTF-16，在常用基本字符上2个字节的编码方式已经够用导致的误解，其实是可变长度的。

在没有特殊说明的情况下，常说的Unicode编码可以理解为UTF-16编码。

④UTF-32是因为UTF-16编码方式不能表示全部的字符而扩充的编码方式。

ps：显示的字符是表现形式，具体内存中的编码方式和字符显示之间通过中间层进行转换。（根据编码规则，1个字符可能对应内存中1个到几个字节。）

### UTF-8编码
①UTF编码方式，按照规则转换后，第1个字节仍与ASCII兼容，这使得原来处理ASCII字符的软件无须或只须做少部分修改，即可继续使用。

网络上数据传输英文字符只需要1个字节，可以节省带宽资源。当前大部分的网络应用都使用UTF-8编码。（中文按照规则会转换为3个字节，反而浪费资源，没办法，规则别人定好了！）

 

②UTF-8编码需要进行字节数转换+补码两个步骤

Unicode码值转UTF-8编码规则之一（字节数转换）

•1个字节：Unicode码为0 - 127
•2个字节：Unicode码为128 - 2047
•3个字节：Unicode码为2048 - 0xFFFF
•4个字节：Unicode码为65536 - 0x1FFFFF
•5个字节：Unicode码为0x200000 - 0x3FFFFFF
•6个字节：Unicode码为0x4000000 - 0x7FFFFFFF

 

Unicode码值转UTF-8编码规则之二（二进制补码）

对应上面规则一字节数转换后，具体的补位码如下,"x"表示空位，用来补位的，补不全则使用0。

•1个字节：0xxxxxxx
•2个字节：110xxxxx 10xxxxxx
•3个字节：1110xxxx 10xxxxxx 10xxxxxx
•4个字节：11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
•5个字节：111110xx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
•6个字节：1111110x 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx

```javascript
function UTF8_Encoding(string) {
  let back = [];
  let byteSize = 0;

  for (let i = 0; i < string.length; i++) {
    let charCode = string[i].charCodeAt(0);
    /*根据大小判断UTF8的长度
    * 1个字节：Unicode码为 0 - 127
    * 2个字节：Unicode码为 128 - 2047
    * 3个字节：Unicode码为 2048 - 0xFFFF
    * 4个字节：Unicode码为 65536 - 0x1FFFFF
    * 5个字节：Unicode码为 0x200000 - 0x3FFFFFF
    * 6个字节：Unicode码为 0x4000000 - 0x7FFFFFFF
    * */
    if (0x00 <= charCode && charCode <= 0x7f) {
      byteSize += 1;
      back.push(charCode);
    } else if (0x80 <= charCode && charCode <= 0x7ff) {
      byteSize += 2;
      /*2字节格式
      * 110xxxxx
      * 10xxxxxx
      *
      * (192)10 = (11000000)2
      * (31)10  = (11111)2
      * (128)10 = (10000000)2
      * (63)10  = (111111)2
      * */
      back.push((192 | (31 & (charCode >> 6))));
      back.push((128 | (63 & charCode)))
    } else if ((0x800 <= charCode && charCode <= 0xd7ff) || (0xe000 <= charCode && charCode <= 0xffff)) {
      byteSize += 3;
      /*3字节格式
      * 1110xxxx
      * 10xxxxxx
      * 10xxxxxx
      *
      * (224)10 = (11100000)2
      * (15)10  = (1111)2
      * (128)10 = (10000000)2
      * (63)10  = (111111)2
      * */
      back.push((224 | (15 & (charCode >> 12))));
      back.push((128 | (63 & (charCode >> 6))));
      back.push((128 | (63 & charCode)))
    }
  }
  for (let i = 0; i < back.length; i++) {
    back[i] &= 0xff;
  }

  return Buffer.from(back)
}
```

## Object
### 对象行为改变对象状态
 
面向对象的三大特性是"封装、"多态"、"继承"，  
五大原则是"单一职责原则"、"开放封闭原则"、"里氏替换原则"、"依赖倒置原则"、"接口分离原则"。

### 数据属性和访问器属性  

[JS数据属性和访问器属性](https://blog.csdn.net/lxiaopfeng/article/details/79811685)

访问器属性不能直接定义，要通过Object.defineProperty()这个方法来定义。


#### special object

双方括号[[]] 代表对象内置行为，在JavaScript无论使用任何方式都无法访问，在调用js引擎的C++/C中可以调用

Native Object: JavaScript语言提供的不依赖于执行宿主的对象，其中一些是内建对象，如：Global、Math；一些是在脚本运行环境中创建来使用的，如：Array、Boolean、Date、Function、Number、Object、RegExp、Error。

Build-in Object: JavaScript语言提供的不依赖于执行宿主的内建对象，如：Global、Math；内建对象都是Native Object。

Host Object: JavaScript语言提供的任何依赖于宿主环境的对象，所有非Native Object的对象都是宿主对象，如：IE中的window，WScript中的wscript实例，任何用户创建的类。


[JavaScript 标准内置对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects)

---
