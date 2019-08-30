'use strict';

const express = require('express');
const router = express.Router();
const auth = require('../auth/middleware');

/**
 *This gets all the stored books
 *
 * @route GET /books
 * @returns {object} books in the db
 */
router.get('/books', auth, handleGetAll);

/**
 *This gets a stored book by id
 *
 * @route GET /books/:id
 * @param {id} the book id
 * @returns {object} book by id from the db
 */
router.get('/books/:id',auth, handleGetOne);

// Route Handlers
/**
 *
 * @param req
 * @param res
 * @param next
 */
function handleGetAll(req, res, next) {
  let books = {
    count: 3,
    results: [
      { title:'Moby Dick', id:1 },
      { title:'Little Women', id:2 },
      { title: 'Eloquent Javascript',id:3 },
    ],
  };
  res.status(200).json(books);
}

/**
 *
 * @param req
 * @param res
 * @param next
 */
function handleGetOne(req, res, next) {
  let book = {
    title:'Moby Dick',
  };
  res.status(200).json(book);
}

module.exports = router;
