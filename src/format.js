export function formatQuote(quote) {
  const author = quote.author ? ` - ${quote.author}` : '';
  return `#${quote.id}: "${quote.text}"${author}`;
}

export function truncateForDiscord(value, maxLength = 1900) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 3)}...`;
}
