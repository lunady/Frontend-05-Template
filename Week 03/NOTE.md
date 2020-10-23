### BNF和EBNF的含义及其用法

[BNF和EBNF的含义及其用法](https://blog.csdn.net/bensnake/article/details/39368625)  
[语法分析算法LR(1)基础教程](https://blog.csdn.net/u014287775/article/details/56014810)  
[原文](https://www.garshol.priv.no/download/text/bnf.html)  

BNF类似一种数学游戏：从一个符号开始（叫做起始标志，实例中常用S表示），然后给出替换前面符号的规则。BNF语法定义的语言只不过是一个字符串集合，你可以按照下述规则书写，这些规则叫做书写规范（生产式规则），形式如下：  
```
symbol := alternative1 | alternative2 ...   
```
每条规则申明:=左侧的符号必须被右侧的某一个可选项代替。替换项用“|”分割（有时用“::=”替换“:=”，但意思是一样的）。替换项通常有两个符号和终结符构成。之所以叫做终结符是因为没有针对他们的书写规范，他们是书写过程的终止（符号通常被叫做非终止符，也有人叫非终端）。 

BNF语法的另一个变化是把终止符（终端）放在引号中，把他们与符号区别开来。有些BNF语法用符号明确地标明允许使用空格的地方，而有的语法则把它留给读者推测。  
BNF中有一个特殊符号“@”，表示符号可以去掉。如果用@替换符号，只需要将符号去掉。这非常有用，因为如果不利用这个技巧，有时很难终止替换过程。

因此，一个语法描述的语言就是用书写规则（生产式规则）写的字符串的集合。如果一个字符串无法用这些规则写出，那么，该字符串在这个语言中就被禁用。  

### LL算法与LR算法  
LL解析和LR解析之间的区别在于LL解析器从起始符号开始并尝试应用产生来到达目标字符串，而LR解析器从目标字符串开始并尝试在开始时返回 符号。  
LL解析是从左到右，最左边的推导。 也就是说，我们从左到右考虑输入符号并尝试构造最左边的推导。 这是通过从起始符号开始并反复展开最左边的非终结符直到我们到达目标字符串来完成的。 LR解析是从左到右，最右边的推导，意味着我们从左到右扫描并尝试构造最右边的推导。 解析器不断选择输入的子串并尝试将其反转回非终结符号。  
[参考资料](https://www.itranslater.com/qa/details/2121693460326515712)


### 表示LL四则运算
```
TokenNumber: · 1 2 3 4 5 6 7 8 9 0 
Operator: + - * / 
Whitespace: <SP>  
LineTerminator: <LF><CR>  
```

```
<Expression>::=  
<AdditiveExpression><EOF>

<AdditiveExpression>::=  
<MultiplicativeExpression>  
|<AdditiveExpression><+><MultiplicativeExpression>  
|<AdditiveExpression><-><MultiplicativeExpression>  

<MultiplicativeExpression>::=  
<Number>  
|<MultiplicativeExpression><*><Number>  
|<MultiplicativeExpression></><Number> 
```

参考资料  
[编译原理之美](https://time.geekbang.org/column/article/138385)
