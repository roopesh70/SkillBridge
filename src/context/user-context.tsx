
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { getUserData, type UserData } from '@/lib/user-service';
import { User } from 'firebase/auth';

interface UserContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  studentProfileString: string;
  fetchUserData: () => Promise<void>;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    if (user) {
      setDataLoading(true);
      const data = await getUserData(user.uid);
      setUserData(data);
      setDataLoading(false);
    } else {
      setUserData(null);
      setDataLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const studentProfileString = userData 
    ? `Skills: ${userData.skills.join(', ')}; Experience: ${userData.experience.map(e => `${e.title} at ${e.company}`).join('; ')}; Preferences: flexible schedule, remote work.`
    : "";

  const value = {
    user,
    userData,
    loading: authLoading || dataLoading,
    studentProfileString,
    fetchUserData,
    setUserData
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
