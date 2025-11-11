const { auth } = require('express-oauth2-jwt-bearer');

// Auth0 JWT verification middleware
const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: process.env.AUTH0_TOKEN_SIGNING_ALG || 'RS256'
});

module.exports = { checkJwt };
