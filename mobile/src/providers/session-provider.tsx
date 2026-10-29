import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react';
import { sessionStorage } from '@/storage/session';

interface SessionContextValue {
  userId: string | null;
  signIn: (userId: string) => void;
  signOut: () => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: PropsWithChildren) {
  const [userId, setUserId] = useState<string | null>(() => sessionStorage.getUserId());

  const signIn = useCallback((id: string) => {
    sessionStorage.setUserId(id);
    setUserId(id);
  }, []);

  const signOut = useCallback(() => {
    sessionStorage.clear();
    setUserId(null);
  }, []);

  const value = useMemo(() => ({ userId, signIn, signOut }), [userId, signIn, signOut]);
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) throw new Error('useSession precisa estar dentro de <SessionProvider>');
  return context;
}
