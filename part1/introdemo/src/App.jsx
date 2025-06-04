import { useState } from "react";

const Display = ({ counter }) => <div>{counter}</div>;

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>;

const App = () => {
  const [counter, setCounter] = useState(0);
  console.log("rendering with value, ", counter);

  const incrementCounter = () => {
    console.log("increasing value from, ", counter);
    setCounter(counter + 1);
  };
  const decrementCounter = () => {
    console.log("decreasing value from, ", counter);
    setCounter(counter - 1);
  };

  const resetCounter = () => {
    console.log("resetting value from, ", counter);
    setCounter(0);
  };

  return (
    <div>
      <Display counter={counter} />
      <Button onClick={incrementCounter} text="plus" />
      <Button onClick={decrementCounter} text="minus" />
      <Button onClick={resetCounter} text="reset" />
    </div>
  );
};
export default App;
