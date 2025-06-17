import personsService from "../services/personsServices";

const Persons = ({ persons, setPersons, createMessage }) => {
  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personsService
        .remove(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
          createMessage(true, `Deleted ${name}`);
        })
        .catch((error) => {
          createMessage(
            false,
            `Information of ${name} was already removed from server`
          );
        });
    }
  };

  return (
    <ul>
      {persons.map((person) => (
        <li key={person.id}>
          {person.name} {person.number}
          <button
            id={person.id}
            onClick={() => handleDelete(person.id, person.name)}
          >
            {" "}
            Delete{" "}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default Persons;
