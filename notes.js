We use Route Parameter for essentials or required values whereas we use Query String Paramater for anything optional and extra data. Query String Parameter is nothing but the paramater which is optional and add in url after ? sign. We use this to provide additional data to our backend services.

const coursesArr = [
    { id : 1, name: 'course1'},
    { id : 2, name: 'course2'},
    { id : 3, name: 'course3'}
];

// Get Single Parameters
// http://localhost:3000/api/courses/1
app.get('/api/courses/:id', (req, res) => {
  res.send(req.params.id)
})
//Output: 1


// Get multiple parameters
// http://localhost:3000/api/courses/2018/1
app.get('/api/courses/:year/:month', (req, res) => {
  res.send(req.params)
})
//Output: {"year":"2018","month":"1"}


// GET Query Parameter
// http://localhost:3000/api/courses/2018/1?sortBy=name
app.get('/api/courses/:year/:month', (req, res) => {
  res.send(req.query)
})
//Output: {"sortBy":"name"}


A proper way to pass a port to our Node Application.
We should attempt to read the value of environment vaariable called PORT.
If there is a value then we should use that otherwise use arbitrary port like 3000

// Setting and Listening PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`))


// http://localhost:3000/api/courses/1
app.get('/api/courses/:id', (req, res) => {
  const course = coursesArr.find(c => c.id === parseInt(req.params.id))
  if(!course)
    res.status(404).send('The course with the given ID was not found')
  res.send(course);
})
//Output: {"id":"1" , "name":"course1"}

// If the course doesn't get any value that means that particular course is not present in an array/db, So we ideally should send HTTP status code 404, It is used to tell the user that requested resource is not found. It is one of the conventions of the RESTful APIs. If the client ask for the resource but that resource does not exists on server. We should return status code 404.


When it comes to get values from request body using req.body.name we need to do one thing. Inorder for this line to work, we need to enable parsing of json object in the body of the request, by default this feature is not enabled in express, So to make that possible we need to use express.json() in our app.

i.e. app.use(express.json());

// Adding a piece of middleware, So when we call express.json() this method returns piece of middleware then we call app.use() to use that middleware in request pipeline, So whenever request comes then it executes the middleware before handling request



Working with Joi Validation

const Joi = require('joi');
// J in Joi should be capital since require('joi') returns class and express its standard rule to give name of class with first letter Capital

const schema = {
  name: Joi.string().min(3).required(),
  username: Joi.string().alphanum().min(3).max(30).required(),
  birth_year: Joi.number().integer().min(1900).max(2013),
  mobile: Joi.number().integer().min(10).max(10);
}
const result = Joi.validate(req.body, schema)
console.log(result);
if(result.error){
  console.log("Entered data is invalid !")
}


// if validation success, i.e. result.error = null
// console.log(result)
{
  error: null,
  value: { name: 'sushants' },
  then: [Function: then],
  catch: [Function: catch]
}
// if validation fails, i.e. result.error = [Object]
// console.log(result.error)
{
    "isJoi": true,
    "name": "ValidationError",
    "details": [
        {
            "message": "\"name\" length must be at least 3 characters long",
            "path": [
                "name"
            ],
            "type": "string.min",
            "context": {
                "limit": 3,
                "value": "as",
                "key": "name",
                "label": "name"
            }
        }
    ],
    "_object": {
        "name": "as"
    }
}
