import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, User, connectAuthEmulator } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Configure for development/production
if (typeof window !== 'undefined') {
  // Development mode - use emulator if available, otherwise production
  const isDevelopment = import.meta.env.DEV;
  
  if (isDevelopment && window.location.hostname === 'localhost') {
    // Only use emulator in local development
    try {
      connectAuthEmulator(auth, 'http://localhost:9099');
    } catch (error) {
      console.log('Firebase emulator not available, using production auth');
    }
  }
}

// Google Auth Provider with additional configuration
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Configure provider for better UX
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Auth functions with error handling
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } catch (error: any) {
    console.error('Firebase auth error:', error);
    
    // Handle specific Firebase errors
    if (error.code === 'auth/unauthorized-domain') {
      throw new Error('Domain not authorized. Please contact support to add this domain to Firebase.');
    } else if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign-in cancelled by user.');
    } else if (error.code === 'auth/popup-blocked') {
      throw new Error('Popup blocked. Please allow popups for this site.');
    } else {
      throw new Error('Authentication failed. Please try again.');
    }
  }
};

export const logOut = () => signOut(auth);

export type { User };