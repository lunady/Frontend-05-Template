### 计算主轴方向：  
    找出所有Flex元素  
    把主轴方向的剩余尺寸按比例分配给这些元素  
    若剩余空间为负数，所有flex元素为0，等比例压缩剩余元素  
  
### 计算交叉轴方向  
    根据每一行中最大元素计算行高  
    根据行高flex-align和item-align，确定元素具体位置  
    
### 渲染  
    1.
    绘制需要依赖一个图形环境  
    这里使用npm images包  
    绘制在一个viewpoint上进行  
      
    2.
    递归调用子元素的方式完成dom树绘制  
    忽略一些不需要绘制的节点  
    实际浏览器中，文字绘制是难点，需要依赖字体库，这里忽略  
    实际浏览器中，还会对图层做compositing，这里忽略  


### 【问题】  
hi，助教你好，我看到代码的这部分  
```javascript
if (mainSpace < itemStyle[mainSize]) {
    flexLine.mainSpace = mainSpace;
    flexLine.crossSpace = crossSpace;
    flexLine = [item];
    flexLines.push(flexLine);
    mainSpace = style[mainSize];
    crossSpace = 0;
}

```

flexLine是一个数组，也可以进行 flexLine.mainBase 的赋值吗  
结构变成:  
```javascript
 flexLine=[
 {...},
  mainSpace:0,
  crossSpace:0
]
```
第一次见到这种写法，因为数组原型链继承Object吗
