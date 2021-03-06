'use strict';

/**
 * Middleware
 * @module src/auth/middleware.js
 */

const User = require('./users-model.js');

module.exports = (req, res, next) => {

  try {

    let [authType, encodedString] = req.headers.authorization.split(/\s+/);

    // BASIC Auth  ... Authorization:Basic ZnJlZDpzYW1wbGU=

    switch(authType.toLowerCase()) {
    case 'basic':
      return _authBasic(encodedString);
    default:
      return _authError();
    }

  } catch(e) {
    return _authError();
  }



  /**
   *This create an object with username and password and returns the result of the User.authenticateBasic(auth)
   *
   * @param {*} authString
   * @returns User.authenticateBasic(auth) calls _authenticate()
   */
  function _authBasic(authString) {
    let base64Buffer = Buffer.from(authString,'base64'); // <Buffer 01 02...>
    let bufferString = base64Buffer.toString(); // john:mysecret
    let [username,password] = bufferString.split(':');  // variables username="john" and password="mysecret"
    console.log([username,password]);
    let auth = {username,password};  // {username:"john", password:"mysecret"}

    return User.authenticateBasic(auth)
      .then( user => _authenticate(user) );
  }


  /**
   *This function adds an user and token to the request body
   *
   * @param {*} user
   */
  function _authenticate(user) {
    if ( user ) {
      req.user = user;
      req.token = user.generateToken();
      next();
    }
    else {
      _authError();
    }
  }


  /**
   *This will send the status code, message
   *
   */
  function _authError() {
    next({status: 401, statusMessage: 'Unauthorized', message: 'Invalid User ID/Password'});
  }

};

