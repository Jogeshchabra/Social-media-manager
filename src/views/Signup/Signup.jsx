import React, { useState } from 'react';
import Container from '@material-ui/core/Container';
import {
  Typography,
  CssBaseline,
  Grid,
  TextField,
  Button,
  Link,
  makeStyles,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import classes from './../../common/styles/start-forms.module.css';
import { Link as rLink } from 'react-router-dom';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { signUp } from '../../utils/auth';
import { createUserDetails } from '../../utils/data';

const useStyles = makeStyles((theme) => ({
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Signup = ({ history }) => {
  const muiClasses = useStyles();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  async function handleSignUp(e) {
    try {
      e.preventDefault();

      if (!email || !password || !name) {
        return setError('All fields are required');
      }

      setIsLoading(true);
      // do signup
      const user = { name, email, password };
      await signUp(user);
      const details = { email, accountConnected: [] };
      await createUserDetails(details);
      setIsLoading(false);
      history.push('/');
    } catch (error) {
      setError(error);
      setIsLoading(false);
    }
  }

  return (
    <Container maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h4">
          Getting Started
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}

        <form noValidate className={classes.form} onSubmit={handleSignUp}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                autoComplete="name"
                name="name"
                variant="outlined"
                required
                fullWidth
                id="name"
                label="Full Name"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel htmlFor="password">Password</InputLabel>
                <OutlinedInput
                  required
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                  labelWidth={100}
                />
              </FormControl>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            className={muiClasses.submit}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress /> : 'Sign Up'}
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link component={rLink} to="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export default Signup;
