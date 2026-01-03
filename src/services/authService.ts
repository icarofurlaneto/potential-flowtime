import { 
  signInWithPopup, 
  signOut, 
  sendSignInLinkToEmail, 
  GoogleAuthProvider, 
  User,
  onAuthStateChanged,
  Unsubscribe
} from "firebase/auth";
import { auth } from "../firebase";

const googleProvider = new GoogleAuthProvider();

export const authService = {
  async loginWithGoogle(): Promise<void> {
    if (!auth) throw new Error("Firebase not configured");
    await signInWithPopup(auth, googleProvider);
  },

  async logout(): Promise<void> {
    if (!auth) return;
    await signOut(auth);
  },

  async deleteUserAccount(): Promise<void> {
    const user = auth?.currentUser;
    if (!user) throw new Error("No user logged in");
    await user.delete();
  },

  async sendActivationLink(email: string): Promise<void> {
    if (!auth) throw new Error("Firebase not configured");
    const actionCodeSettings = {
      url: window.location.origin + '/finish-signup',
      handleCodeInApp: true,
    };
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
  },

  subscribeToAuthChanges(callback: (user: User | null) => void): Unsubscribe | undefined {
    if (!auth) return undefined;
    return onAuthStateChanged(auth, callback);
  }
};
