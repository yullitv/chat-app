const axios = require('axios');
async function getRandomQuote() {
try {
const res = await axios.get('https://api.quotable.io/random');
return `${res.data.content} — ${res.data.author}`;
} catch (e) {
return 'Here is a quote for you.';
}
}
module.exports = { getRandomQuote };