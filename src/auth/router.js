'use strict';

const express = require('express');
const authRouter = express.Router();

const User = require('./users-model.js');
const auth = require('./middleware.js');


/**
   *This adds a new user 
   *
   * @route POST /signup
   * @param {req} request body
   * @param {res} response 
   * @param {next} middleware function
   * @returns {object} object
   */
authRouter.post('/signup', (req, res, next) => {
  let user = new User(req.body);
  user.save()
    .then( (user) => {
      req.token = user.generateToken();
      req.user = user;
      res.set('token', req.token);
      res.cookie('auth', req.token);
      res.send(req.token);
    }).catch(next);
});


/**
   *This signs in an user 
   *
   * @route POST /signin
   * @param {auth} authentication middleware
   * @param {req} request body
   * @param {res} response 
   * @param {next} middleware function
   * @returns {string} JWT
   */
authRouter.post('/signin', auth, (req, res, next) => {
  res.cookie('auth', req.token);
  res.send(req.token);
});

module.exports = authRouter;
