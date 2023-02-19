const { Schema, model } = require('mongoose');

const guild = new Schema({
  guildId: String,
  prefix: String,
  channelIds: [String],
});

module.exports = model('guild_config', guild);
