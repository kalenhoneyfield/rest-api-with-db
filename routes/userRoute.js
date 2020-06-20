const express = require('express');
const router = express.Router();
const User = require('../models').User;

//pull in the validation rule set
const { userRules, validate } = require('./expressValidator');
const { check, validationResult } = require('express-validator');
const nameValidator = check('firstName')
  .exists({ checkNull: true, checkFalsy: true })
  .withMessage('Please provide a value for "firstName"');

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
 * GET route for the current authenticated user
 * should return only firstName, lastName, emailAddress
 */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const users = await User.findAll();
    res.json({ users });
  })
);

/**
 * POST route to create a user
 */
router.post(
  '/',
  //   nameValidator,
  userRules(),
  validate,
  asyncHandler(async (req, res) => {
    // const errors = validationResult(req);
    // const errorMessages = errors.array().map((error) => error.msg);
    // console.log(errors.isEmpty());
    // console.log(errorMessages);
    console.log(req.body);
    res.location('/');
    res.status(201).end();
  })
);

module.exports = router;
