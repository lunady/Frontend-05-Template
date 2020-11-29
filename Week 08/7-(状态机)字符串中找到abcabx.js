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
  if (s === 'c') {
    return foundC;
  }
  return start(s);
}

function foundC(s) {
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
  if (s === 'x') {
    return end;
  }
  return foundB(s);
}

function end() {
  return end
}

console.log(match("1212abcabx"));
