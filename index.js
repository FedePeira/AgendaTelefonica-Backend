const express = require('express')
const cors = require('cors')
const app = express()
const morgan = require('morgan');

app.use(cors())
app.use(morgan('tiny'));
app.use(express.json())

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

const requestPost = (request, response, next) => {
    console.log(request.body)
    next()
}

app.use(requestLogger)
app.use(requestPost)

let persons = [
    {
        "name": "Arto Hellas",
        "number": "13124151",
        "id": "1"
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": "2"
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": "3"
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": "4"
    },
    {
        "id": "7",
        "name": "Agustin",
        "number": "12315151512"
    }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

const findId = (id) => {
    return persons.some(person => person.id === id)
}

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id

  if(id !== undefined || id !== '') {
    if(findId(id)) {
        persons = persons.filter(person => person.id !== id)
        response.status(204).end()
      } else {
        return response.status(400).json({ 
            error: 'id not exist' 
        })
      }
  } else {
    return response.status(400).json({ 
        error: 'id empty' 
    })
  }
})

app.get('/info', (request, response) => {
    const currentTime = new Date().toLocaleString();
    const size = persons.length
    if(size !== 0) {
        response.send(`<p>Phonebook has info for ${size}</p><br/><p>${currentTime}</p>`)
    } else {
        return response.status(400).json({ 
            error: 'list empty' 
        })
    }
})

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1
}

const findPerson = (name) => {
    return persons.some(person => person.name === name)
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }

  if (!body.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }

  if(!findPerson(body.name)){
    const person = {
        id: generateId().toString(),
        name: body.name,
        number: body.number
    }
    
    persons = persons.concat(person)
    
    response.json(person)
  } else {
    return response.status(400).json({ 
        error: 'name must be unique' 
    })
  }
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)