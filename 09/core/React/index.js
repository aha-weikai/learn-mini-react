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
// let currentRoot = null;
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
  commitEffectHooks();
  // currentRoot = wipRoot;
  wipRoot = null;
  deletions = [];
}

function commitEffectHooks() {
  function run(fiber) {
    if (!fiber) return;

    if (!fiber.alternate) {
      // init
      fiber.effectHooks?.forEach((hook) => {
        hook.cleanup = hook.callback();
      });
    } else {
      // update

      fiber.effectHooks?.forEach((newHook, index) => {
        if (newHook.deps.length === 0) return;
        const oldEffectHook = fiber.alternate?.effectHooks[index];

        const needUpdate = oldEffectHook?.deps.some((oldDep, i) => {
          return oldDep !== newHook.deps[i];
        });
        needUpdate && (newHook.cleanup = newHook.callback());
      });
    }

    run(fiber.child);
    run(fiber.sibling);
  }

  function runCleanup(fiber) {
    if (!fiber) return;
    fiber.alternate?.effectHooks?.forEach((hook) => {
      if (hook.deps.length === 0) return;
      hook.cleanup && hook.cleanup();
    });

    runCleanup(fiber.child);
    runCleanup(fiber.sibling);
  }
  runCleanup(wipFiber);
  run(wipFiber);
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
      ...currentFiber,
      alternate: currentFiber,
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

let stateHooks = [];
let stateHookIndex = 0;
export function initStateHooks() {
  stateHooks = [];
  stateHookIndex = 0;
}
function useState(initial) {
  let currentFiber = wipFiber;
  const oldHook = currentFiber.alternate?.stateHooks[stateHookIndex];

  const stateHook = {
    state: oldHook ? oldHook.state : initial,
    queue: oldHook ? oldHook.queue : [],
  };

  stateHook.queue.forEach((action) => {
    stateHook.state = action(stateHook.state);
  });
  stateHook.queue = [];

  stateHookIndex++;
  stateHooks.push(stateHook);
  currentFiber.stateHooks = stateHooks;

  function setState(action) {
    const eagerState =
      typeof action === "function" ? action(stateHook.state) : action;
    if (eagerState === stateHook.state) return;

    stateHook.queue.push(typeof action === "function" ? action : () => action);

    wipRoot = {
      ...currentFiber,
      alternate: currentFiber,
    };
    nextWorkOfUnit = wipRoot;
  }

  return [stateHook.state, setState];
}

let effectHooks = [];
export function initEffectHooks() {
  effectHooks = [];
}
// 调用时机是在 React 完成对 DOM 的渲染之后，并且在浏览器完成绘制之前
// cleanup 在调用useEffect 之前进行调用，当deps为空的时候，不会调用返回的cleanup
function useEffect(callback, deps) {
  const effectHook = {
    callback,
    deps,
    cleanup: undefined,
  };
  effectHooks.push(effectHook);
  wipFiber.effectHooks = effectHooks;
}

const React = {
  createElement,
  render,
  update,
  useState,
  useEffect,
};

export default React;
