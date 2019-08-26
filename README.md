# LAB - 11

## Deployment Lab

### Author: Jessica Walters, Leyla Li

### Links and Resources
* [submission PR](https://github.com/401-advanced-javascript-leyla/lab-11/pulls)
* [travis](https://travis-ci.com/401-advanced-javascript-leyla/lab-00)
* [front-end](https://lab-00-leyla.herokuapp.com/)

#### Documentation
* [jsdoc](https://lab-00-leyla.herokuapp.com/docs/)

### Modules
#### `pol.js`
##### Exported Values and Methods

###### `isAlive(dead) -> boolean`
The isAlive() method returns a boolean based on the arg sent in.

### Setup
#### `.env` requirements
* `PORT` - Port Number

#### Running the app
* `npm start`
* Endpoint: `/`
  * Returns a boolean
* Endpoint: `/docs`
  * Renders Developer Documentation
  
#### Tests
* Unit Tests: `npm run test`
* Lint Tests: `npm run lint`
* Assertions Made
  * Assert that isAlive() properly returns a boolean
* Assertions Remaining
  * ... Things I want to tests, but didn't yet.

#### UML

![UML Diagram](whiteboard.jpg)