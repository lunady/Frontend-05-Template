function layout(element) {
  if (!element.computedStyle) {
    return;
  }
  var elementStyle = getStyle(element);
  if (elementStyle.display !== 'flex') {
    return;
  }
  // console.log("elementStyle---", elementStyle);
  var items = element.children.filter(e => e.type === 'element');
  items.sort((a, b) => {
    return (a.order || 0) - (b.order || 0)
  })
  var style = elementStyle;
  ['width', 'height'].forEach(size => {
    if (style[size] === 'auto' || style[size] === '') {
      style[size] = null
    }
  })

  // 设置默认值
  if (!style.flexDirection || style.flexDirection === 'auto') {
    style.flexDirection = 'row';
  }
  if (!style.alignItems || style.alignItems === 'auto') {
    style.alignItems = 'stretch'
  }
  if (!style.justifyContent || style.justifyContent === 'auto') {
    style.justifyContent = 'flex-start'
  }
  if (!style.flexWrap || style.flexWrap === 'auto') {
    style.flexWrap = 'nowrap'
  }
  if (!style.alignContent || style.alignContent === 'auto') {
    style.alignContent = 'stretch'
  }

  var mainSize, mainStart, mainEnd, mainSign, mainBase,
    crossSize, crossStart, crossEnd, crossSign, crossBase;
  if (style.flexDirection === 'row') {
    mainSize = 'width'; // 主轴尺寸
    mainStart = 'left';
    mainEnd = 'right';
    mainSign = +1;// 正一负一
    mainBase = 0;

    crossSize = 'height';
    crossStart = 'top';
    crossEnd = 'bottom';
  }
  // 方向为相反的顺序
  if (style.flexDirection === 'row-reverse') {
    mainSize = 'width';
    // 互换
    mainStart = 'right';
    mainEnd = 'left';
    mainSign = -1;
    mainBase = style.width;

    crossSize = 'height';
    crossStart = 'top';
    crossEnd = 'bottom';
  }
  // 主轴纵向
  if (style.flexDirection === 'column') {
    mainSize = 'height';
    mainStart = 'top';
    mainEnd = 'bottom';
    mainSign = +1;
    mainBase = 0;
    crossSize = 'width';
    crossStart = 'left';
    crossEnd = 'right';
  }
  if (style.flexDirection === 'column-reverse') {
    mainSize = 'height';
    mainStart = 'bottom';
    mainEnd = 'top';
    mainSign = -1;
    mainBase = style.height;
    crossSize = 'width';
    crossStart = 'left';
    crossEnd = 'right';
  }

  // 规定灵活的项目在必要的时候拆行或拆列，但是以相反的顺序
  // 交叉轴只受 wrap-reverse 影响
  if (style.flexDirection === 'wrap-reverse') {
    var tmp = crossStart;
    crossStart = crossEnd;
    crossEnd = tmp;
    crossSign = -1;
  } else {
    crossSign = +1;
    crossBase = 0;
  }

  var isAutoMainSize = false
  // 自动计算宽，所有子元素收进一行
  if (!style[mainSize]) {
    elementStyle[mainSize] = 0;
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      const itemStyle = getStyle(item);
      // console.log("item：", itemStyle[mainSize]);
      if (itemStyle[mainSize] !== null || itemStyle[mainSize] !== (void 0)) {
        elementStyle[mainSize] = elementStyle[mainSize] + itemStyle[mainSize];
      }
    }
    isAutoMainSize = true;
  }

  var flexLine = [];
  var flexLines = [flexLine];

  // 剩余空间
  var mainSpace = elementStyle[mainSize]; // 主轴剩余空间
  var crossSpace = 0; // 交叉轴剩余空间

  for (var i = 0; i < items.length; i++) {
    var item = items[i]
    var itemStyle = getStyle(item);
    if (itemStyle[mainSize] === null) {
      itemStyle[mainSize] = 0
    }
    // 有flex属性，一定可以伸缩
    if (itemStyle.flex) {
      flexLine.push(item)
    } else if (style.flexWrap === 'nowrap' && isAutoMainSize === true) {
      // 不换行
      mainSpace -= itemStyle[mainSize];
      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
      }
      flexLine.push(item);
    } else {
      // 换行
      if (itemStyle[mainSize] > style[mainSize]) {
        // 比父元素主轴尺寸还大，压缩到一样大
        itemStyle[mainSize] = style[mainSize]
      }
      if (mainSpace < itemStyle[mainSize]) {
        // 剩余空间不足以容纳一个元素
        // TODO: 这里有疑问
        flexLine.mainSpace = mainSpace;
        flexLine.crossSpace = crossSpace;
        // 创建新行
        flexLine = [item];
        console.log("被pushflexLine--1--->",flexLine);
        flexLines.push(flexLine);
        mainSpace = style[mainSize];
        crossSpace = 0;
      } else {
        // 剩余空间 可以容纳一个元素
        console.log("被pushflexLine--2--->",flexLine);
        flexLines.push(item)
      }
      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
      }
      mainSpace -= itemStyle[mainSize];
    }
  }
  // 最后一行
  flexLine.mainSpace = mainSpace;
  /*
  * 计算主轴方向：
  *   找出所有Flex元素
  *   把主轴方向的剩余尺寸按比例分配给这些元素
  *   若剩余空间为负数，所有flex元素为0，等比例压缩剩余元素
  * */
  if (style.flexWrap === 'nowrap' || isAutoMainSize) {
    flexLine.crossSpace = (style[crossSize] !== (void 0)) ? style[crossSize] : crossSpace;
  } else {
    flexLine.crossSpace = crossSpace;
  }
  // console.log(items);
  console.log("mainSpace:", mainSpace);
  if (mainSpace < 0) {
    // 只会发生在单行
    // 若剩余空间为负数，所有flex元素为0，等比例压缩剩余元素

    const scale = style[mainSize] / (style[mainSize] - mainSpace);
    var currentMain = mainBase;
    for (var i = 0; i < items.length; i++) {
      const item = items[i];
      const itemStyle = getStyle(item);
      if (itemStyle.flex) {
        itemStyle[mainSize] = 0;
      }
      itemStyle[mainSize] = itemStyle[mainSize] * scale;
      itemStyle[mainStart] = currentMain;
      itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
      currentMain = itemStyle[mainEnd];
    }
  } else {
    // 多行
    flexLines.forEach(function (items) {
      var mainSpace = items.mainSpace;
      var flexTotal = 0; // flex元素数
      for (var i = 0; i < items.length; i++) {
        const item = items[i];
        const itemStyle = getStyle(item);

        if ((itemStyle.flex !== null) && (itemStyle.flex !== (void 0))) {
          flexTotal += itemStyle.flex;
          continue;
        }
      }
      console.log("flexTotal：", flexTotal);
      if (flexTotal > 0) {
        var currentMain = mainBase;
        for (var i = 0; i < items.length; i++) {
          const item = items[i];
          const itemStyle = getStyle(item);

          if (itemStyle.flex) {
            itemStyle.flex = (mainSpace / flexTotal) * itemStyle.flex;
          }
          itemStyle[mainStart] = currentMain;
          itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
          currentMain = itemStyle[mainEnd];
        }
      }else {
        /*
        没有flex元素，需要使用justify-content
        justify-content 用于设置或检索弹性盒子元素在主轴方向上的对齐方式。
        https://www.runoob.com/cssref/css3-pr-justify-content.html
        */
        if (style.justifyContent === 'flex-start') {
          var currentMain = mainBase;
          var step = 0;
        }
        if (style.justifyContent === 'flex-end') {
          var currentMain = mainBase + mainSpace * mainSign;
          var step = 0;
        }
        if (style.justifyContent === 'center') {
          var currentMain = mainBase + mainSpace / 2 * mainSign;
          var step = 0;
        }
        if (style.justifyContent === 'space-between') {
          var currentMain = mainBase;
          var step = mainSpace / (items.length - 1) * mainSign;
        }
        if (style.justifyContent === 'space-around') {
          var step = mainSpace / items.length * mainSign;
          var currentMain = mainBase + step / 2;
        }

        for (var i = 0; i < items.length; i++) {
          const item = items[i];
          const itemStyle = getStyle(item);
          itemStyle[mainStart] = currentMain;
          itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
          currentMain = itemStyle[mainEnd] + step;
          // console.log(mainStart, mainEnd);
          // console.log(itemStyle);
        }
      }
    })
  }


  // compute the cross axis sizes
  // align-items, align-self
  var crossSpace; // 交叉轴剩余空间
  if (!style[crossSize]) { // auto sizing
    crossSpace = 0;
    elementStyle[crossSize] = 0;
    for (var i = 0; i < flexLines.length; i++) {
      elementStyle[crossSize] = elementStyle[crossSize] + flexLines[i].crossSpace;
    }
  } else {
    crossSpace = style[crossSize];
    console.log(flexLines.length);
    for (var i = 0; i < flexLines.length; i++) {
      crossSpace -= flexLines[i].crossSpace;
      console.log("flexLine crossSpace:", flexLines[i].crossSpace);
    }
  }
  console.log("--------");
  console.log("crossSpace: ", crossSpace);
  if (style.flexWrap === 'wrap-reverse') {
    crossBase = style[crossSize];
  } else {
    crossBase = 0;
  }
  var lineSize = style[crossSize] / flexLines.length;
  var step;
  if (style.alignContent === 'flex-start') {
    crossBase = 0;
    step = 0;
  }
  if (style.alignContent === 'flex-end') {
    crossBase += crossSign * crossSpace;
    step = 0;
  }
  if (style.alignContent === 'center') {
    crossBase += crossSign * crossSpace / 2;
    step = 0;
  }
  if (style.alignContent === 'space-between') {
    crossBase = 0;
    step = crossSpace / (flexLines.length - 1);
  }
  if (style.alignContent === 'space-around') {
    step = crossSpace / flexLines.length;
    crossBase += crossSign * step / 2;
  }
  if (style.alignContent === 'stretch') {
    crossBase = 0;
    step = 0;
  }
  flexLines.forEach(function (items) {
    let lineCrossSize = style.alignContent === 'stretch' ?
      items.crossSpace + crossSpace / flexLines.length :
      items.crossSpace;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const itemStyle = getStyle(item);
      const align = itemStyle.alignSelf || style.alignItems;
      if (itemStyle[crossSize] === null) {
        itemStyle[crossSize] = align === 'stretch' ? lineCrossSize : 0;
      }
      if (align === 'flex-start') {
        itemStyle[crossStart] = crossBase;
        itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
      }
      if (align === 'flex-end') {
        itemStyle[crossStart] = crossBase + crossSign * lineCrossSize;
        itemStyle[crossEnd] = itemStyle[crossStart] + itemStyle[crossEnd] - crossSign * itemStyle[crossSize];
      }
      if (align === 'center') {
        itemStyle[crossStart] = crossBase + crossSign * (lineCrossSize - itemStyle[crossSize]) / 2;
        itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
      }
      if (align === 'stretch') {
        itemStyle[crossStart] = itemStyle[crossBase];
        itemStyle[crossEnd] = itemStyle[crossBase] + crossSign * ((itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) ?
          itemStyle[crossSize] : lineCrossSize);

        itemStyle[crossSize] = crossSign * (itemStyle[crossEnd] - itemStyle[crossStart]);
      }
    }
    crossBase += crossSign * (lineCrossSize + step);
  })
  // console.log(items);
  return items;
}

function getStyle(element) {
  if (!element.style) {
    element.style = {}
  }
  for (var prop in element.computedStyle) {
    // console.log(1,prop,element.computedStyle[prop].value);
    element.style[prop] = element.computedStyle[prop].value;
    if (element.style[prop].toString().match(/px$/) || element.style[prop].toString().match(/^[0-9\.]+$/)) {
      element.style[prop] = parseInt(element.style[prop]);
    }
    // console.log(2,prop, element.style[prop]);
  }
  return element.style
}

module.exports = layout;
