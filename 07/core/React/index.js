import { performWorkOfUnit, updateProps } from "./workOfUnit";
import { createElement } from "./createElement";

let nextWorkOfUnit = null;
function workLoop(deadline) {
  let shouldYield = false;
  while (!shouldYield && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);

    if (wipRoot?.sibling?.type === nextWorkOfUnit?.type) {
      nextWorkOfUnit = undefined;
    }

    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!nextWorkOfUnit && wipRoot) {
    commitRoot();
  }
  requestIdleCallback(workLoop);
}
requestIdleCallback(workLoop);

// work in progress
let wipRoot = null;
let currentRoot = null;
let deletions = [];
let wipFiber = null;
export function setWipFiber(fiber) {
  wipFiber = fiber;
}

export function pushDeletion(fiber) {
  deletions.push(fiber);
}

/**
 * ## 提交根节点
 */
function commitRoot() {
  deletions.forEach(commitDeletion);
  commitWork(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
  deletions = [];
}

function commitDeletion(fiber) {
  if (fiber.dom) {
    let fiberParent = fiber.parent;
    console.log(fiberParent);
    while (!fiberParent.dom) {
      fiberParent = fiberParent.parent;
    }
    fiberParent.dom.removeChild(fiber.dom);
  } else {
    commitDeletion(fiber.child);
  }
}

function commitWork(fiber) {
  if (!fiber) return;
  let fiberParent = fiber.parent;
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent;
  }

  if (fiber.effectTag === "update") {
    updateProps(fiber.dom, fiber.props, fiber.alternate?.props);
  } else if (fiber.effectTag === "placement") {
    if (fiber.dom) fiberParent.dom.appendChild(fiber.dom);
  }
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function update() {
  let currentFiber = wipFiber;
  return () => {
    wipRoot = {
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot,
    };
    nextWorkOfUnit = wipRoot;
  };
}

/**
 * ## 首次渲染函数
 * @param {{type:string,props:object}} elNode
 * @param {Element} container
 */
function render(elNode, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [elNode],
    },
  };
  nextWorkOfUnit = wipRoot;
}

const React = {
  createElement,
  render,
  update,
};

export default React;
