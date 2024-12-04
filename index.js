const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const { TwitterApi } = require('twitter-api-v2');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Twitter Client Setup
const twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);

// Summarization Function (Basic)
const summarizeText = (text) => {
  const sentences = text.split('.');
  return sentences.length > 1 ? sentences.slice(0, 2).join('.') + '.' : text;
};

// Routes
// Test Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Fetch and Summarize Tweets
app.get('/api/news/:hashtag', async (req, res) => {
  const { hashtag } = req.params;

  try {
    // Fetch tweets from Twitter
    const tweets = await twitterClient.v2.search(`#${hashtag}`, { max_results: 10 });

    // Summarize tweets
    const summarizedTweets = tweets.data.map(tweet => ({
      id: tweet.id,
      original: tweet.text,
      summary: summarizeText(tweet.text),
    }));

    res.status(200).json(summarizedTweets);
  } catch (error) {
    console.error('Error fetching tweets:', error);
    res.status(500).json({ error: 'Failed to fetch tweets' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
