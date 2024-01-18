import { pushDeletion, setWipFiber } from "./index";
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
    updateProps(dom, fiber.props, {});
  }
  // 3. 将vdom转换成链表，设置好指针
  const children = fiber.props.children;
  reconcileChildren(fiber, children);
}

function updateFunctionComponent(fiber) {
  setWipFiber(fiber);

  // 1. 调用函数式组件，返回一个vnode
  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}

function createDom(type) {
  return type === "TEXT_ELEMENT"
    ? document.createTextNode("")
    : document.createElement(type);
}

export function updateProps(dom, nextProps, prevProps) {
  // 1. old 有，new 没有，删
  Object.keys(prevProps).forEach((key) => {
    if (key !== "children") {
      if (!(key in nextProps)) {
        dom.removeAttribute(key);
      }
    }
  });
  // 2. old 没有，new 有，添加
  // 3. old 有，new 有，更新

  Object.keys(nextProps).forEach((key) => {
    if (key !== "children") {
      if (key.startsWith("on")) {
        const eventType = key.slice(2).toLowerCase();
        dom.removeEventListener(eventType, prevProps[key]);
        dom.addEventListener(eventType, nextProps[key]);
      } else {
        if (dom) dom[key] = nextProps[key];
      }
    }
  });
}
// 原 initChildren
function reconcileChildren(fiber, children) {
  // diff fiber
  // oldFiberChild 是已经存在的fiber
  // fiber(newFiber)是还在创建的fiber
  // 遍历children，生成新的fiber节点
  let oldFiberChild = fiber.alternate?.child;

  let prevChild = null;
  children.forEach((child, index) => {
    const isSameType = oldFiberChild && oldFiberChild.type === child?.type;
    let newFiber;
    if (isSameType) {
      // update
      newFiber = {
        type: child.type,
        props: child.props,
        child: null,
        parent: fiber,
        sibling: null,
        dom: oldFiberChild.dom,
        effectTag: "update",
        alternate: oldFiberChild,
      };
    } else {
      // create
      if (child) {
        newFiber = {
          type: child.type,
          props: child.props,
          child: null,
          parent: fiber,
          sibling: null,
          dom: null,
          effectTag: "placement", //放置
        };
      }
      // 收集需要删除的旧的节点
      if (oldFiberChild) {
        console.log(oldFiberChild);
        pushDeletion(oldFiberChild);
      }
    }

    if (oldFiberChild) {
      oldFiberChild = oldFiberChild.sibling;
    }

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevChild.sibling = newFiber;
    }

    if (newFiber) {
      prevChild = newFiber;
    }
  });

  while (oldFiberChild) {
    pushDeletion(oldFiberChild);
    oldFiberChild = oldFiberChild.sibling;
  }
}
