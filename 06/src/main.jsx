import ReactDOM from "../core/ReactDOM";
import React from "../core/React";

// function App() {
//   return <div id="app">hello mini-react! ---jsx</div>;
// }

function Counter({ num }) {
  return <div>count:{num}</div>;
}

let foo = 0;
let props = { id: "app" };

const App = () => {
  console.log("app");
  function handleClick() {
    foo++;
    props = {};
    React.update();
  }
  debugger;
  return (
    <div {...props}>
      hello, mini-react{foo}
      <button onClick={handleClick}>点击</button>
      {/* <Counter num={10}></Counter> */}
    </div>
  );
};

console.log(App);
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
