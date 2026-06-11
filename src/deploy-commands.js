import { REST, Routes } from 'discord.js';
import { commandData } from './commands.js';
import { config } from './config.js';

const rest = new REST({ version: '10' }).setToken(config.token);
const route = config.guildId
  ? Routes.applicationGuildCommands(config.clientId, config.guildId)
  : Routes.applicationCommands(config.clientId);

await rest.put(route, { body: commandData });

const target = config.guildId
  ? `guild ${config.guildId}`
  : 'global Discord command registry';

console.log(`Registered ${commandData.length} command group with ${target}.`);
