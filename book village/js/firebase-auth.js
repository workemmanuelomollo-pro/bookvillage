import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import {
  GoogleAuthProvider,
  browserLocalPersistence,
  getAuth,
  getRedirectResult,
  onAuthStateChanged,
  setPersistence,
  signInWithRedirect,
  signOut
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';

const firebaseConfig = {
  apiKey: 'AIzaSyDG5CnWZ_4JunkxDLnwCJHj5mmz-s4Wrg',
  authDomain: 'book-village-756ef.firebaseapp.com',
  projectId: 'book-village-756ef',
  storageBucket: 'book-village-756ef.firebasestorage.app',
  messagingSenderId: '167263508549',
  appId: '1:167263508549:web:4ee16ae1b18790e0ae6b2c'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
let resolveAuthState;

const authStateReady = new Promise(function (resolve) {
  resolveAuthState = resolve;
});

const redirectResult = getRedirectResult(auth).then(
  function (result) {
    return { result: result };
  },
  function (error) {
    return { error: error };
  }
);

onAuthStateChanged(
  auth,
  function (user) {
    resolveAuthState(user);
    window.dispatchEvent(new CustomEvent('book-village-firebase-auth', {
      detail: user
    }));
  },
  function (error) {
    window.dispatchEvent(new CustomEvent('book-village-firebase-error', {
      detail: error
    }));
  }
);

window.bookVillageFirebase = {
  ready: authStateReady,
  redirectResult: redirectResult,
  signInWithGoogle: function () {
    return setPersistence(auth, browserLocalPersistence).then(function () {
      return signInWithRedirect(auth, provider);
    });
  },
  signOut: function () {
    return signOut(auth);
  }
};
