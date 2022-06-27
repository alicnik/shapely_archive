import { User } from '@supabase/supabase-js';
import axios from 'axios';
import { useRouter } from 'next/router';
import * as React from 'react';
import { supabase } from '~/lib';

interface AuthContext {
  user: User | null;
  login: () => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = React.createContext<AuthContext | null>(null);

export function AuthProvider({ children }: React.PropsWithChildren<{}>) {
  const router = useRouter();
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const getUserProfile = async () => {
      const sessionUser = supabase.auth.user();
      if (sessionUser) {
        const { data: profile } = await supabase
          .from<User>('profile')
          .select('*')
          .eq('id', sessionUser.id)
          .single();

        setUser({
          ...sessionUser,
          ...profile,
        });
        setIsLoading(false);
      }
    };

    getUserProfile();

    supabase.auth.onAuthStateChange(getUserProfile);
  }, []);

  React.useEffect(() => {
    axios.post('/api/set-supabase-cookie', {
      event: user ? 'SIGNED_IN' : 'SIGNED_OUT',
      session: supabase.auth.session(),
    });
  }, [user]);

  // React.useEffect(() => {
  //   if (!user) {
  //     return;
  //   }
  //   const subscription = supabase
  //     .from<User>(`profile:id=eq.${user.id}`)
  //     .on('UPDATE', (payload) => {
  //       setUser({ ...user, ...payload.new });
  //     })
  //     .subscribe();

  //   return () => {
  //     supabase.removeSubscription(subscription);
  //   };
  // }, [user]);

  const login = async () => {
    await supabase.auth.signIn({
      provider: 'github',
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('You can only call `useAuth` from within an `AuthProvider`');
  }
  return context;
}
