import React, { useReducer, useEffect, useContext, useCallback } from 'react';
import UserReducer from './UserReducer';
import { AuthContext } from './Auth';
import { getUserDetails } from '../utils/data';

const initialState = {
  userDetails: null,
  loadingDetails: true,
};

export const UserContext = React.createContext();

export const UserProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);

  const [state, dispatch] = useReducer(UserReducer, initialState);

  useEffect(() => {
    if (currentUser) {
      getUserDetails(currentUser.email)
        .then((user) => {
          dispatch({ type: 'ADD_USER_DETAILS', payload: user });
        })
        .catch(() => {
          dispatch({ type: 'ADD_USER_DETAILS', payload: null });
        });
    }
  }, [currentUser]);

  const addUserDetails = useCallback((user) => {
    dispatch({ type: 'ADD_USER_DETAILS', payload: user });
  }, []);

  return (
    <UserContext.Provider
      value={{
        userDetails: state.userDetails,
        loadingDetails: state.loadingDetails,
        addUserDetails,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
