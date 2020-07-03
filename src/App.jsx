import React from 'react';
import Header from './components/header/Header';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from './views/Login/Login';
import Signup from './views/Signup/Signup';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import { Footer } from './components/footer/Footer';
import PrivateRoute from './hoc/PrivateRoute';
import Home from './views/Home/Home';
import { AuthProvider } from './context/Auth';
import AccountLoader from './views/AccountLoader/AccountLoader';
import { UserProvider } from './context/User';
// import {Post} from '../../components/post/Post';

const theme = createMuiTheme({
  typography: {
    htmlFontSize: 10,
  },
});

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <Router>
          <div className="root">
            <ThemeProvider theme={theme}>
              <Header />
              <Switch>
                <Route path="/login" component={Login} />
                <Route path="/signup" component={Signup} />
                <PrivateRoute exact path="/" component={Home} />
                <PrivateRoute path="/connect" component={AccountLoader} />
                <Route path="*" component={Home} />
              </Switch>
              <Footer />
            </ThemeProvider>
          </div>
        </Router>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
