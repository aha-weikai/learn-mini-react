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

let foo = 0;
let props = { id: "app" };

const App = () => {
  const update = React.update();
  function handleClick() {
    foo++;
    props = {};
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
