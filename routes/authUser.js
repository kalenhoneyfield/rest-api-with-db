const User = require('../models').User;
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');

const authenticateUser = async (req, res, next) => {
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

module.exports = authenticateUser;
