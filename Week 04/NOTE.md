## HASH树 && 字典树

(详解HashTree哈希树)[https://blog.csdn.net/yang_yulei/article/details/46337405]  
(Trie树:应用于统计和排序)[http://blog.csdn.net/hguisu/article/details/8131559]

#### HASH树
【质数分辨定理】  
简单地说就是：n个不同的质数可以“分辨”的连续整数的个数和他们的乘积相等。“分辨”就是指这些连续的整数不可能有完全相同的余数序列。

例如：  
从2起的连续质数，连续10个质数就可以分辨大约M(10) =2*3*5*7*11*13*17*19*23*29= 6464693230 个数，已经超过计算机中常用整数（32bit）的表达范围。连续100个质数就可以分辨大约M(100) = 4.711930 乘以10的219次方。
#### 字典树
字典树（Trie）可以保存一些字符串->值的对应关系。基本上，它跟 Java 的 HashMap 功能相同，都是 key-value 映射，只不过 Trie 的 key 只能是字符串。  

Trie 的强大之处就在于它的时间复杂度。它的插入和查询时间复杂度都为 O(k) ，其中 k 为 key 的长度，与 Trie 中保存了多少个元素无关。Hash 表号称是 O(1) 的，但在计算 hash 的时候就肯定会是 O(k) ，而且还有碰撞之类的问题；Trie 的缺点是空间消耗很高。  

Trie树，又称单词查找树或键树，是一种树形结构，是一种**哈希树**的变种。典型应用是用于统计和排序大量的字符串（但不仅限于字符串），所以经常被搜索引擎系统用于文本词频统计。它的优点是：最大限度地减少无谓的字符串比较，查询效率比哈希表高。  

Trie的核心思想是**空间换时间**。利用字符串的**公共前缀**来降低查询时间的开销以达到提高效率的目的。  

## KMP算法
(KMP)[https://www.cnblogs.com/zhangtianq/p/5839909.html]
KMP算法的核心，是一个被称为部分匹配表(Partial Match Table)的数组  
对于字符串“abababca”，它的PMT如下表所示：
<img src="https://pic1.zhimg.com/50/v2-e905ece7e7d8be90afc62fe9595a9b0f_hd.jpg?source=1940ef5c" data-caption="" data-size="normal" data-rawwidth="796" data-rawheight="299" class="origin_image zh-lightbox-thumb" width="796" data-original="https://pic3.zhimg.com/v2-e905ece7e7d8be90afc62fe9595a9b0f_r.jpg?source=1940ef5c"/>

我先解释一下字符串的前缀和后缀。如果字符串A和B，存在A=BS，其中S是任意的非空字符串，那就称B为A的前缀。例如，”Harry”的前缀包括{”H”, ”Ha”, ”Har”, ”Harr”}，我们把所有前缀组成的集合，称为字符串的前缀集合。同样可以定义后缀A=SB， 其中S是任意的非空字符串，那就称B为A的后缀，例如，”Potter”的后缀包括{”otter”, ”tter”, ”ter”, ”er”, ”r”}，然后把所有后缀组成的集合，称为字符串的后缀集合。要注意的是，字符串本身并不是自己的后缀。

有了这个定义，就可以说明PMT中的值的意义了。PMT中的值是字符串的前缀集合与后缀集合的交集中最长元素的长度。例如，对于”aba”，它的前缀集合为{”a”, ”ab”}，后缀 集合为{”ba”, ”a”}。两个集合的交集为{”a”}，那么长度最长的元素就是字符串”a”了，长 度为1，所以对于”aba”而言，它在PMT表中对应的值就是1。再比如，对于字符串”ababa”，它的前缀集合为{”a”, ”ab”, ”aba”, ”abab”}，它的后缀集合为{”baba”, ”aba”, ”ba”, ”a”}， 两个集合的交集为{”a”, ”aba”}，其中最长的元素为”aba”，长度为3。

## Wildcard Matching

