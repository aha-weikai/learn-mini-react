// 创建的是vdom，并没有创建dom节点
/**
 * ## 创建vnode,(element)
 * @param {string} type
 * @param {object} props
 * @param  {...any} children
 * @returns
 */
export function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        const isTextNode =
          typeof child === "string" || typeof child === "number";
        return isTextNode ? createTextNode(child) : child;
      }),
    },
  };
}

/**
 * ## 创建vnode, (TextNode)
 * @param {string} text
 * @returns
 */
export function createTextNode(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}
