require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

morgan.token('content', function getContent(req) {
  if (req.method === 'POST') {
    return `{ "name": "${req.body.name}", "number": "${req.body.number}" }`
  } else {
    return ''
  }
})

const app = express()

app.use(express.static('dist'))
app.use(express.json())
app.use(
  morgan((tokens, req, res) => {
    const content = tokens.content(req, res)

    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'),
      '-',
      tokens['response-time'](req, res),
      'ms',
      content && `${content}`,
    ]
      .filter(Boolean)
      .join(' ')
  })
)

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then((persons) => {
      return response.json(persons)
    })
    .catch((err) => next(err))
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findById(id)
    .then((person) => {
      if (!person) {
        return next({
          status: 404,
          message: `Person with id ${id} does not exist`,
        })
      }
      return response.json(person)
    })
    .catch((err) => next(err))
})

app.get('/api/info', (request, response, next) => {
  const date = Date().toString()
  Person.find({})
    .then((persons) => {
      response.send(
        `
        <div>Phonebook has info for ${persons.length} people</div>
        <div>${date}</div>
    `
      )
    })
    .catch((err) => next(err))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.number) {
    return next({ status: 400, message: 'number missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then((result) => {
      console.log(`added ${result.name} number ${result.number} to phonebook`)
      return response.status(201).json(person)
    })
    .catch((err) => next(err))
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndDelete(id)
    .then((person) => {
      if (!person) {
        return next({
          status: 404,
          message: `Person with id ${id} does not exist`,
        })
      }
      return response.status(204).end()
    })
    .catch((err) => next(err))
})

app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  const body = request.body

  Person.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  })
    .then((updatedPerson) => {
      if (!updatedPerson) {
        return next({
          status: 404,
          message: `Person with id ${id} does not exist`,
        })
      }
      return response.status(200).json(updatedPerson)
    })
    .catch((err) => next(err))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const unknownEndpoint = (request, response) => {
  return response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'malformatted id ' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  return response
    .status(error.status || 500)
    .json({ error: error.message || 'Internal Server Error' })
}

app.use(errorHandler)
