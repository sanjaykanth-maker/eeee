const { inlineCode } = require('discord.js');

module.exports = {
  name: 'ping',
  description: 'Shows the ping of the bot.',
  run: async (client, message) => {
    const response = await message.channel.send('🏓 | Pinging...');

    await response.edit(
      `🏓 | Pong! Websocket heartbeat : ${inlineCode(
        client.ws.ping
      )}ms, Roundtrip latency : ${inlineCode(
        response.createdTimestamp - message.createdTimestamp
      )}ms.`
    );
  },
};
