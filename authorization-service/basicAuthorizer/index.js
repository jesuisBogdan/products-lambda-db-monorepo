require('dotenv').config();
const { permission } = require('../utils/enums');
const { createPolicy } = require('../utils/policy');

const { TEST_PASSWORD } = process.env;
const basicAuthorizer = async function (event) {
  const authHeader = event.authorizationToken.split(' ')[1];

  if (!authHeader) {
    return createPolicy(event, permission.DENY);
  }

  const decodedAuthHeader = Buffer.from(authHeader, 'base64').toString('utf-8');
  const [username, password] = decodedAuthHeader.split(':');

  if (password !== TEST_PASSWORD) {
    return createPolicy(event, permission.DENY);
  }

  return createPolicy(event, permission.ALLOW, username);
};

module.exports = { basicAuthorizer };
