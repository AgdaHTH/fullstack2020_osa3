const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.static('build')) //onko oikeassa kohdassa?
app.use(morgan('tiny'))
app.use(express.json())


let persons = [
      { 
        "name": "Arto Hellas", 
        "number": "040-123456",
        "id": 1
      },
      { 
        "name": "Ada Lovelace", 
        "number": "39-44-5323523",
        "id": 2
      },
      { 
        "name": "Dan Abramov", 
        "number": "12-43-234345",
        "id": 3
      },
      { 
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122",
        "id": 4
      }
    ]

const info = () => {
    const date = new Date()
    const info_response = `Phonebook has information for ${persons.length} persons`
    return info_response + '<br></br>' + date
}

app.get('/', (req, res) => {
    res.send('<h1>Hello You!</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    res.send(info())
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
} )

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
} )

app.post('/api/persons', (request, response) => {
  
  const body = request.body
  //console.log(body)
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
  const names = persons.map( person => person.name )
  console.log(names)

  if (names.includes(body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }
 
  const newId = Math.floor(Math.random() * 10000) + 5
  console.log('newId', newId)
  
  const person = {
    name: body.name,
    number: body.number,
    id: newId
  }
  console.log(person)

  persons = persons.concat(person)
  
  response.json(person)
})



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})