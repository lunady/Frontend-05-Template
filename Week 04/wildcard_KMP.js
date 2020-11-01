// 带问号的kmp
function kmpContainQuestionMark(source, pattern) {
  // debugger;
  let table = new Array(pattern.length).fill(0);
  {
    let i = 1; // 注意自重复开始的位置是 1 ;
    let j = 0; // 已重复字数
    while (i < pattern.length) {
      // 加入问号判断
      if (pattern[i] === pattern[j] || pattern[i] === "?" || pattern[j] === "?") {
        i++;
        j++;
        table[i] = j;
      } else {
        if (j > 0) {
          j = table[j];
        } else {
          ++i;
        }
      }
    }
  }
  console.log(table);

  // 匹配source
  {
    let i = 0;
    let j = 0;
    while (i < source.length) {
      if (source[i] === pattern[j] || pattern[j] === "?") {
        ++i;
        ++j;
      } else {
        if (j > 0) {
          j = table[j];
        } else {
          ++i;
        }
      }
      if (j === pattern.length) {
        // console.warn(source,i,j, source[i]);
        return i;
      }
    }
    return false;
  }
}

function find(source, pattern) {
  // debugger;
  let starCount = 0; // 星号个数
  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i] === "*") {
      starCount++;
    }
  }
  // 边缘case
  if (starCount === 0) {
    for (let i = 0; i < pattern.length; i++) {
      if (pattern[i] !== source[i] && pattern[i] !== "?") {
        return false;
      }
    }
  }
  // 处理第一个星之前
  let i = 0;
  let lastIndex = 0;
  for (i = 0; pattern[i] !== "*"; i++) {
    if (pattern[i] !== source[i] && pattern[i] !== "?") {
      return false;
    }
  }
  lastIndex = i;

  // 循环星号切割的每一段
  for (let p = 0; p < starCount - 1; p++) {
    i++;
    let subPattern = "";
    while (pattern[i] !== "*") {
      subPattern += pattern[i];
      i++;
    }

    let index = kmpContainQuestionMark(source.slice(lastIndex, source.length), subPattern);
    if (index) {
      lastIndex += index;
    } else {
      return false;
    }
  }

  // 匹配尾部
  for (let j = 0; j <= source.length - lastIndex && pattern[pattern.length - j] !== "*"; j++) {
    if (pattern[pattern.length - j] !== source[source.length - j] && pattern[pattern.length - 1] !== "?") {
      return false;
    }
  }
  return true;
}

console.log(find("asasabcabcadfdfbxaac", "a*abc??c*c"));
