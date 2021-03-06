'use strict';

/**
 * User Model
 * @module src/users-model
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jsonWebToken = require('jsonwebtoken');

const users = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  email: {type: String},
  role: {type: String, required:true, default:'user', enum:['admin','editor','user'] },
});

users.pre('save', function(next) {
  return bcrypt.hash(this.password,10)
    .then(hashedPassword => {
      this.password = hashedPassword;
      next();
    })
    .catch( error => {throw error;} );
});

/**
 *This checks for the user name
 *
 * @param {auth}
 * @returns {object} user information
 */
users.statics.authenticateBasic = function(auth) {
  let query = {username:auth.username};
  return this.findOne(query)
    .then(user => user && user.comparePassword(auth.password))
    .catch(console.error);
};


/**
   *This compares the hashed passwords
   *
   * @param {password} the password sent from users  
   * @returns {object} user information
   */
users.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password)
    .then(isPasswordValid=>{
      return isPasswordValid ? this : null;
    });
};

/**
   *This generates token
   *
   * @returns {string} JWT
   */
users.methods.generateToken = function() {
  let tokenData = {
    id:this._id,
    capabilities: (this.acl && this.acl.capabilities) || [],
  };
  return jsonWebToken.sign(tokenData, process.env.SECRET || 'changeit' );
};

module.exports = mongoose.model('users', users);
