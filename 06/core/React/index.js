import { performWorkOfUnit, updateProps } from "./workOfUnit";
import { createElement } from "./createElement";

let nextWorkOfUnit = null;
function workLoop(deadline) {
  let shouldYield = false;
  while (!shouldYield && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);
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
/**
 * ## 提交根节点
 */
function commitRoot() {
  console.log("开始更新");
  commitWork(wipRoot.child);
  currentRoot = wipRoot;
  console.log("更新完成");
  wipRoot = null;
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
  console.log("update----");
  wipRoot = {
    dom: currentRoot.dom,
    props: currentRoot.props,
    alternate: currentRoot,
  };
  nextWorkOfUnit = wipRoot;
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
