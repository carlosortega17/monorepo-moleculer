const { getUniqId } = require('./utils/func');

module.exports = {
  namespace: getUniqId(),
  nodeID: 'gateway',
  logger: true,
  logLevel: 'info',
  logFormatter: 'short',
  cacher: {
    type: 'memory',
    options: {
      maxParamsLength: 100,
    },
  },
  transporter: {
    type: 'NATS',
    options: {
      maxPacketSize: 60 * 1024 * 1024,
    },
  },
};
