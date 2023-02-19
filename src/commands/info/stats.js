const {
  bold,
  EmbedBuilder,
  version,
  time,
  TimestampStyles,
} = require('discord.js');
const { cpus } = require('node:os');

module.exports = {
  name: 'stats',
  description: 'Shows some statistics about the bot.',
  run: async (client, message) => {
    if (!message.guild.members.me.permissions.has('EmbedLinks')) {
      return message.channel.send(
        `${client.config.emojis.cross} | I need Embed links permission to execute this command.`
      );
    }

    if (
      !message.guild.members.me.permissionsIn(message.channel).has('EmbedLinks')
    ) {
      return message.channel.send(
        `${client.config.emojis.cross} | I need Embed links permission to execute this command.`
      );
    }

    const { heapUsed, heapTotal, rss } = process.memoryUsage();

    const embed = new EmbedBuilder().setColor('Blurple').addFields([
      {
        name: `${client.user.username} statistics`,
        value: `
${bold('Servers')}: ${client.guilds.cache.size}
${bold('Channels')} : ${client.channels.cache.size}
${bold('Members')} : ${client.guilds.cache.reduce(
          (acc, val) => acc + val.memberCount,
          0
        )}
${bold('Discord.js')} : v${version}
${bold('Node.js')} : ${process.version}
${bold('Uptime')} : ${time(
          Math.round((Date.now() - client.uptime) / 1000),
          TimestampStyles.RelativeTime
        )}
${bold('Total heap')} : ${(heapTotal / 1024 / 1024).toFixed(2)}MB
${bold('Heap used')} : ${(heapUsed / 1024 / 1024).toFixed(2)}MB
${bold('RSS')}: ${(rss / 1024 / 1024).toFixed(2)}MB
${bold('CPU Load')} : ${cpus()
          .map((c) => {
            const { user, nice, irq, sys, idle } = c.times;
            return (
              ((((user + nice + sys + irq) / idle) * 10000) / 100).toFixed(2) +
              '%'
            );
          })
          .join(' | ')}
${bold('Developer')}: ${client.application.owner.tag} (ID : ${
          client.application.owner.id
        })`,
      },
    ]);

    message.channel.send({ embeds: [embed] });
  },
};
