// 动态生成vdom，动态渲染dom
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => (typeof child === "string" ? createTextNode(child) : child)),
    },
  };
}

function createTextNode(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

function render(elNode, container) {
  // 渲染节点
  const dom = elNode.type === "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(elNode.type);
  // 添加属性
  Object.keys(elNode.props).forEach(prop => {
    if (prop !== "children") {
      dom[prop] = elNode.props[prop];
    }
  });
  // 递归挂载节点
  elNode.props.children.forEach(child => render(child, dom));

  // 挂载节点
  container.appendChild(dom);
}

const React = {
  createElement,
  render,
};

export default React;
