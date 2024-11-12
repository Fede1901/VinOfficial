
import { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from './firebase';

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
      prompt: 'select_account', 
  });
  return signInWithPopup(auth, provider);
};

export const signInWithFacebook = async () => {
  const provider = new FacebookAuthProvider();
  provider.setCustomParameters({
      redirect_uri: 'http://localhost:3000/',
      display: 'popup', 
  });
  return signInWithPopup(auth, provider);
};