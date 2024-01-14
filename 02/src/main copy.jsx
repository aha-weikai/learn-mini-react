import ReactDOM from "../core/ReactDOM";

// const App = React.createElement("div", { id: "app" }, "hello mini-react! ---jsx");

const App = (function () {
  // 在viteconfig 进行配置
  // 没有显式导入react，div会飘红，但是仍能运行
  return <div id="app">hello mini-react! ---jsx</div>;
})();
console.log(App);
// ƒ () {
//   return /* @__PURE__ */ React.createElement("div", { id: "app" }, "hello mini-react! ---jsx");
// }

ReactDOM.createRoot(document.getElementById("root")).render(App);
