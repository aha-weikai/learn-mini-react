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
  nextWorkOfUnit = {
    dom: container,
    props: {
      children: [elNode],
    },
  };
}

let nextWorkOfUnit = null;
function workLoop(deadline) {
  // yield : 产生，出产，得出
  let shouldYield = false;
  while (!shouldYield) {
    // 返回当前空闲期间剩余的估计毫秒数
    // 当没有剩余时间，需要进行下个任务调度
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);
    shouldYield = deadline.timeRemaining() < 1;
  }
  // 也就是再次执行这儿
  requestIdleCallback(workLoop);
}

function performWorkOfUnit(work) {
  console.log(work);
  // 1. 创建dom
  if (!work.dom) {
    const dom = (work.dom = work.type === "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(work.type));

    work.parent.dom.appendChild(dom);
    // 2. 处理props
    Object.keys(work.props).forEach(prop => {
      if (prop !== "children") {
        dom[prop] = work.props[prop];
      }
    });
  }
  // 3. 将vdom转换成链表，设置好指针
  const children = work.props.children;
  let prevChild = null;
  children.forEach((child, index) => {
    const newWork = {
      type: child.type,
      props: child.props,
      child: null,
      sibling: null,
      parent: work,
      dom: null,
    };
    if (index === 0) {
      work.child = newWork;
    } else {
      prevChild.sibling = newWork;
    }
    prevChild = newWork;
  });

  // 4. 返回下一个要执行的任务
  if (work.child) {
    return work.child;
  }
  if (work.sibling) {
    return work.sibling;
  }
  return work.parent?.sibling;
}
requestIdleCallback(workLoop);

const React = {
  createElement,
  render,
};

export default React;
