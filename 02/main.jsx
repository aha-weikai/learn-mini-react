import React from "./core/React";
import ReactDOM from "./core/ReactDOM";
console.log("---");

const App = React.createElement("div", { id: "app" }, "hello mini-react! ---jsx");
console.log(App);
ReactDOM.createRoot(document.getElementById("root")).render(App);
