export function performWorkOfUnit(fiber) {
  // 1. 创建dom
  const isFunctionComponent = typeof fiber.type === "function";
  if (!isFunctionComponent) {
    updateHostComponent(fiber);
  } else {
    // 如果直接updateHostComponent(fiber.type(fiber.props))
    // 会导致，updateHostComponent 接收的参数(fiber)成为一个独立的节点，无法连接到fiber树形结构中
    updateFunctionComponent(fiber);
  }
  // 4. 返回下一个要执行的任务
  if (fiber.child) {
    return fiber.child;
  }

  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling;
    nextFiber = nextFiber.parent;
  }
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type));
    // 2. 处理props
    updateProps(dom, fiber.props);
  }
  // 3. 将vdom转换成链表，设置好指针
  const children = fiber.props.children;
  initChildren(fiber, children);
}

function updateFunctionComponent(fiber) {
  // 1. 调用函数式组件，返回一个vnode
  const children = [fiber.type(fiber.props)];
  initChildren(fiber, children);
}

function createDom(type) {
  return type === "TEXT_ELEMENT"
    ? document.createTextNode("")
    : document.createElement(type);
}

function updateProps(dom, props) {
  Object.keys(props).forEach((key) => {
    if (key !== "children") {
      dom[key] = props[key];
    }
  });
}

function initChildren(fiber, children) {
  let prevChild = null;
  children.forEach((child, index) => {
    const newFiber = {
      type: child.type,
      props: child.props,
      child: null,
      parent: fiber,
      sibling: null,
      dom: null,
    };

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevChild.sibling = newFiber;
    }
    prevChild = newFiber;
  });
}
