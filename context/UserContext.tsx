// context/UserContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { RoleEnum, Users } from '@/types/role';

type UserContextType = {
  user: Users | null;
  setUser: (user: Users | null) => void;
  switchRole: (role: RoleEnum) => void;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  switchRole: () => {},
});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState<Users | null>(null);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const userData = await getUserFromToken(); // ambil dari token (cookie)
        if (userData) setUser(userData);
      } catch (err) {
        console.error('Failed to initialize user', err);
      }
    };

    initializeUser();
  }, []);


  const switchRole = (role: RoleEnum) => {
    if (user?.roles.includes(role)) {
      setUser(prev => prev ? { ...prev, activeRole: role } : null);
    }
  };
  
  return (
    <UserContext.Provider value={{ user, setUser, switchRole }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
