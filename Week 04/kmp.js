function kmp(source, pattern) {
  // 计算table
  let table = new Array(pattern.length).fill(0);
  {
    let i = 1; // 注意自重复开始的位置是 1 ;
    let j = 0; // 已重复字数
    while (i < pattern.length) {
      if (pattern[i] === pattern[j]) {
        ++i;
        ++j;
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

  // 匹配source
  {
    let i = 0;
    let j = 0;
    while (i < source.length) {
      if (source[i] === pattern[j]) {
        ++i;
        ++j;
      } else {
        if (j > 0) {
          j = table[j];
        } else {
          ++i;
        }
      }
      if (j === pattern.length) return true;
    }
    return false;
  }
}

kmp("dddabcabcabcda", "ddab")
