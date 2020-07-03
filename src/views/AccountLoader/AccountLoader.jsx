import React, { useEffect, useContext } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Box } from '@material-ui/core';
import { request } from '../../utils/request';
import { setUserDetails } from './../../utils/data';
import { UserContext } from '../../context/User';

const AccountLoader = ({ location, history }) => {
  const { userDetails } = useContext(UserContext);

  useEffect(() => {
    const search = location.search;
    const params = new URLSearchParams(search);
    const oauth_verifier = params.get('oauth_verifier');
    const oauth_token = params.get('oauth_token');
    const requestBody = { oauth_verifier, oauth_token };

    if (userDetails) {
      request('twitter/getAccessToken', { body: requestBody })
        .then((res) => {
          const accountConnected = [
            {
              config: 'twitter',
              data: res.data,
            },
          ];

          const user = {
            email: userDetails.email,
            accountConnected,
          };

          setUserDetails(userDetails.id, user)
            .then(() => {
              history.push('/');
            })
            .catch(() => {
              alert('Could not connect your twitter account.');
              history.push('/');
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [userDetails, location, history]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      style={{ height: 'calc(100vh - 210px)' }}
    >
      <div>
        Dont hit reload or close the browser! Saving information related to the
        account.
      </div>
      <CircularProgress disableShrink />
    </Box>
  );
};

export default AccountLoader;
