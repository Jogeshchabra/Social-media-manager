export default (state, action) => {
  switch (action.type) {
    case 'ADD_USER_DETAILS':
      return { ...state, userDetails: action.payload };
    default:
      return state;
  }
};
