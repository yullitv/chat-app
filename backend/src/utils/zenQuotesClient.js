const axios = require('axios');

async function getRandomQuote() {
  try {
    const res = await axios.get('https://zenquotes.io/api/random');
    // API повертає масив з одним об’єктом [{ q: "цитата", a: "автор" }]
    const quote = res.data[0];
    return `"${quote.q}" — ${quote.a}`;
  } catch (e) {
    console.error('Quote API error:', e.message);
    return 'Sorry, no quote available right now.';
  }
}

module.exports = { getRandomQuote };
