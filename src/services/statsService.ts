import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export type HistoryData = Record<string, number>;

export interface UserStats {
  history: HistoryData;
  isPremium: boolean;
}

export const statsService = {
  // Real-time listener
  subscribeToUserData(userId: string, callback: (data: UserStats) => void) {
    if (!db) return () => {};
    const docRef = doc(db, 'users', userId);
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        callback({
          history: (data.history as HistoryData) || {},
          isPremium: !!data.isPremium
        });
      } else {
        callback({ history: {}, isPremium: false });
      }
    });
  },

  async fetchUserData(userId: string): Promise<UserStats> {
    if (!db) return { history: {}, isPremium: false };
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          history: (data.history as HistoryData) || {},
          isPremium: !!data.isPremium
        };
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
    return { history: {}, isPremium: false };
  },

  async saveHistory(userId: string, history: HistoryData): Promise<void> {
    if (!db) return;
    try {
      const docRef = doc(db, 'users', userId);
      await setDoc(docRef, { history }, { merge: true });
    } catch (error) {
      console.error("Error saving history:", error);
    }
  },

  async deleteUserData(userId: string): Promise<void> {
    if (!db) return;
    try {
      const { deleteDoc } = await import('firebase/firestore');
      const docRef = doc(db, 'users', userId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting user data:", error);
      throw error;
    }
  }
};
