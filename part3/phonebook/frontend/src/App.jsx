import { useState, useEffect } from "react";

import Filter from "./components/Filter";
import ContactForm from "./components/ContactForm";
import Persons from "./components/Persons";
import Notification from "./components/Notification";

import personsService from "./services/personsServices";

const App = () => {
  // ------------------------ State Init -----------------------------
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newFilter, setNewFilter] = useState("");
  const [message, setMessage] = useState({
    isSuccess: true,
    content: null,
  });

  useEffect(() => {
    personsService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  function createMessage(isSuccess, content) {
    setMessage({
      isSuccess: isSuccess,
      content: content,
    });

    setTimeout(() => {
      setMessage({ ...message, content: null });
    }, 5000);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Check if newName is in the phonebook
    if (persons.some((person) => person.name === newName)) {
      if (
        window.confirm(
          `${newName} is already add to the phonebook, replace the old number with a new one?`
        )
      ) {
        const oldPersonObject = persons.find(
          (person) => person.name === newName
        );
        const newPersonObject = { ...oldPersonObject, number: newNumber };
        personsService
          .update(newPersonObject.id, newPersonObject)
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id === returnedPerson.id ? returnedPerson : person
              )
            );
            createMessage(true, `Updated ${returnedPerson.name}`);
          })
          .catch((error) =>
            createMessage(false, `Failed to update ${newPersonObject.name}.`)
          );
      }
    } else {
      // Else, add newName to phonebook
      const personObject = {
        name: newName,
        number: newNumber,
      };

      personsService
        .create(personObject)
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson));
          setNewName("");
          setNewNumber("");
          createMessage(true, `Added ${returnedPerson.name}`);
        })
        .catch((error) =>
          createMessage(false, `Failed to add ${personObject}.`)
        );
    }
  };

  const filtered_people =
    newFilter !== ""
      ? persons.filter((person) =>
          person.name.toLowerCase().includes(newFilter.toLowerCase())
        )
      : persons;

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter newFilter={newFilter} setNewFilter={setNewFilter} />
      <h3>Add New Contact</h3>
      <ContactForm
        onSubmit={handleSubmit}
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
      />
      <h3>Numbers</h3>
      <Persons
        persons={filtered_people}
        setPersons={setPersons}
        createMessage={createMessage}
      />
    </div>
  );
};

export default App;
