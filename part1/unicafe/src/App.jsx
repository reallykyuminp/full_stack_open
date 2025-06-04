import { useState } from "react";

const StatLine = ({ text1 = "", value, text2 = "" }) => (
  <div>{text1.concat(" ", value, " ", text2)}</div>
);

const Stat = ({ good, neutral, bad }) => {
  const total = good + neutral + bad;
  const average = (good - bad) / total;
  const positive_percentage = (good / total) * 100;
  if (total === 0) {
    return <div> No feedback given </div>;
  } else {
    return (
      <>
        <StatLine text1={"good"} value={good}></StatLine>
        <StatLine text1={"neutral"} value={neutral}></StatLine>
        <StatLine text1={"bad"} value={bad}></StatLine>
        <StatLine text1={"all"} value={total}></StatLine>
        <StatLine
          text1={"average"}
          value={Math.round(average * 10) / 10}
        ></StatLine>
        <StatLine
          text1={"positive"}
          value={Math.round(positive_percentage * 10) / 10}
          text2={"%"}
        ></StatLine>
      </>
    );
  }
};

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>;

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <>
      <h1> give feedback </h1>
      <Button onClick={() => setGood(good + 1)} text={"good"} />
      <Button onClick={() => setNeutral(neutral + 1)} text={"neutral"} />
      <Button onClick={() => setBad(bad + 1)} text={"bad"} />
      <h1> statistics </h1>
      <Stat good={good} neutral={neutral} bad={bad} />
    </>
  );
};

export default App;
