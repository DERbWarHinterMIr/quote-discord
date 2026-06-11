# quote-discord

A small Discord slash-command bot for saving and retrieving quotes.

## Requirements

- Node.js 20 or newer
- A Discord application and bot token

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in:

   ```env
   DISCORD_TOKEN=...
   CLIENT_ID=...
   GUILD_ID=...
   ```

3. Register slash commands:

   ```bash
   npm run deploy
   ```

4. Start the bot:

   ```bash
   npm start
   ```

## Commands

- `/quote add text:<quote> author:<optional>` saves a quote.
- `/quote random` posts a random quote.
- `/quote list` lists recent quotes.
- `/quote delete id:<id>` deletes a quote you added. Users with Manage Messages can delete any quote.

Quotes are stored in `data/quotes.json`, which is intentionally ignored by Git.
