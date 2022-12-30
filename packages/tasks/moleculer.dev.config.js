const { getUniqId } = require('./utils/func');

let nodeID = null;
if (require('fs').existsSync('./package.json')) nodeID = require('./package.json').name;

module.exports = {
  namespace: getUniqId(),
  nodeID,
  logger: true,
  logLevel: 'info',
  logFormatter: 'short',
  cacher: false,
  transporter: {
    type: 'NATS',
    options: {
      maxPacketSize: 50 * 1024 * 1024,
    },
  },
};
