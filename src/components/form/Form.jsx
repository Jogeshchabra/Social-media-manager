import React, { useState, useContext } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core/styles';
import { v4 as uuid } from 'uuid';
import UploadButtons from './Upload';
import db, { firebaseApp } from '../../firebase/init';
import { request } from '../../utils/request';
import { UserContext } from '../../context/User';
import styles from './form.module.css';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

const Form = () => {
  const classes = useStyles();
  const [tweetText, setTweetText] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [fileState, setFileState] = useState({
    files: [],
  });
  const [scheduled, setScheduled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { userDetails } = useContext(UserContext);

  const handleChange = (event) => {
    setTweetText(event.target.value);
  };

  const timeChangeHandler = (event) => {
    setScheduleTime(event.target.value);
  };

  const uploadChange = (event) => {
    setFileState({
      files: event.target.files,
    });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let filename = '';
      const email = userDetails.email;
      const twConfig = userDetails.accountConnected[0].data;

      const requestBody = {
        tokenKey: twConfig.oauth_token,
        tokenSecret: twConfig.oauth_token_secret,
        text: tweetText,
      };

      const post = {
        created: Date.now(),
        isScheduled: scheduled,
        mediaUrl: filename,
        text: tweetText,
        user: email,
      };

      if (fileState.files.length) {
        filename = `${uuid()}.jpg`;
        const storage = firebaseApp.storage().ref();

        const formData = new FormData();

        formData.append('tokenKey', requestBody.tokenKey);
        formData.append('tokenSecret', requestBody.tokenSecret);
        formData.append('text', tweetText);
        formData.append('image', fileState.files[0]);

        const res = await fetch('api/twitter/postTweetMedia', {
          body: formData,
          method: 'POST',
        });

        const data = await res.json();

        if (data.success) {
          await storage.child(`images/${filename}`).put(fileState.files[0], {
            contentType: 'image/jpeg',
          });

          await db
            .collection('tweets')
            .add({ ...post, postId: data.data.id_str, mediaUrl: filename });
          resetState();
        }

        return;
      }

      const res = await request('twitter/postTweet', { body: requestBody });

      await db.collection('tweets').add({
        ...post,
        postId: res.data.id_str,
      });
      resetState();
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  function resetState() {
    setScheduleTime('');
    setFileState({ files: [] });
    setScheduled(false);
    setLoading(false);
    setTweetText('');
  }

  return (
    <div>
      {loading && <h4>Saving...</h4>}
      {error && <h4>{error}</h4>}
      <form
        onSubmit={submitForm}
        className={classes.root}
        noValidate
        autoComplete="off"
        id={styles.form}
      >
        <span className={styles.span}>
          <label className={styles.label}>Tweet Text</label>
          <TextField
            label="Tweet"
            rows={2}
            multiline
            value={tweetText}
            onChange={handleChange}
            variant="outlined"
            style={{ width: '30em' }}
          />
        </span>
        <span className={styles.span}>
          <label className={styles.label}>Media</label>
          <UploadButtons uploadChange={uploadChange} />
        </span>

        <span className={styles.span}>
          <label className={styles.label}>Want to schedule?</label>
          <Checkbox
            checked={scheduled}
            onChange={(e) => setScheduled(e.target.checked)}
          />
        </span>
        {scheduled && (
          <span className={styles.span}>
            <label className={styles.label}>Schedule Time</label>
            <TextField
              onChange={timeChangeHandler}
              id="datetime-local"
              label="Scheduled for"
              type="datetime-local"
              value={scheduleTime}
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </span>
        )}
        <Button
          variant="contained"
          color="primary"
          className={[classes.button, styles.button].join(' ')}
          endIcon={<Icon>send</Icon>}
          type="submit"
          disabled={loading}
        >
          Submit
        </Button>
      </form>
    </div>
  );
};

export default Form;
