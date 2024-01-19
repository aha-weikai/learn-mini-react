import ReactDOM from "../core/ReactDOM";
import React from "../core/React";

// function App() {
//   return <div id="app">hello mini-react! ---jsx</div>;
// }

function Counter({ num }) {
  console.log("counter update");
  return <div>count:{num}</div>;
}

let friendsNum = 0;
function Bar() {
  const update = React.update();
  function barClick() {
    friendsNum++;
    update();
  }
  console.log("bar update");
  return <div onClick={barClick}>bar:{friendsNum}</div>;
}

let props = { id: "app" };

const App = () => {
  const [count, setCount] = React.useState(10);
  const [bar, setBar] = React.useState("bar");

  function handleClick() {
    setCount((c) => c + 1);
    setBar((s) => s + "-bar");
  }
  return (
    <div {...props}>
      hello, mini-react{count}
      {props.id && <Bar></Bar>}
      <div>{bar}</div>
      <button onClick={handleClick}>点击</button>
      <Counter num={count}></Counter>
      <Bar></Bar>
    </div>
  );
};

console.log(App);
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
