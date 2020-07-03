import React, { useState, useEffect } from 'react';
import { CardMedia, makeStyles } from '@material-ui/core';
import { firebaseApp } from '../../firebase/init';

const useStyles = makeStyles({
  media: {
    height: 200,
    margin: 15,
    borderRadius: 6,
  },
});

export const PostImage = ({ mediaUrl }) => {
  const classes = useStyles();

  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (mediaUrl) {
      const storageRef = firebaseApp.storage().ref();

      storageRef
        .child(`images/${mediaUrl}`)
        .getDownloadURL()
        .then((url) => {
          setImageUrl(url);
        })
        .catch((err) => {
          console.log(err);
          setImageUrl('//via.placeholder.com/200');
        });
    }
  }, [mediaUrl]);

  if (!mediaUrl || !imageUrl) {
    return (
      <CardMedia
        className={classes.media}
        image={require('./../../images/no-image.jpg')}
        title="Contemplative Reptile"
      />
    );
  }
  return (
    <CardMedia
      className={classes.media}
      image={imageUrl}
      title="Contemplative Reptile"
    />
  );
};
