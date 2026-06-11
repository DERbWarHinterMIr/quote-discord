# quote-discord

A static GitHub Pages quote website with a dark, image-backed design.

## Edit The Quote

Change the text in `site.config.js`:

```js
window.quoteSite = {
  quote: 'Your quote here.',
  author: 'Author name',
  backgroundImage: 'assets/background.png',
};
```

To use your own background, put the image in `assets/` and update `backgroundImage`.

## GitHub Pages

In the repository settings on GitHub:

1. Open **Settings**.
2. Open **Pages**.
3. Set **Source** to **Deploy from a branch**.
4. Choose branch **main** and folder **/**.
5. Save.
