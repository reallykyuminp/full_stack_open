const express = require("express");
const morgan = require("morgan");

const path = require("path");

morgan.token("content", function getContent(req, res) {
  if (req.method === "POST") {
    return `{ "name": "${req.body.name}", "number": "${req.body.number}" }`;
  } else {
    return "";
  }
});

const app = express();

app.use(express.static("dist"));
app.use(express.json());
app.use(
  morgan((tokens, req, res) => {
    const content = tokens.content(req, res);

    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      content && ` ${content}`,
    ]
      .filter(Boolean)
      .join(" ");
  })
);

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);

  if (!person) {
    return response
      .status(404)
      .json({ error: `person with id ${id} does not exist` });
  }

  return response.json(person);
});

app.get("/info", (request, response) => {
  const date = Date().toString();

  response.send(`
        <div>Phonebook has info for ${persons.length} people</div>
        <div>${date}</div>
    `);
});

const isNameExists = (name) => {
  const person = persons.find((person) => person.name === name);
  return person || false;
};

const generateRandomId = () => {
  return String(Math.floor(Math.random() * 1000));
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: "name missing",
    });
  }

  if (isNameExists(body.name)) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  if (!body.number) {
    return response.status(400).json({
      error: "number missing",
    });
  }

  const person = {
    id: generateRandomId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  return response.status(201).json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);

  if (!person) {
    return response
      .status(404)
      .json({ error: `person with id ${id} does not exist` });
  }

  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
