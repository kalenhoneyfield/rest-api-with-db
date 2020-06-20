//since we're using this outside the normal loop, pull in the required bits to
//allow this to function as a single bit pf middleware

const { body, validationResult } = require('express-validator');

const userRules = () => {
  return [
    // firstName must exist
    body('firstName')
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please provide a value for "firstName"'),

    // lastName must exist
    body('lastName')
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please provide a value for "lastName"'),

    // emailAddress must exist
    body('emailAddress')
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please provide a value for "emailAddress"'),

    // password must exist - we'll update this later with further rules like must match etc
    body('password')
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please provide a value for "password"'),
  ];
};

const courseRules = () => {
  return [
    // title must exist
    body('title')
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please provide a value for "title"'),
    // description must exist
    body('description')
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please provide a value for "description"'),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessage = [];
    errors.array().map((err) => errorMessage.push({ [err.param]: err.msg }));

    //the Rubric asks for 400
    return res.status(400).json({
      errors: errorMessage,
    });
  } else {
    return next();
  }
};

module.exports = {
  userRules,
  courseRules,
  validate,
};
