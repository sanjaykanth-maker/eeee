const collection = require('../../models/guild');
const { ChannelType, inlineCode } = require('discord.js');

module.exports = {
  name: 'chatbot',
  subCommands: ['enable', 'disable'],
  description: 'Enables/disables chatbot in a specific channel.',
  run: async (client, message, args) => {
    if (!message.member.permissions.has('Administrator')) {
      return message.channel.send(
        `${client.config.emojis.cross} | You need ${inlineCode(
          'Administrator'
        )} permission to use this command.`
      );
    }

    if (args[0] === 'enable') {
      const channel = message.mentions.channels.first();
      if (!channel) {
        return message.channel.send(
          `${client.config.emojis.cross} | Please mention a channel.`
        );
      }

      if (
        [
          ChannelType.GuildCategory,
          ChannelType.GuildStageVoice,
          ChannelType.GuildVoice,
        ].includes(channel.type)
      ) {
        return message.channel.send(
          `${client.config.emojis.cross} | Can't enable chatbot in a category, stage or voice channel.`
        );
      }

      if (!message.guild.channels.cache.find((c) => c.id === channel.id)) {
        return message.channel.send(
          `${client.config.emojis.cross} | Couldn't find that channel in this server.`
        );
      }

      const data = await collection.findOne({
        guildId: message.guildId,
        channelIds: { $in: channel.id },
      });

      if (data) {
        return message.channel.send(
          `${
            client.config.emojis.cross
          } | Chatbot is already enabled in ${channel.toString()}.`
        );
      }

      await collection.findOneAndUpdate(
        { guildId: message.guildId },
        { $push: { channelIds: channel.id } },
        { upsert: true }
      );

      message.channel.send(
        `${
          client.config.emojis.tick
        } | Enabled chatbot in ${channel.toString()}.`
      );
    } else {
      const channel = message.mentions.channels.first();
      if (!channel) {
        return message.channel.send(
          `${client.config.emojis.cross} | Please mention a channel.`
        );
      }

      if (
        [
          ChannelType.GuildCategory,
          ChannelType.GuildStageVoice,
          ChannelType.GuildVoice,
        ].includes(channel.type)
      ) {
        return message.channel.send(
          `${client.config.emojis.cross} | Can't disable chatbot in a category, stage or voice channel.`
        );
      }

      if (!message.guild.channels.cache.find((c) => c.id === channel.id)) {
        return message.channel.send(
          `${client.config.emojis.cross} | Couldn't find that channel in this server.`
        );
      }

      const data = await collection.findOne({
        guildId: message.guildId,
        channelIds: { $in: channel.id },
      });

      if (!data) {
        return message.channel.send(
          `${
            client.config.emojis.cross
          } | Chatbot isn't enabled in ${channel.toString()}`
        );
      }

      await collection.findOneAndUpdate(
        { guildId: message.guildId },
        { $pull: { channelIds: channel.id } },
        { upsert: true }
      );

      message.channel.send(
        `${
          client.config.emojis.tick
        } | Disabled chatbot in ${channel.toString()}.`
      );
    }
  },
};
