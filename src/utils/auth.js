import { firebaseApp } from './../firebase/init';

export const signIn = async ({ email, password }) => {
  try {
    const user = await firebaseApp
      .auth()
      .signInWithEmailAndPassword(email, password);
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const signUp = async ({ name, email, password }) => {
  try {
    await firebaseApp.auth().createUserWithEmailAndPassword(email, password);
    const user = firebaseApp.auth().currentUser;
    await user.updateProfile({ displayName: name });
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const signOut = async () => {
  try {
    await firebaseApp.auth().signOut();
  } catch (error) {
    throw new Error(error.message);
  }
};
