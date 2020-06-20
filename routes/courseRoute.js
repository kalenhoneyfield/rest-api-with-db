const express = require('express');
const router = express.Router();
const Course = require('../models').Course;

const db = require('../models');
const { Op } = db.Sequelize;

//catch server side errors in one place
function asyncHandler(callback) {
  return async (req, res, next) => {
    try {
      await callback(req, res, next);
    } catch (error) {
      res.status(500).send(error);
    }
  };
}

/**
 * GET route to return a list of courses
 * Should return: id, title, description, estimatedTime, materialsNeeded, and the user
 */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const courses = await Course.findAll();
    res.json({ courses });
  })
);

module.exports = router;
