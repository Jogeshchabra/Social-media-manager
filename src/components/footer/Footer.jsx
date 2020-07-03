import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Link } from '@material-ui/core';

function Copyright() {
  return (
    <Typography variant="body1" color="textSecondary">
      {'Copyright © '}
      <Link color="inherit" href="#">
        LinkD
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  footer: {
    padding: theme.spacing(5, 3),
    marginTop: 'auto',
    backgroundColor: theme.palette.grey[0],
    textAlign: 'center',
  },
}));

export const Footer = () => {
  const muiClasses = useStyles();

  return (
    <footer className={muiClasses.footer}>
      <Container maxWidth="sm">
        <Copyright />
      </Container>
    </footer>
  );
};
