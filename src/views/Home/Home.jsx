import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Box,
  List,
  ListItem,
  Avatar,
  ListItemAvatar,
  ListItemText,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Loader from './../../common/Loader/Loader';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { request } from './../../utils/request';
import { UserContext } from '../../context/User';
import { AuthContext } from '../../context/Auth';
import { getUserDetails } from '../../utils/data';
import { Link } from 'react-router-dom';
import styles from './../../components/header/Header.module.css';
import logo from './../../images/logo.png';
import Form from './../../components/form/Form';
import Posts from './../../components/posts/Posts';
import Face from '@material-ui/icons/Face';
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography component={'div'}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const Home = () => {
  const { userDetails, addUserDetails } = useContext(UserContext);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    getUserDetails(currentUser.email)
      .then((user) => {
        addUserDetails(user);
      })
      .catch(() => {
        addUserDetails(null);
      });
  }, [currentUser, addUserDetails]);

  function handleConnect() {
    request('twitter/getToken', { method: 'POST' })
      .then((res) => {
        let uri = 'https://api.twitter.com/oauth/authenticate?oauth_token=';
        const oauthToken = res.data.oauth_token;
        uri += oauthToken;

        window.location.href = uri;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const drawerWidth = 200;

  const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexglow: 1,
    },
    appBar: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(3),
    },
  }));

  const classes = useStyles();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      {!userDetails ? (
        <Loader />
      ) : (
        <>
          <Drawer
            className={[classes.drawer].join(' ')}
            variant="permanent"
            classes={{
              paper: classes.drawerPaper,
            }}
            anchor="left"
          >
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="calc(100vh - 210px)"
            >
              <div style={{ position: 'absolute', top: '5px' }}>
                <Link to="/" className={styles.brand}>
                  <img
                    src={logo}
                    alt="brand logo"
                    className={styles.brandImg}
                  />
                </Link>
              </div>

              {userDetails.accountConnected.length ? (
                <List>
                  {userDetails.accountConnected.map((account) => {
                    return (
                      <ListItem key={account.config}>
                        <ListItemAvatar>
                          <Avatar>
                            <Face />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={account.data.screen_name}
                          secondary={account.config}
                        />
                      </ListItem>
                    );
                  })}
                </List>
              ) : (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleConnect}
                >
                  Connect Twitter
                </Button>
              )}
            </Box>
          </Drawer>
          <div style={{ maxWidth: '90vw', marginLeft: '200px' }}>
            <Paper className={classes.root}>
              <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                centered
              >
                <Tab label="Create"></Tab>
                <Tab label="Scheduled" />
                <Tab label="Posts" />
              </Tabs>
            </Paper>
            <TabPanel value={value} index={0}>
              <Form />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <Posts />
            </TabPanel>
          </div>
        </>
      )}
    </>
  );
};

export default Home;
