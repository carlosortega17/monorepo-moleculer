const dotenv = require('dotenv');

dotenv.config();

const DbService = require('moleculer-db');
const MongoDbAdapter = require('moleculer-db-adapter-mongo');

module.exports = (collection) => {
  const {
    CONN_URL,
  } = process.env;
  return ({
    name: collection,
    mixins: [DbService],
    adapter: new MongoDbAdapter(
      CONN_URL,
      {
        directConnection: true,
      },
    ),
    collection,
    settings: {
      maxPageSize: 500,
    },
  });
};
