import { Client, Events, GatewayIntentBits } from 'discord.js';
import { handleChatInput } from './commands.js';
import { config } from './config.js';

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) {
    return;
  }

  try {
    await handleChatInput(interaction);
  } catch (error) {
    console.error(error);

    const response = {
      content: 'Something went wrong while handling that command.',
      ephemeral: true,
    };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(response);
    } else {
      await interaction.reply(response);
    }
  }
});

await client.login(config.token);
