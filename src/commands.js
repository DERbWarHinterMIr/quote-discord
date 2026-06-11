import {
  MessageFlags,
  PermissionFlagsBits,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from 'discord.js';
import {
  addQuote,
  deleteQuote,
  findQuote,
  listQuotes,
  randomQuote,
} from './storage.js';
import { formatQuote, truncateForDiscord } from './format.js';

const quoteCommand = new SlashCommandBuilder()
  .setName('quote')
  .setDescription('Save and retrieve quotes')
  .addSubcommand(
    new SlashCommandSubcommandBuilder()
      .setName('add')
      .setDescription('Save a quote')
      .addStringOption((option) =>
        option
          .setName('text')
          .setDescription('The quote text')
          .setRequired(true)
          .setMaxLength(1000),
      )
      .addStringOption((option) =>
        option
          .setName('author')
          .setDescription('Who said it')
          .setRequired(false)
          .setMaxLength(100),
      ),
  )
  .addSubcommand(
    new SlashCommandSubcommandBuilder()
      .setName('random')
      .setDescription('Post a random quote'),
  )
  .addSubcommand(
    new SlashCommandSubcommandBuilder()
      .setName('list')
      .setDescription('List recent quotes')
      .addIntegerOption((option) =>
        option
          .setName('limit')
          .setDescription('How many quotes to show')
          .setRequired(false)
          .setMinValue(1)
          .setMaxValue(20),
      ),
  )
  .addSubcommand(
    new SlashCommandSubcommandBuilder()
      .setName('delete')
      .setDescription('Delete a quote')
      .addIntegerOption((option) =>
        option
          .setName('id')
          .setDescription('Quote ID')
          .setRequired(true)
          .setMinValue(1),
      ),
  );

export const commandData = [quoteCommand.toJSON()];

export async function handleChatInput(interaction) {
  if (interaction.commandName !== 'quote') {
    return false;
  }

  const subcommand = interaction.options.getSubcommand();

  if (subcommand === 'add') {
    const quote = await addQuote({
      text: interaction.options.getString('text', true).trim(),
      author: interaction.options.getString('author')?.trim() || null,
      addedBy: interaction.user.id,
    });

    await interaction.reply({
      content: `Saved ${formatQuote(quote)}`,
      flags: MessageFlags.Ephemeral,
    });
    return true;
  }

  if (subcommand === 'random') {
    const quote = await randomQuote();

    await interaction.reply(quote ? formatQuote(quote) : 'No quotes saved yet.');
    return true;
  }

  if (subcommand === 'list') {
    const limit = interaction.options.getInteger('limit') ?? 10;
    const quotes = await listQuotes(limit);
    const content =
      quotes.length > 0
        ? quotes.map(formatQuote).join('\n')
        : 'No quotes saved yet.';

    await interaction.reply({
      content: truncateForDiscord(content),
      flags: MessageFlags.Ephemeral,
    });
    return true;
  }

  if (subcommand === 'delete') {
    const id = interaction.options.getInteger('id', true);
    const quote = await findQuote(id);

    if (!quote) {
      await interaction.reply({
        content: `Quote #${id} does not exist.`,
        flags: MessageFlags.Ephemeral,
      });
      return true;
    }

    const canDeleteAny = interaction.memberPermissions?.has(
      PermissionFlagsBits.ManageMessages,
    );

    if (quote.addedBy !== interaction.user.id && !canDeleteAny) {
      await interaction.reply({
        content: 'You can only delete quotes you added.',
        flags: MessageFlags.Ephemeral,
      });
      return true;
    }

    await deleteQuote(id);

    await interaction.reply({
      content: `Deleted ${formatQuote(quote)}`,
      flags: MessageFlags.Ephemeral,
    });
    return true;
  }

  return false;
}
