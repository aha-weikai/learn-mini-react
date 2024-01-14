/**@jsx MyReact.createElement */
// 自定义jsx 渲染的名称，定义为MyReact

import ReactDOM from "../core/ReactDOM";
import MyReact from "../core/React";
// const App = React.createElement("div", { id: "app" }, "hello mini-react! ---jsx");

const App = (function () {
  return <div id="app">hello mini-react! ---jsx</div>;
})();
console.log(App);
// ƒ () {
//   return /* @__PURE__ */ MyReact.createElement("div", { id: "app" }, "hello mini-react! ---jsx");
// }

ReactDOM.createRoot(document.getElementById("root")).render(App);
