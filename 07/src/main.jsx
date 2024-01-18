import ReactDOM from "../core/ReactDOM";
import React from "../core/React";

// function App() {
//   return <div id="app">hello mini-react! ---jsx</div>;
// }

function Counter({ num }) {
  console.log("counter update");
  return <div>count:{num}</div>;
}

function Bar() {
  console.log("bar update");
  return <div>bar</div>;
}

let foo = 0;
let props = { id: "app" };

const App = () => {
  function handleClick() {
    foo++;
    props = {};
    const update = React.update();
    update();
  }
  return (
    <div {...props}>
      hello, mini-react{foo}
      {props.id && <Bar></Bar>}
      <button onClick={handleClick}>点击</button>
      <Counter num={foo}></Counter>
      <Bar></Bar>
    </div>
  );
};

console.log(App);
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
