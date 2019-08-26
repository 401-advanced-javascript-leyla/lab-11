'use strict';

const express = require('express');
const router = express.Router();
const auth = require('../auth/middleware');

router.get('/books', auth, handleGetAll);
router.get('/books/:id',auth, handleGetOne);

// Route Handlers
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

function handleGetOne(req, res, next) {
  let book = {
    title:'Moby Dick',
  };
  res.status(200).json(book);
}

module.exports = router;
