import db from './../firebase/init';

export const getUserDetails = async (email) => {
  try {
    const snapshot = await db
      .collection('users')
      .where('email', '==', email)
      .get();
    const users = snapshot.docs.map((d) => ({ ...d.data(), id: d.id }));
    return users[0];
  } catch (error) {
    return [];
  }
};

export const createUserDetails = async (user) => {
  try {
    await db.collection('users').add(user);
    return true;
  } catch (error) {
    return error;
  }
};

export const setUserDetails = async (id, user) => {
  try {
    await db.collection('users').doc(id).update(user);
    return true;
  } catch (error) {
    return error;
  }
};

export const getAllPostedTweets = async (user) => {
  try {
    const snapshot = await db
      .collection('tweets')
      .where('user', '==', user)
      .where('isScheduled', '==', false)
      .orderBy('created', 'desc')
      .get();

    const tweets = snapshot.docs.map((d) => {
      return { ...d.data(), id: d.id };
    });
    return tweets;
  } catch (error) {
    return error;
  }
};

export const deleteTweet = async (id) => {
  try {
    await db.collection('tweets').doc(id).delete();
    return true;
  } catch (error) {
    return error;
  }
};
