// 状态机 找字符 abcabx
function match(string) {
  let state = start;
  for (let s of string) {
    state = state(s)
  }
  return state === end;
}

function start(s) {
  if (s === 'a') {
    return foundA;
  }
  return start;
}

function foundA(s) {
  if (s === 'b') {
    return foundB;
  }
  return start(s);
}

function foundB(s) {
  if (s === 'a') {
    return foundA2;
  }
  return start(s);
}

function foundA2(s) {
  if (s === 'b') {
    return foundB2;
  }
  return start(s);
}

function foundB2(s) {
  if (s === 'a') {
    return foundA3;
  }
  return start(s);
}

function foundA3(s) {
  if (s === 'b') {
    return foundB3;
  }
  return start(s);
}

function foundB3(s) {
  console.log(s);
  if (s === 'x') {
    return end;
  } else if (s === 'a') {
    return foundB2(s) // 返回上一次出现ba的情况
  }
  return start(s);
}

function end() {
  return end
}

console.log(match("7-(状态机)字符串中找到abababx.js"));
console.log(match("ababababababcabababababaabababx123"));
