const dotenv = require('dotenv');
const compression = require('compression');
const ApiGateway = require('moleculer-web');
const HTTPClientService = require('moleculer-http-client');

dotenv.config();

const {
  PORT,
} = process.env;

module.exports = {
  name: 'api',
  mixins: [ApiGateway, HTTPClientService],
  use: [compression()],
  settings: {
    port: PORT || 3000,
  },
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: false,
    maxAge: 3600,
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
