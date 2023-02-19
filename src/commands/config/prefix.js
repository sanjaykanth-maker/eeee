const collection = require('../../models/guild');
const { bold, inlineCode } = require('discord.js');

module.exports = {
  name: 'prefix',
  run: async (client, message, args) => {
    if (!message.member.permissions.has('Administrator')) {
      return message.channel.send(
        `${client.config.emojis.cross} | You need ${inlineCode(
          'Administrator'
        )} permission to use this command.`
      );
    }

   
      const prefix = args[0];
      if (!prefix) return message.channel.send('Please provide some prefix.');
      if (prefix.length > 2) {
        return message.channel.send(
          'Prefix must not be longer than 10 characters.'
        );
      }

      await collection.findOneAndUpdate(
        { guildId: message.guildId },
        { prefix: prefix },
        { upsert: true }
      );

      message.channel.send(
        `${client.config.emojis.tick} | Updated the server prefix to ${bold(
          prefix
        )}.`
      );
  },
};
