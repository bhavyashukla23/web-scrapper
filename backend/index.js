const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/scrape', async (req, res) => {
  const { url } = req.body;

  try {
    const domain = new URL(url).hostname.replace(/^www\./, '');
    const clearbitLogoUrl = `https://logo.clearbit.com/${domain}`;

    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const name = $('meta[property="og:site_name"]').attr('content') || $('title').text();
    const description = $('meta[name="description"]').attr('content');
    const logo = clearbitLogoUrl;

    const facebook = $('a[href*="facebook.com"]').attr('href');
    const linkedin = $('a[href*="linkedin.com"]').attr('href');
    const twitter = $('a[href*="twitter.com"]').attr('href');
    const instagram = $('a[href*="instagram.com"]').attr('href');
    const address = $('address').text().trim();
    const phone = $('a[href^="tel:"]').text();
    const email = $('a[href^="mailto:"]').text();

    res.json({
      name,
      description,
      logo,
      facebook,
      linkedin,
      twitter,
      instagram,
      address,
      phone,
      email,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to scrape the website' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
