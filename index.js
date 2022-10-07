const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
const database = require('./database')

const person = database.person
const exercise = database.exercise

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post("/api/users", (req, res) => {
  if (req.body.username) {
    const newPerson = new person({
      username: req.body.username
    })

    newPerson.save((err, data) => {
      if (!err)
        res.json({
          username: data.username,
          _id: data._id
        })
    })
  } else res.send("No Username Submitted")
})

app.get("/api/users", (req, res) => {
  person.find({username: {$exists: true}}).select({username: 1, _id: 1}).exec((err, data) => {
    if (!err)
      res.json(data)
    else res.send (err)
  })
})

app.post("/api/users/:_id/exercises", (req, res) => {

  person.findById(req.params._id, (err, person) => {
    if ((!err) && (person)) {
      
      const newExercise = new exercise({
        description: req.body.description,
        duration: parseInt(req.body.duration),
        date: (req.body.date) ? new Date(req.body.date).toDateString() : new Date().toDateString()
      })

      person.log.push(newExercise)
      person.save((err, data) => {
        if (!err)
          res.json({
            username: data.username,
            _id: data._id,
            description: newExercise.description,
            duration: newExercise.duration,
            date: newExercise.date
          })
      })
    }
  })
})

app.get("/api/users/:_id/logs", (req, res) => {  
  person.findById(req.params._id, (err, data) => {
    if (!err) 
      res.json({
        _id: data._id,
        username: data.username,
        count: data.log.length,
        log: logResult(req.query.from, req.query.to, req.query.limit, data.log)
      })
    else res.send(err)
  })
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

const logResult = (from, to, limit, data) => {
  let fromDate = new Date(0)
  let toDate = new Date()
  let limitDate = data.length

  if (from) fromDate = new Date(from)
  if (to) toDate = new Date(to)
  if (limit) limitDate = limit

  fromDate = fromDate.getTime()
  toDate = toDate.getTime()

  return data.filter((item) => {
    let logDate = new Date(item.date).getTime()
    return fromDate <= logDate <= toDate
  }).slice(0, limitDate)
}