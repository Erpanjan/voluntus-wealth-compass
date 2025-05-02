
import { useState } from 'react';
import { User, Session } from '@supabase/supabase-js';

export const useAuthState = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  return {
    session,
    setSession,
    user,
    setUser,
    loading,
    setLoading,
    isAdmin,
    setIsAdmin
  };
};
