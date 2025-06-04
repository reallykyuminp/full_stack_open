import { useState } from "react";

const Button = ({ onClick, text }) => {
  return <button onClick={onClick}>{text}</button>;
};

const MostVotes = ({ anecdotes, votes }) => {
  const max_votes = Math.max(...votes);
  var max_vote_anecdote = "";

  for (let i = 0; i < votes.length; i++) {
    if (votes[i] === max_votes) {
      max_vote_anecdote = anecdotes[i];
      break;
    }
  }

  return <div> {max_vote_anecdote} </div>;
};

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0));

  const randomizeAnecdote = () => {
    const random_index = Math.floor(Math.random() * (anecdotes.length - 1));
    setSelected(random_index);
  };

  const incrementVote = () => {
    const new_votes = [...votes];
    new_votes[selected] = votes[selected] + 1;
    setVotes(new_votes);
  };

  return (
    <>
      <h1> Anecdote of the day </h1>
      <div> {anecdotes[selected]}</div>
      <Button text={"vote"} onClick={incrementVote} />
      <Button text={"next anecdote"} onClick={randomizeAnecdote} />

      <h1> Anecdote with most votes </h1>
      <MostVotes anecdotes={anecdotes} votes={votes} />
    </>
  );
};

export default App;
