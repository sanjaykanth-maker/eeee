const { ActivityType } = require('discord.js');

module.exports = {
  name: 'ready',
  execute: async (client) => {
    await client.application.fetch();
    client.logger.info(`Logged in as ${client.user.tag}.`);

    client.user.setPresence({
      activities: [
        {
          name: '?chatbot',
          type: ActivityType.Listening,
        },
      ],
    });
  },
};
