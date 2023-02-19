const {
  EmbedBuilder,
  hyperlink,
  PermissionFlagsBits,
  OAuth2Scopes,
} = require('discord.js');

module.exports = {
  name: 'invite',
  description: 'Invite the bot.',
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

    const invite = client.generateInvite({
      scopes: [OAuth2Scopes.Bot],
      permissions: [
        PermissionFlagsBits.EmbedLinks,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.ReadMessageHistory,
        PermissionFlagsBits.ViewChannel,
      ],
    });

    const embed = new EmbedBuilder()
      .setTitle(`Invite ${client.user.username}`)
      .setDescription(
        `${hyperlink('Click here', invite)} to add me to any of your servers.`
      )
      .setColor('Blurple')
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};
