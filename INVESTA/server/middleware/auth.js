const { auth } = require('express-oauth2-jwt-bearer');

// Auth0 JWT verification middleware
const checkJwt = auth({
  audience: 'https://investa-api', // From Auth0 API settings
  issuerBaseURL: 'https://dev-3j603j6lo2akvuu6.us.auth0.com/',
  tokenSigningAlg: 'RS256'
});

module.exports = { checkJwt };
