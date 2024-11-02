import { useState, useEffect } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../lib/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setUser(user);
        setLoading(false);
      },
      (error) => {
        console.error('Auth state change error:', error);
        setError('Authentication service unavailable');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      setAuthLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Sign in error:', error);
      if (error instanceof Error) {
        switch (error.message) {
          case 'auth/invalid-email':
            setError('Invalid email address');
            break;
          case 'auth/user-disabled':
            setError('This account has been disabled');
            break;
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            setError('Invalid email or password');
            break;
          default:
            setError('Failed to sign in. Please try again');
        }
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      setAuthLoading(true);
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      setError('Failed to sign out. Please try again');
    } finally {
      setAuthLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    signIn,
    signOut,
    loading: authLoading
  };
}