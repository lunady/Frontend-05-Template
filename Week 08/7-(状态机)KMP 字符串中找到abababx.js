// 状态机 找字符 abcabx

let table = []; // KMP查询表
let pattern = [];
let j = 0;

function match(source, p) {
  pattern = p;
  table = buildTable(pattern)
  // 状态机
  let state = start;
  for (let i = 0; i < source.length; i++) {
    console.log(i, source[i]);
    // debugger;
    state = state(i, source[i])
  }
  return state === end;
}

// 构建KMP 查询table
function buildTable(pattern) {
  let table = new Array(pattern.length).fill(0);
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
  return table;
}

function start(i, val) {
  if (val === pattern[0]) {
    j++;
    return next;
  }
  return start;
}

function end() {
  return end;
}

function next(i, val) {
  if (val === pattern[j]) {
    j++;
    if (j === pattern.length) {
      console.log(`在查询到${i}时匹配到`);
      return end;
    }
    return next;
  } else if (j > 0) {
    j = table[j]
    return next(i, val)
  } else {
    return start
  }
}

console.log(match("abaabcabcabdass", "abcabd"));
// console.log(match("ababababababcabababababaabababx123"));
