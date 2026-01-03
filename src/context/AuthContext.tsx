import { useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';
import { statsService } from '../services/statsService';
import { auth } from '../firebase';
import { AuthContext } from './AuthContextObject';
import { User } from 'firebase/auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(!!auth);

  useEffect(() => {
    const unsubscribe = authService.subscribeToAuthChanges((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe && unsubscribe();
  }, []);

  const handleLoginWithGoogle = async () => {
    try { await authService.loginWithGoogle(); } catch (error) { console.error("Google login failed:", error); }
  };

  const handleLogout = async () => { try { await authService.logout(); } catch (error) { console.error("Logout failed:", error); } };

  const handleDeleteAccount = async () => {
    if (!user) return;
    if (!confirm("Are you sure you want to delete your account? This action is permanent and all focus history will be lost.")) return;

    try {
      // 1. Delete data from Firestore first (while authenticated)
      await statsService.deleteUserData(user.uid);
      // 2. Delete the account from Firebase Auth
      await authService.deleteUserAccount();
      // 3. Clear local state
      setUser(null);
      alert("Account deleted successfully.");
    } catch (error: any) {
      console.error("Delete account failed:", error);
      if (error.code === 'auth/requires-recent-login') {
        alert("For security reasons, you must re-login before deleting your account.");
        await handleLogout();
      } else {
        alert("Failed to delete account. Please try again later.");
      }
    }
  };

  const handleEmailSignup = async (email: string) => {
    try {
      await authService.sendActivationLink(email);
      window.localStorage.setItem('emailForSignIn', email);
    } catch (error) {
      console.error("Email signup failed:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      loginWithGoogle: handleLoginWithGoogle,
      logout: handleLogout,
      deleteAccount: handleDeleteAccount,
      handleEmailSignup
    }}>
      {children}
    </AuthContext.Provider>
  );
}