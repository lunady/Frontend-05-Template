// 状态机 找字符abcdw
function match(string) {
  let state = start;
  for(let s of string) {
    state = state(s)
  }
  return state === end
}

function start(s) {
  if(s === 'a'){
    return foundB;
  }
  return start(s);
}

function foundB(s) {
  if(s === 'b'){
    return foundC;
  }
  return start(s);
}

function foundC(s) {
  if(s === 'c'){
    return foundD;
  }
  return start(s);
}

function foundD(s) {
  if(s === 'd'){
    return foundE;
  }
  return start(s);
}

function foundE(s) {
  if(s === 'e'){
    return end;
  }
  return start(s);
}

function end() {
  return end
}

console.log(match("ababcde12"));
