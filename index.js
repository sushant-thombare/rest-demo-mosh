const Joi = require('joi');
const express = require('express')
const app = express()

app.use(express.json())

// Adding a piece of middleware, So when we call express.json() this method returns piece of middleware then we call app.use() to use that middleware in request pipeline, So whenever request comes then it executes the middleware before handling request

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
  if(!course){
    res.status(404).send('The course with the given ID was not found')
    console.log('after res send when not found') //executes after res.send() also, if dont want then use return;
  }
  console.log(course) //undefined
  res.send(course);
})

app.post('/api/courses', (req, res) => {
  // if(!req.body.name || req.body.name.length < 3){
  // 400 Bad request
  // res.status(400).send('Name is required and should be maximum 3 characters.')
  // return;
  // }
  const schema = {
    name: Joi.string().min(3).required()
  }
  const result = Joi.validate(req.body, schema)
  console.log(result)
  // const { error } = validateCourseDetails(req.body)
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

app.put('/api/courses/:id', (req, res) => {
  // Look up the course
  // If not existing, return 404 - Not Found
  const course = coursesArr.find( c => c.id === parseInt(req.params.id) )
  if(!course){
    res.status(404).send('The course with given ID is not found.')
    return;
  }

  // validate
  // If invalid, return 400 - Bad request
  const { error } = validateCourseDetails(req.body)
  // const result = validateCourseDetails(req.body)
  // result.error
  if(error){
    res.status(400).send(error.details[0].message)
    return
  }

  // Update course
  course.name = req.body.name;
  // Return the updated course
  res.send(course)

})

function validateCourseDetails(courseData){
  const schema = {
    name: Joi.string().min(3).required()
  }
  return Joi.validate(courseData, schema)
}

// PORT
// A proper way to pass a port number to our Node Application.
// We should attempt to read the value of environment variable called PORT.
// If there is a value then we should use that otherwise use arbitrary port like 3000
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`))
