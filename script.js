const config = window.quoteSite || {};
const quoteText = document.querySelector('#quoteText');
const quoteAuthor = document.querySelector('#quoteAuthor');

if (config.quote && quoteText) {
  quoteText.textContent = config.quote;
}

if (config.author && quoteAuthor) {
  quoteAuthor.textContent = config.author;
}

if (config.backgroundImage) {
  document.documentElement.style.setProperty(
    '--background-image',
    `url("${config.backgroundImage}")`,
  );
}
