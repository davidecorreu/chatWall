const jwt = require('jsonwebtoken');
require('dotenv').config({path:__dirname+'/./../../.env'});

const jwt_secret = process.env.JWT_SECRET;

const authorize = async (ctx, next) => {
  const authHeader = ctx.headers.authorization;

  if (!authHeader) {
    ctx.status = 401;
    ctx.body = 'There is no authorization header';
    return;
  }

  const jwt_token = authHeader.split(' ')[1];
  let decoded;


  try {
    decoded = jwt.verify(jwt_token, jwt_secret);
  } catch (err) {
    ctx.status =401;
    ctx.body = err.message;
    return;
  }

  ctx.user = {username: decoded.username};

  await next();
};

module.exports = authorize;
