import React, { useContext, useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { deleteTweet, getAllPostedTweets } from '../../utils/data';
import styles from './Post.module.css';
import { UserContext } from '../../context/User';
import { PostImage } from '../post-image/PostImage';
import { Button } from '@material-ui/core';
import { request } from '../../utils/request';

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    margin: 15,
  },
});

const Posts = () => {
  const { userDetails } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getAllPostedTweets(userDetails.email)
      .then((tweets) => {
        setPosts(tweets);
      })
      .catch((err) => {
        setPosts([]);
      });
  }, [userDetails.email]);

  const classes = useStyles();

  const handlePostDelete = async (postId, docId) => {
    try {
      setDeleting(true);
      const twConfig = userDetails.accountConnected[0].data;
      const requestBody = {
        tokenKey: twConfig.oauth_token,
        tokenSecret: twConfig.oauth_token_secret,
        id: postId,
      };
      await request('twitter/deleteTweet', { body: requestBody });
      const del = await deleteTweet(docId);

      if (del) {
        const newTweets = posts.filter((p) => p.id !== docId);
        setPosts(newTweets);
        setDeleting(false);
      }
    } catch (err) {
      alert('Could not delete Tweet');
      setDeleting(false);
    }
  };

  return posts.map((post) => (
    <div className={styles.container} key={post.id}>
      <Card className={classes.root}>
        <CardActionArea>
          <PostImage mediaUrl={post.mediaUrl} />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {post.text}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {post.description}
            </Typography>
          </CardContent>
        </CardActionArea>

        <CardActions>
          <Button
            variant="contained"
            className={styles.dangerBtn}
            onClick={() => handlePostDelete(post.postId, post.id)}
            disabled={deleting}
          >
            Delete
          </Button>
        </CardActions>
      </Card>
    </div>
  ));
};

export default Posts;
