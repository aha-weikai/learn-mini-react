/**@jsx MyReact.createElement */
// 自定义jsx 渲染的名称，定义为MyReact

import ReactDOM from "../core/ReactDOM";
import MyReact from "../core/React";
// const App = React.createElement("div", { id: "app" }, "hello mini-react! ---jsx");

function Count({ num }) {
  return <div>count</div>;
}

const App = (function () {
  return (
    <div id="app">
      hello mini-react! ---jsx
      <Count num={10}></Count>
    </div>
  );
})();
console.log(App);
// ƒ () {
//   return /* @__PURE__ */ MyReact.createElement("div", { id: "app" }, "hello mini-react! ---jsx");
// }

ReactDOM.createRoot(document.getElementById("root")).render(App);
