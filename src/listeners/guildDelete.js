const { bold, EmbedBuilder, underscore, time } = require('discord.js');

module.exports = {
  name: 'guildDelete',
  execute: async (client, guild) => {
    const owner = await guild.fetchOwner();

    const embed = new EmbedBuilder()
      .setTitle('Left a server')
      .setThumbnail(guild.iconURL())
      .setTimestamp()
      .addFields([
        {
          name: `${underscore('Server Information :')}`,
          value: `
${bold('Name:')} ${guild.name} 
${bold('ID:')} ${guild.id} 
${bold('Members:')} ${guild.memberCount}
${bold('Created At:')} ${time(guild.createdTimestamp, 'F')} ( ${time(
            guild.createdTimestamp,
            'R'
          )} )`,
          inline: true,
        },
        {
          name: `${underscore('Owner Information :')}`,
          value: `
${bold('Owner:')} ${owner.user?.tag} 
${bold('Owner ID:')} ${owner.id}
`,
          inline: true,
        },
      ]);
    const channel = client.channels.cache.get(client.config.logChannelId);
    await channel.send({ embeds: [embed] });
  },
};
