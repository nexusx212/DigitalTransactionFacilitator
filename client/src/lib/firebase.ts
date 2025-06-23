import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, User, connectAuthEmulator, Auth } from "firebase/auth";

// Check if Firebase configuration is available and valid
const hasValidFirebaseConfig = !!(
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID &&
  import.meta.env.VITE_FIREBASE_APP_ID &&
  import.meta.env.VITE_FIREBASE_API_KEY !== 'your-api-key-here' &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID !== 'your-project-id'
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

if (hasValidFirebaseConfig) {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };

  try {
    // Initialize Firebase
    app = initializeApp(firebaseConfig);
    
    // Initialize Firebase Authentication and get a reference to the service
    auth = getAuth(app);
  } catch (error) {
    console.warn("Firebase initialization failed:", error);
    auth = null;
  }
} else {
  console.warn("Firebase configuration missing or invalid. Authentication features will be disabled.");
}

export { auth };

// Configure for development/production
if (typeof window !== 'undefined' && auth) {
  // Development mode - use emulator if available, otherwise production
  const isDevelopment = import.meta.env.DEV;
  
  if (isDevelopment && window.location.hostname === 'localhost') {
    // Only use emulator in local development
    try {
      connectAuthEmulator(auth!, 'http://localhost:9099');
    } catch (error) {
      console.log('Firebase emulator not available, using production auth');
    }
  }
}

// Google Auth Provider with additional configuration
let googleProvider: GoogleAuthProvider | null = null;

if (hasValidFirebaseConfig) {
  googleProvider = new GoogleAuthProvider();
  googleProvider.addScope('email');
  googleProvider.addScope('profile');

  // Configure provider for better UX
  googleProvider.setCustomParameters({
    prompt: 'select_account'
  });
}

// Auth functions with error handling
export const signInWithGoogle = async () => {
  if (!auth || !googleProvider) {
    throw new Error('Firebase authentication is not configured. Please contact support.');
  }
  
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

export const logOut = () => {
  if (!auth) {
    throw new Error('Firebase authentication is not configured.');
  }
  return signOut(auth);
};

export type { User };