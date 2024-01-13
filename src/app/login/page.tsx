'use client';

import React, {useEffect} from 'react'
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { useRouter } from 'next/navigation';
import firebase from 'firebase/compat/app';

const firebaseConfig = {
  apiKey: 'AIzaSyD7HtipS9Gz2WEjInP-6oKTfWR-2zcMxy4',
  authDomain: 'historia-clinica-v1.firebaseapp.com',
  projectId: 'historia-clinica-v1',
  storageBucket: 'historia-clinica-v1.appspot.com',
  messagingSenderId: '865812318203',
  appId: '1:865812318203:web:758f2bcb767fff964f6d5e',
};

// Initialize firebase and google provider
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });


// Sign in and sign out functions
const signIn = async (): Promise<firebase.auth.UserCredential> => auth.signInWithPopup(provider);
const signOut = async (): Promise<any> => auth.signOut();
const getCurrentUser = async (): Promise<firebase.User | null> => auth.currentUser;

const LoginScreen = () => {

  const { push } = useRouter();

  useEffect(() => {

    return firebase.auth().onAuthStateChanged(async (newGoogleUser) => {
      push('/chat');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>
    <button onClick={signIn}>
      Sign in with Google
    </button>
  </>
}

export default LoginScreen
