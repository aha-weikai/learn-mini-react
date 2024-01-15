import ReactDOM from "../core/ReactDOM";
import React from "../core/React";

// function App() {
//   return <div id="app">hello mini-react! ---jsx</div>;
// }

function Counter() {
  return <div>count</div>;
}

const App = (
  <div>
    hello, mini-react
    <Counter></Counter>
  </div>
);

console.log(App);
ReactDOM.createRoot(document.getElementById("root")).render(App);
