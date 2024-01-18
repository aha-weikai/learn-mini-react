let count = 0;
function App() {
  function setCount() {
    console.log("----", count);
    count++;
  }
  return (
    <>
      <div className="card">
        <button onClick={setCount}>count is {count}</button>
      </div>
    </>
  );
}

export default App;
