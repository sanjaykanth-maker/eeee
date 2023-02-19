const { readdirSync } = require('node:fs');
const {
  Client,
  Collection,
  GatewayIntentBits,
  Options,
} = require('discord.js');
const { createServer } = require('node:http');
const client = new Client({
  allowedMentions: {
    repliedUser: false,
  },
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  failIfNotExists: true,
  makeCache: Options.cacheWithLimits({
    ApplicationCommandManager: 0,
    BaseGuildEmojiManager: 0,
    GuildBanManager: 0,
    GuildInviteManager: 0,
    GuildStickerManager: 0,
    GuildScheduledEventManager: 0,
    PresenceManager: 0,
    ReactionManager: 0,
    ReactionUserManager: 0,
    StageInstanceManager: 0,
    VoiceStateManager: 0,
  }),
});
client.commands = new Collection();
client.config = require('./config');
client.logger = require('./logger');
const mongo = require('./mongo');
require('dotenv').config();

const server = createServer((req, res) => {
  res.writeHead(200).end('Express server is running.');
});

server.listen(3000, () => {
  client.logger.info('App listening on port 3000.');
});

client.rest.on('rateLimited', async (ratelimitData) => {
  client.logger.warn(ratelimitData);
});

readdirSync('./src/listeners/').map((file) => {
  const event = require(`../src/listeners/${file}`);
  client.logger.info(`Event : Loaded ${event.name}`);
  client.on(event.name, (...args) => event.execute(client, ...args));
});

readdirSync('./src/commands/').map((dir) => {
  const commandFiles = readdirSync(`./src/commands/${dir}/`).filter((file) =>
    file.endsWith('.js')
  );
  for (const file of commandFiles) {
    const command = require(`../src/commands/${dir}/${file}`);
    client.logger.info(`Command : Loaded ${command.name}`);
    client.commands.set(command.name, command);
  }
});

process.on('unhandledRejection', (reason, promise) => {
  console.log(reason, promise);
});

process.on('uncaughtException', (err, origin) => {
  console.log(err, origin);
});

process.on('uncaughtExceptionMonitor', (err, origin) => {
  console.log(err, origin);
});

mongo.init();
client.login("MTA0NjM2MTU2NjgwODkxNjAxOQ.GiFcyG.s0YOPlwz4V_2m2LwFB8gMcEHISZUYKk76sORbM");
