const axios = require("axios");

let quoteCache = [];

/**
 * Отримує одну випадкову цитату.
 * Якщо кеш порожній — оновлює його пачкою з 10 цитат.
 */
async function getRandomQuote() {
  try {
    if (quoteCache.length === 0) {
      const res = await axios.get("https://zenquotes.io/api/quotes");
      quoteCache = res.data.map((q) => `"${q.q}" — ${q.a}`);
      console.log(`[Quotes] Cached ${quoteCache.length} quotes`);
    }

    // Вибираємо випадкову цитату
    const quote = quoteCache[Math.floor(Math.random() * quoteCache.length)];
    return quote;
  } catch (e) {
    console.error("Quote API error:", e.message);
    return "🤖 I'm thinking of something wise...";
  }
}

module.exports = { getRandomQuote };
