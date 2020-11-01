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
    let reg = new RegExp(subPattern.replace(/\?/g, "[\\s\\S]"), "g");
    reg.lastIndex = lastIndex;
    if(!reg.exec(source))
      return false;
    lastIndex = reg.lastIndex;
  }


  // 匹配尾部
  for (let j = 0; j <= source.length - lastIndex && pattern[pattern.length - j] !== "*"; j++) {
    if (pattern[pattern.length - j] !== source[source.length - j] && pattern[pattern.length - 1] !== "?") {
      return false;
    }
  }
  return true;
}

console.log(find("abcabcabxaac", "a*b*bx*c"));;
