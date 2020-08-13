//pull in the required items to authenticate a user
const User = require('../models').User;
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');
const jwt = require('jsonwebtoken');

/**
 * using JWT to check if user is pre-authorized, if so,
 * lets skip all the work listed below, otherwise, go through the steps below
 *
 * using basic auth, check if we have any credentials to work with
 * if we do, see if the emailAddress is on file
 * if it is, compare the password provided with the one on file
 * if they match, set a value to be used elsewhere in the chain
 * if any steps fail provide a 401 access denied message
 **/
const authenticateUser = async (req, res, next) => {
  const token = await verifyToken(req);
  if (token) {
    const user = await User.findOne({
      where: {
        emailAddress: token.user.emailAddress,
      },
    });
    if (user) {
      token.user.id = user.id;
      req.currentUser = token.user;
      return next();
    }
  }
  const credentials = auth(req);
  let authMessage = null;
  if (credentials) {
    const user = await User.findOne({
      where: {
        emailAddress: credentials.name,
      },
    });
    if (user) {
      const authenticated = bcryptjs.compareSync(credentials.pass, user.password);
      if (authenticated) {
        req.currentUser = user;
      } else {
        authMessage = `Authentication failure for user: ${credentials.name}`;
      }
    } else {
      authMessage = `Authentication failure for user: ${credentials.name}`; //the same message as above to prevent brute forcing usernames
    }
  } else {
    authMessage = 'Auth header not found';
  }
  if (authMessage) {
    console.warn(authMessage);
    res.status(401).json({ message: `Access Denied: ${authMessage}` });
  } else {
    next();
  }
};

/**
 * takes in the request splits out the auth header ans checks it it has a Bearer, if it does,
 * it verifies the token
 * return true is valid, false is not
 */
async function verifyToken(req) {
  const authHeader = req.headers['authorization'];

  if (typeof authHeader !== 'undefined') {
    const authType = authHeader.split(' ');
    // return authType === 'Bearer' ? true : false;

    if (authType[0] === 'Bearer') {
      let data = false;
      await jwt.verify(authType[1], process.env.JWT_SECRET, (err, tokenData) => {
        err ? (data = false) : (data = tokenData);
      });
      return data;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

module.exports = authenticateUser;
