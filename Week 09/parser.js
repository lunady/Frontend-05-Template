const css = require('css')
const EOF = Symbol("EOF")
let currentToken = null;
let currentAttribute = null;
let currentTextNode = null;
const blankRegex = /^[\t\n\f ]$/ // 空白
let stack = [{type: "document", children: []}]

let rules = [] // css规则
function addCSSRules(text) {
    let ast = css.parse(text)
    // console.log(text)
    // console.log("==================")
    // console.log(JSON.stringify(ast, null, "    "));
    rules.push(...ast.stylesheet.rules)
}

// .a {}
// #a {}
// tag-name {}
function match(element, selector) {
    if (!selector || !element.attributes) {
        return false
    }
    // console.log("==================")
    // console.log(element)
    // console.log("----")
    // console.log("selector = ",selector)
    // console.log("==================")
    if (selector.charAt(0) === '#') {
        let attr = element.attributes.filter(attr => attr.name === 'id')[0]
        if (attr && attr.value === selector.replace('#', '')) {
            return true
        }
    } else if (selector.charAt(0) === '.') {
        let attr = element.attributes.filter(attr => attr.name === 'class')[0]
        if (attr && attr.value === selector.replace('.', '')) {
            return true
        }
    } else if (selector === element.tagName) {
        if (element.tagName === selector) {
            return true
        }
    }
    return false
}

// CSS规则根据specificity和后来优先规则覆盖
// specificity是一个四元组，越左边权重越高
// 一个CSS规则的specificity根据包含的简单选择器相加而成
function specificity(selector) {
    let p = [0, 0, 0, 0]
    let selectorParts = selector.split(" ")
    for (let part of selectorParts) {
        if (part.charAt(0) === '#') {
            p[1] += 1
        } else if (part.charAt(0) === '.') {
            p[2] += 1
        } else {
            p[3] += 1
        }
    }
    return p
}

function compare(sp1, sp2) {
    if (sp1[0] - sp2[0]) {
        return sp1[0] - sp2[0]
    }
    if (sp1[1] - sp2[1]) {
        return sp1[1] - sp2[1]
    }
    if (sp1[2] - sp2[2]) {
        return sp1[2] - sp2[2]
    }
    return sp1[3] - sp2[3]
}

function computeCSS(element) {
    // console.log(element);

    // 获取父元素的序列
    // 标签匹配：从当前元素，开始逐级的从内向外匹配
    let elements = stack.slice().reverse()
    // console.log(elements)
    if (!element.computedStyle) {
        element.computedStyle = {}
    }
    for (let rule of rules) {
        let selectorParts = rule.selectors[0].split(" ").reverse();
        if (!match(element, selectorParts[0])) {
            continue;
        }
        let matched = false;
        // j=当前选择器的位置  i=当前元素位置
        let j = 1;
        for (let i = 0; i < elements.length; i++) {
            if (match(elements[i], selectorParts[j])) {
                j++
            }
        }
        if (j >= selectorParts.length) {
            matched = true
        }
        if (matched) {
            // 匹配到
            let sp = specificity((rule.selectors[0]))
            // console.log(sp)
            // console.log('Element--->', element, "matched rule--->", rule);
            let computedStyle = element.computedStyle;
            for (let declaration of rule.declarations) {
                if (!computedStyle[declaration.property]) {
                    computedStyle[declaration.property] = {}
                }

                if (!computedStyle[declaration.property].specificity) {
                    computedStyle[declaration.property].value = declaration.value
                    computedStyle[declaration.property].specificity = sp

                } else if (compare(computedStyle[declaration.property].specificity) < 0) {
                    computedStyle[declaration.property].value = declaration.value
                    computedStyle[declaration.property].specificity = sp
                }
                computedStyle[declaration.property].value = declaration.value
            }
            // console.log(element.computedStyle)
            // { 'font-size': { value: '30px' } }
        }

    }
}

function emit(token) {
    // debugger;
    let top = stack[stack.length - 1];
    if (token.type === 'startTag') {
        // console.log(token)
        let element = {
            type: 'element',
            children: [],
            attributes: []
        };
        element.tagName = token.tagName;
        for (let p in token) {
            if (p !== "type" && p !== "tagName") {
                element.attributes.push({
                    name: p,
                    value: token[p]
                });
            }
        }

        // 计算CSS 的时机： startTag入栈时计算CSS
        // 创建一个元素后，立即计算CSS
        // 我们假设，分析一个元素的时候所有css已经收集完毕
        // 在真实浏览器中，可以遇到写在body中的style标签，需要重新计算的情况，本次忽略
        computeCSS(element)

        top.children.push(element);
        element.parent = top;
        // element.parent = JSON.parse(JSON.stringify(item));

        if (!token.isSelfClosing) {
            stack.push(element)
        }
        currentTextNode = null
    } else if (token.type === 'endTag') {
        if (top.tagName !== token.tagName) {
            throw new Error("Tag start end doesn't match!!!")
        } else {
            // 实际还有link标签，本次不处理 只考虑style标签和内链css
            if (top.tagName === 'style') {
                addCSSRules(top.children[0].content)
            }
            stack.pop();
        }
        currentTextNode = null;
    } else if (token.type === 'text') {
        // debugger;
        if (currentTextNode == null) {
            currentTextNode = {
                type: 'text',
                content: ''
            }
            top.children.push(currentTextNode)
        }
        currentTextNode.content += token.content;
    }
}


function data(c) {
    if (c === "<") {
        return tagOpen;
    } else if (c === EOF) {
        emit({
            type: "EOF"
        })
        return;
    } else {
        emit({
            type: "text",
            content: c
        })
        return data;
    }
}

function tagOpen(c) {
    if (c === "/") {
        return endTagOpen;
    } else if (c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: "startTag",
            tagName: ""
        }
        return tagName(c)
    } else {
        return;
    }
}

function endTagOpen(c) {
    if (c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: "endTag",
            tagName: ""
        }
        return tagName(c)
    } else if (c === ">") {

    } else if (c === EOF) {

    } else {

    }
}

function tagName(c) {
    if (c.match(blankRegex)) {
        return beforeAttributeName
    } else if (c === '/') {
        return selfCloseingStartTag;
    } else if (c.match(/^[a-zA-Z]$/)) {
        currentToken.tagName += c;
        return tagName;
    } else if (c === '>') {
        emit(currentToken)
        return data;
    } else {
        return tagName;
    }

}

// 匹配自封闭标签
function selfCloseingStartTag() {

}

// <html空格lang="en"
function beforeAttributeName(c) {
    // 遇到空白情况继续读取属性名'
    if (c.match(blankRegex)) {
        return beforeAttributeName
    } else if (c === '/' || c === '>' || c === EOF) {
        return afterAttributeName(c);
    } else if (c === "=") {

    } else {
        currentAttribute = {
            name: "",
            value: ""
        }
        return attributeName(c);
    }
}

function attributeName(c) {
    if (c.match(blankRegex) || c === '/' || c === '>' || c === EOF) {
        return afterAttributeName(c)
    } else if (c === "=") {
        return beforeAttributeValue
    } else if (c === "\u0000") {

    } else if (c === "\"" || c === "'" || c === "<") {

    } else {
        currentAttribute.name += c;
        return attributeName;
    }
}

// eg: "en" | 'en' | en
function beforeAttributeValue(c) {
    // debugger;
    if (c.match(blankRegex) || c === "/" || c === ">" || c === EOF) {
        return beforeAttributeValue
    } else if (c === "\"") {
        return doubleQuotedAttributeValue
    } else if (c === "\'") {
        return singleQuotedAttributeValue
    } else if (c === ">") {
        // return data
    } else {
        return UnQuotedAttributeValue(c)
    }
}

function doubleQuotedAttributeValue(c) {
    // debugger;
    if (c === "\"") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    } else if (c === "\u0000") {

    } else if (c === EOF) {

    } else {
        currentAttribute.value += c;
        return doubleQuotedAttributeValue;
    }
}

function singleQuotedAttributeValue(c) {
    if (c === "\'") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    } else if (c === "\u0000") {

    } else if (c === EOF) {

    } else {
        currentAttribute.value += c;
        return singleQuotedAttributeValue;
    }
}

function UnQuotedAttributeValue(c) {
    if (c.match(blankRegex)) {
        // 当前属性值读取结束
        currentToken[currentAttribute.name] = currentAttribute.value
        return beforeAttributeName
    } else if (c === '/') {
        // 当前闭合标签的所有属性读取结束
        currentToken[currentAttribute.name] = currentAttribute.value
        return selfClosingStartTag
    } else if (c === '>') {
        // 当前标签读取结束
        currentToken[currentAttribute.name] = currentAttribute.value
        emit(currentToken)
        return data
    } else if (c === '\u0000') {

    } else if (c === '"' || c === '\'' || c === '<' || c === '=' || c === '`') {

    } else if (c === EOF) {

    } else {
        currentAttribute.value += c
        return UnQuotedAttributeValue
    }
}

function selfClosingStartTag(c) {
    if (c === '>') {
        currentToken.isSelfClosing = true
        emit(currentToken)
        return data
    } else if (c === EOF) {

    } else {

    }
}

function afterAttributeName(c) {
    if (c.match(blankRegex)) {
        return afterAttributeName(c);
    } else if (c === "/") {
        return selfClosingStartTag;
    } else if (c === "=") {
        return beforeAttributeValue;
    } else if (c === ">") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if (c === EOF) {

    } else {
        currentToken[currentAttribute.name] = currentAttribute.value;
        currentAttribute = {
            name: "",
            value: "",
        }
        return attributeName(c);
    }
}

function afterQuotedAttributeValue(c) {
    if (c.match(blankRegex)) {
        return beforeAttributeName;
    } else if (c === '/') {
        return selfClosingStartTag;
    } else if (c === '>') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if (c === EOF) {

    } else {
        currentAttribute.value += c;
        return doubleQuotedAttributeValue;
    }
}

function parserHTML(html) {
    // console.log(html)
    let state = data;
    for (let c of html) {
        // console.log(c)
        state = state(c)
    }
    state = state(EOF)
    return stack[0];
}

module.exports.parserHTML = parserHTML
// window.parserHTML = parserHTML