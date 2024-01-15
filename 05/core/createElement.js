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
      children: children.map(child => (typeof child === "string" ? createTextNode(child) : child)),
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
