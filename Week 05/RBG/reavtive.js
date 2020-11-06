let callbacks = new Map();
let reactivies = new Map();
let usedReactivies = [];

let object = {
  r: 1,
  g: 1,
  b: 1,
  a: {
    d: 1
  },
  c: 3
};
let po = reactive(object);

// effect(() => {
  // console.log("effect po.a.d=", po.a.d);
  // console.log("effect po.b=", po.b);
// })

effect(()=>{
  // console.log("r change", r);
  document.getElementById("r").value = po.r;
});
effect(()=>{
  document.getElementById("g").value = po.g;
});
effect(()=>{
  document.getElementById("b").value = po.b;
});
effect(()=>{
  document.getElementById("color").style.backgroundColor = `rgb(${po.r},${po.g},${po.b})`
});



document.getElementById("r").addEventListener("input", e => po.r = e.target.value);
document.getElementById("g").addEventListener("input", e => po.g = e.target.value);
document.getElementById("b").addEventListener("input", e => po.b = e.target.value);

function effect(cb) {
  usedReactivies = [];
  cb();

  for (let reactivie of usedReactivies) {
    if (!callbacks.has(reactivie[0])) {
      callbacks.set(reactivie[0], new Map())
    }
    if (!callbacks.get(reactivie[0]).has(reactivie[1])) {
      callbacks.get(reactivie[0]).set(reactivie[1], [])
    }
    callbacks.get(reactivie[0]).get(reactivie[1]).push(cb)
  }
}

function reactive(object) {
  if (reactivies.has(object)) {
    return reactivies.get(object);
  }
  let proxy = new Proxy(object, {
    set(obj, prop, val) {
      obj[prop] = val;
      if (callbacks.get(obj)) {
        if (callbacks.get(obj).get(prop)) {
          for (let cb of callbacks.get(obj).get(prop)) {
            cb();
          }
        }
      }
      return obj[prop]
    },
    get(obj, prop, val) {
      // debugger;
      usedReactivies.push([obj, prop])
      if (typeof obj[prop] === "object") {
        return reactive(obj[prop])
      }
      return obj[prop]
    }
  })
  console.warn(object, proxy);
  reactivies.set(object, proxy)
  return proxy;
}




