import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, '..', 'data');
const quotesPath = path.join(dataDir, 'quotes.json');

async function ensureDataDir() {
  await mkdir(dataDir, { recursive: true });
}

async function readQuotes() {
  await ensureDataDir();

  try {
    const raw = await readFile(quotesPath, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }

    throw error;
  }
}

async function writeQuotes(quotes) {
  await ensureDataDir();

  const tempPath = `${quotesPath}.tmp`;
  await writeFile(tempPath, `${JSON.stringify(quotes, null, 2)}\n`, 'utf8');
  await rename(tempPath, quotesPath);
}

export async function addQuote({ text, author, addedBy }) {
  const quotes = await readQuotes();
  const nextId = quotes.reduce((max, quote) => Math.max(max, quote.id), 0) + 1;
  const quote = {
    id: nextId,
    text,
    author: author || null,
    addedBy,
    createdAt: new Date().toISOString(),
  };

  quotes.push(quote);
  await writeQuotes(quotes);
  return quote;
}

export async function listQuotes(limit = 10) {
  const quotes = await readQuotes();
  return quotes.slice(-limit).reverse();
}

export async function randomQuote() {
  const quotes = await readQuotes();

  if (quotes.length === 0) {
    return null;
  }

  return quotes[Math.floor(Math.random() * quotes.length)];
}

export async function findQuote(id) {
  const quotes = await readQuotes();
  return quotes.find((item) => item.id === id) || null;
}

export async function deleteQuote(id) {
  const quotes = await readQuotes();
  const quote = quotes.find((item) => item.id === id);

  if (!quote) {
    return null;
  }

  await writeQuotes(quotes.filter((item) => item.id !== id));
  return quote;
}
