const { fetch } = require('undici');
const { inlineCode } = require('discord.js');
const collection = require('./../models/guild');

module.exports = {
  name: 'messageCreate',
  execute: async (client, message) => {
    if (message.author.bot || message.system || message.webhookId) return;

    if (
      !message.guild.members.me.permissions.has('SendMessages') ||
      !message.guild.members.me
        .permissionsIn(message.channel)
        .has('SendMessages')
    ) {
      return;
    }

    const data = await collection.findOne({ guildId: message.guildId });
    const prefix = data?.prefix ?? client.config.defaultPrefix;

    const regEx = new RegExp(`^<@!?${client.user.id}>$`);
    if (regEx.test(message.content)) {
      message.channel.send(
        `My prefix in this server is ${inlineCode(prefix)}.`
      );
    }

    if (
      !message.content.startsWith(prefix) &&
      data &&
      data.channelIds.includes(message.channel.id)
    ) {
      const brainId = "172859";
      const apiKey = "yjQvFe3KHJTdRaoo";

      const response = await fetch(
        `http://api.brainshop.ai/get?bid=${brainId}&key=${apiKey}&uid=${message.userId}&msg=${encodeURIComponent(message.content)}`
      );
      const json = await response.json();

      message.reply(json.cnt);
    } else if (message.content.startsWith(prefix)) {
      const args = message.content.slice(prefix.length).trim().split(/ +/);
      const command = args.shift().toLowerCase();
      const cmd = client.commands.get(command);
      if (!cmd) return;

      if (cmd.subCommands && args[0] && !cmd.subCommands.includes(args[0])) {
        const subCommands = cmd.subCommands.map((subCommand) =>
          inlineCode(`▪️ ${prefix}${cmd.name} ${subCommand}`)
        );
        return message.channel.send(
          `${
            client.config.emojis.cross
          } | Invalid subcommand, this command has the following sub commands : 
${subCommands.join('\n')}`
        );
      }

      cmd.run(client, message, args).catch((err) => {
        client.logger.error(err);
        message.channel.send(
          '⚠️ | An error occured while executing this command.'
        );
      });
    }
  },
};
