import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

console.log(App);
const Foo = <div>foo</div>;
console.log(Foo);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

