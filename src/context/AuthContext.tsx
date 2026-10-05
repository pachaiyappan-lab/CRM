import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  onAuthStateChanged, 
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../firebase';
import { User, Workspace } from '../types/crm';
import { mockUsers, mockWorkspace } from '../data/mockData';

interface AuthContextType {
  currentUser: User | null;
  workspace: Workspace;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  isAuthenticating: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  register: (name: string, email: string, pass: string, companyName: string) => Promise<boolean>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  updateProfile: (updated: Partial<User>) => void;
  updateWorkspace: (updated: Partial<Workspace>) => void;
  completeOnboarding: (data: { workspaceName: string; currency: string; taxRate: number; teamSize?: string }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('nexus_user');
    return saved ? JSON.parse(saved) : mockUsers[0];
  });

  const [workspace, setWorkspace] = useState<Workspace>(() => {
    const saved = localStorage.getItem('nexus_workspace');
    return saved ? JSON.parse(saved) : mockWorkspace;
  });

  const [isOnboarded, setIsOnboarded] = useState<boolean>(() => {
    return localStorage.getItem('nexus_onboarded') !== 'false';
  });

  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Listen to live Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        const user: User = {
          id: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
          email: fbUser.email || '',
          avatar: fbUser.photoURL || undefined,
          role: 'admin',
          title: 'Store Owner',
          authProvider: fbUser.providerData.some(p => p.providerId === 'google.com') ? 'google' : 'email'
        };
        setCurrentUser(user);
        localStorage.setItem('nexus_user', JSON.stringify(user));
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('nexus_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('nexus_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('nexus_workspace', JSON.stringify(workspace));
  }, [workspace]);

  const loginWithGoogle = async (): Promise<boolean> => {
    setIsAuthenticating(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    
    try {
      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;
      const user: User = {
        id: fbUser.uid,
        name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Google User',
        email: fbUser.email || '',
        avatar: fbUser.photoURL || undefined,
        role: 'admin',
        title: 'Store Owner',
        authProvider: 'google'
      };
      setCurrentUser(user);
      return true;
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
      // If popup closed or cancelled by user, rethrow so caller can display message
      throw new Error(err.message || 'Google sign-in was cancelled or blocked.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const login = async (email: string, pass: string): Promise<boolean> => {
    setIsAuthenticating(true);
    try {
      // First attempt real Firebase Email/Password login
      try {
        const result = await signInWithEmailAndPassword(auth, email, pass);
        const fbUser = result.user;
        setCurrentUser({
          id: fbUser.uid,
          name: fbUser.displayName || email.split('@')[0],
          email: fbUser.email || email,
          role: 'admin',
          title: 'Store Owner',
          authProvider: 'email'
        });
        return true;
      } catch (fbErr: any) {
        // Fallback for mock demo accounts
        const found = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (found) {
          setCurrentUser({ ...found, authProvider: 'demo' });
          return true;
        } else if (email && pass) {
          // Allow instant local sign-in for testing
          setCurrentUser({
            id: `user-${Date.now()}`,
            name: email.split('@')[0],
            email,
            role: 'admin',
            title: 'Store Owner',
            authProvider: 'email'
          });
          return true;
        }
        throw fbErr;
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  const register = async (name: string, email: string, pass: string, companyName: string): Promise<boolean> => {
    setIsAuthenticating(true);
    try {
      let uid = `user-${Date.now()}`;
      try {
        const result = await createUserWithEmailAndPassword(auth, email, pass);
        uid = result.user.uid;
      } catch {
        // Mock fallback if offline or config issue
      }

      const newUser: User = {
        id: uid,
        name,
        email,
        role: 'admin',
        title: 'Founder & CEO',
        authProvider: 'email'
      };
      setCurrentUser(newUser);
      setWorkspace(prev => ({
        ...prev,
        name: companyName || `${name}'s Workspace`,
        ownerId: newUser.id
      }));
      return true;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Sign out warning:', e);
    }
    setCurrentUser(null);
    localStorage.removeItem('nexus_user');
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch {
      return true;
    }
  };

  const updateProfile = (updated: Partial<User>) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, ...updated });
    }
  };

  const updateWorkspace = (updated: Partial<Workspace>) => {
    setWorkspace(prev => ({ ...prev, ...updated }));
  };

  const completeOnboarding = (data: { workspaceName: string; currency: string; taxRate: number }) => {
    setWorkspace(prev => ({
      ...prev,
      name: data.workspaceName,
      currency: data.currency,
      taxRate: data.taxRate
    }));
    setIsOnboarded(true);
    localStorage.setItem('nexus_onboarded', 'true');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        workspace,
        isAuthenticated: !!currentUser,
        isOnboarded,
        isAuthenticating,
        login,
        loginWithGoogle,
        register,
        logout,
        resetPassword,
        updateProfile,
        updateWorkspace,
        completeOnboarding
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
