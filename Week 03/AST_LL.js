  let regexp = /([0-9\.]+)|([ \t]+)|([\r\n]+)|(\*)|(\/)|(\+)|(\-)/g;
  let dictionary = ["Number", "Whitespace", "LineTerminator", "*", "/", "+", "-"];

  function* tokenize(source) {
    let res = null;
    let lastIndex = 0;
    while (true) {
      lastIndex = regexp.lastIndex
      res = regexp.exec(source);
      if (!res) break;
      if (regexp.lastIndex - lastIndex > res[0].length) break;

      let token = {
        type: null,
        value: null
      };

      for (let i = 1; i <= dictionary.length; i++) {
        if (res[i]) {
          token.type = dictionary[i - 1]
        }

      }
      token.value = res[0];
      yield token;
    }
    yield {
      type: "EOF"
    }
  }

  let source = [];
  for (let token of tokenize("1024 + 1111 - 11")) {
    if (token.type !== "Whitespace" && token.type !== "LineTerminator")
      source.push(token)
  }

  function Expression(token) {
    console.log(source);
    if (source[0].type === "AdditiveExpression" && source[1] && source[1].type === "EOF") {
      let node = {
        type: "Expression",
        children: [source.shift(),source.shift()]
      }
      source.unshift(node);
      return node
    }
    AdditiveExpression(source)
    return Expression(source)
  }

  function AdditiveExpression(source) {
    // console.log(source);
    if (source[0].type === "MultipleExpression") {
      let node = {
        type: "AdditiveExpression",
        children: [source[0]]
      }
      source[0] = node;
      return AdditiveExpression(source)
    }

    if (source[0].type === "AdditiveExpression" && source[1] && source[1].type === "+") {
      let node = {
        type: "AdditiveExpression",
        operator: "+",
        children: []
      }
      node.children.push(source.shift())
      node.children.push(source.shift())
      // 第三项是 MultipleExpression ，本身也需要产生一次
      MultipleExpression(source)
      node.children.push(source.shift())
      source.unshift(node)
      return AdditiveExpression(source)
    }

    if (source[0].type === "AdditiveExpression" && source[1] && source[1].type === "-") {
      let node = {
        type: "AdditiveExpression",
        operator: "-",
        children: []
      }
      node.children.push(source.shift())
      node.children.push(source.shift())
      // 第三项是 MultipleExpression ，本身也需要产生一次
      MultipleExpression(source)
      node.children.push(source.shift())
      source.unshift(node)
      return AdditiveExpression(source)
    }

    if (source[0].type === "AdditiveExpression") {
      return source[0];
    }
    // 找到不认识的先调一次 MultipleExpression
    // 2 我们也认为是一个 1*2 的乘法
    MultipleExpression(source)
    // 第一次进入会走此分支
    return AdditiveExpression(source)

  }

  function MultipleExpression(source) {
    // console.log(source);
    if (source[0].type === "Number") {
      let node = {
        type: "MultipleExpression",
        children: [source[0]]
      }
      source[0] = node;
      return MultipleExpression(source)
    }

    if (source[0].type === "MultipleExpression" && source[1] && source[1].type === "*") {
      let node = {
        type: "MultipleExpression",
        operator: "*",
        children: []
      }
      node.children.push(source.shift())
      node.children.push(source.shift())
      node.children.push(source.shift())
      source.unshift(node)
      return MultipleExpression(source)
    }

    if (source[0].type === "MultipleExpression" && source[1] && source[1].type === "/") {
      let node = {
        type: "MultipleExpression",
        operator: "/",
        children: []
      }
      node.children.push(source.shift())
      node.children.push(source.shift())
      node.children.push(source.shift())
      source.unshift(node)
      return MultipleExpression(source)
    }
    if (source[0].type === "MultipleExpression") {
      return source[0];
    }

    return MultipleExpression(source);
  }

  // AdditiveExpression(source)
  Expression(source)
