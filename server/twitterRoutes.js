const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  getRequestToken,
  getAccessToken,
  getUserCreatedTweets,
  postStatus,
  postStatusWithMedia,
  deleteTweet,
} = require('./twitterController');

const upload = multer({ dest: 'uploads/' });

router.post('/getToken', getRequestToken);
router.post('/getAccessToken', getAccessToken);
router.post('/getUserTweets', getUserCreatedTweets);
router.post('/postTweet', postStatus);
router.post('/postTweetMedia', upload.single('image'), postStatusWithMedia);
router.post('/deleteTweet', deleteTweet);

module.exports = router;
