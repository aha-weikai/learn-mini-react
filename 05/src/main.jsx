import ReactDOM from "../core/ReactDOM";
import React from "../core/React";

// function App() {
//   return <div id="app">hello mini-react! ---jsx</div>;
// }

function Counter({ num }) {
  return <div>count:{num}</div>;
}

const App = () => (
  <div>
    hello, mini-react
    <Counter num={10}></Counter>
  </div>
);

console.log(App);
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
