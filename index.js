const Joi = require('joi');
const express = require('express')
const app = express()

app.use(express.json())

// Adding a piece of middleware, So when we call express.json() this method returns piece of middleware then we call app.use() to use that middleware in request pipeline

const coursesArr = [
    { id : 1, name: 'course1'},
    { id : 2, name: 'course2'},
    { id : 3, name: 'course3'}
];

app.get('/', (req, res) => {
  res.send('Hello world!!!')
})

app.get('/api/courses', (req, res) => {
  res.send(coursesArr)
})

app.get('/api/courses/:id', (req, res) => {
  const course = coursesArr.find(c => c.id === parseInt(req.params.id))
  if(!course)
    res.status(404).send('The course with the given ID was not found')
  res.send(course);
})

app.post('/api/courses', (req, res) => {
  // if(!req.body.name || req.body.name.length < 3){
  //   // 400 Bad request
  //   res.status(400).send('Name is required and should be maximum 3 characters.')
  //   return;
  // }

  const schema = {
    name: Joi.string().min(3).required()
  }
  const result = Joi.validate(req.body, schema)
  console.log(result)

  if(result.error){
    res.status(400).send(result.error.details[0].message)
    return
  }

  const course = {
    id: coursesArr.length + 1,
    name: req.body.name
  }

  coursesArr.push(course);
  res.send(course);
  //We are assigning id in server side so client may need that id of new resource
})

// req.body.name
// Inorder for this line to work, we need to enable parsing of json object in the body of the request, by default this feature is not enabled in express, So to make that possible we need to use express.json() in our app.
// i.e. app.use(express.json());

// PORT
// A proper way to pass a port to our Node Application.
// We should attempt to read the value of environment vaariable called PORT.
// If there is a value then we should use that otherwise use arbitrary port like 3000
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`))
