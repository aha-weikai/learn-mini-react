// 引入vdom的概念，动态生成vdom，dom渲染写死
// const jsDom = {
//   type: "div",
//   props: {
//     children: [],
//     id: "app",
//   },
// };

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children,
    },
  };
}

function createTextNode(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      children: [],
      nodeValue: text,
    },
  };
}

const text = createTextNode("hello,mini-react! ---main1");
const app = createElement("div", { id: "app" }, text);

const container = document.getElementById("root");
const App = document.createElement(app.type);
App.id = app.props.id;

const Text = document.createTextNode(text.props.nodeValue);

App.appendChild(Text);
container.appendChild(App);
