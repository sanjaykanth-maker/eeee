module.exports = {
  name: 'disconnect',
  execute: async (client) => {
    client.logger.warn('Bot has disconnected.');
  },
};
