require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const Person = require("./models/person");

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
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  Person.findById(id).then((person) => {
    if (!person) {
      return response
        .status(404)
        .json({ error: `person with id ${id} does not exist` });
    }
    response.json(person);
  });
});

app.get("/info", (request, response) => {
  const date = Date().toString();
  Person.find({}).then((persons) => {
    response.send(`
        <div>Phonebook has info for ${persons.length} people</div>
        <div>${date}</div>
    `);
  });
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: "name missing",
    });
  }

  if (!body.number) {
    return response.status(400).json({
      error: "number missing",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((result) => {
    console.log(`added ${result.name} number ${result.number} to phonebook`);
    return response.status(201).json(person);
  });
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  Person.findByIdAndDelete(id).then((person) => {
    if (!person) {
      return response
        .status(404)
        .json({ error: `person with id ${id} does not exist` });
    } else {
      return response.status(204).end();
    }
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
