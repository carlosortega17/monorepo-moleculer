const dotenv = require('dotenv');
const compression = require('compression');
const ApiGateway = require('moleculer-web');
const jwt = require('jsonwebtoken');
const { resp } = require('../utils/func');

dotenv.config();

const {
  PORT,
  JWT_SECRET,
} = process.env;

module.exports = {
  name: 'api',
  mixins: [ApiGateway],
  use: [compression()],
  settings: {
    port: PORT || 3000,
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: false,
      maxAge: 3600,
    },
    routes: [
      {
        path: '/',
        autoAliases: true,
        bodyParsers: {
          json: { limit: '2MB' },
          urlencoded: { extended: true, limit: '2MB' },
        },
        onBeforeCall(ctx, route, req, res) {
          if (req.url === '/api/status') {
            return null;
          }

          if (req.headers && req.headers.authorizationd && req.headers.authorization.includes('Bearer') && req.headers.authorization.length <= 48) {
            const token = req.headers.authorization.split(' ')[1];
            const verify = jwt.verify(token, JWT_SECRET);
            if (!verify) {
              return resp(
                res,
                {
                  name: 'unauthorize',
                  message: 'Need JWT',
                },
                401,
              );
            }
          }
          return resp(
            res,
            {
              name: 'unauthorize',
              message: 'Need JWT',
            },
            401,
          );
        },
      },
    ],
  },
  actions: {
    status: {
      rest: 'GET /status',
      async handler(ctx) {
        ctx.meta.$statusCode = 200;
        return {
          name: 'status',
          message: 'Ok',
        };
      },
    },
  },
  assets: {
    folder: './public',
  },
};
