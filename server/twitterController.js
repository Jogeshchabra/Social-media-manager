const Twitter = require('twitter-lite');
const config = require('./config');
const fs = require('fs');

const client = new Twitter({
  consumer_key: config.consumerKey,
  consumer_secret: config.consumerSecret,
});

exports.getRequestToken = async (req, res, next) => {
  try {
    const data = await client.getRequestToken(config.callBackurl);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

exports.getAccessToken = async (req, res, next) => {
  try {
    const oauthVerifier = req.body.oauth_verifier;
    const oauthToken = req.body.oauth_token;
    const data = await client.getAccessToken({
      oauth_verifier: oauthVerifier,
      oauth_token: oauthToken,
    });

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

exports.getUserCreatedTweets = async (req, res, next) => {
  try {
    const twClient = new Twitter({
      consumer_key: config.consumerKey,
      consumer_secret: config.consumerSecret,
      access_token_key: req.body.tokenKey,
      access_token_secret: req.body.tokenSecret,
    });

    const count = req.body.count || 10;

    const tweets = await twClient.get('statuses/user_timeline', {
      user_id: req.body.userId,
      count,
    });

    res.json({
      success: true,
      data: tweets,
      length: tweets.length,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      success: false,
    });
  }
};

exports.postStatus = async (req, res, next) => {
  try {
    const twClient = new Twitter({
      consumer_key: config.consumerKey,
      consumer_secret: config.consumerSecret,
      access_token_key: req.body.tokenKey,
      access_token_secret: req.body.tokenSecret,
    });

    const status = await twClient.post('statuses/update', {
      status: req.body.text,
      trim_user: true,
    });

    res.status(201).json({
      success: true,
      data: status,
    });
  } catch (error) {
    res.status(500).json({
      error: error,
      success: false,
    });
  }
};

exports.postStatusWithMedia = async (req, res, next) => {
  try {
    const client = {
      consumer_key: config.consumerKey,
      consumer_secret: config.consumerSecret,
      access_token_key: req.body.tokenKey,
      access_token_secret: req.body.tokenSecret,
    };

    const uplClient = new Twitter({
      subdomain: 'upload',
      ...client,
    });

    const twClient = new Twitter(client);

    const media_data = fs.readFileSync(req.file.path, { encoding: 'base64' });

    const mediaId = await uplClient.post('media/upload', { media_data });

    const status = await twClient.post('statuses/update', {
      status: req.body.text,
      trim_user: true,
      media_ids: mediaId.media_id_string,
    });

    res.status(201).json({
      success: true,
      data: status,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error,
      success: false,
    });
  }
};

exports.deleteTweet = async (req, res, next) => {
  try {
    const twClient = new Twitter({
      consumer_key: config.consumerKey,
      consumer_secret: config.consumerSecret,
      access_token_key: req.body.tokenKey,
      access_token_secret: req.body.tokenSecret,
    });

    await twClient.post('statuses/destroy', {
      id: req.body.id,
      trim_user: true,
    });

    res.status(200).json({ success: true, message: 'Tweet Deleted' });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error,
      success: false,
    });
  }
};
