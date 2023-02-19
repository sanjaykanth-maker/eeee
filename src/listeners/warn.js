module.exports = {
  name: 'warn',
  execute: async (client, error) => {
    client.logger.warn(error);
  },
};
