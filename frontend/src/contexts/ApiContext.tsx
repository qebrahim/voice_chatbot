/* eslint react-refresh/only-export-components: off */
import React, { createContext, useContext} from 'react';
import type { ReactNode } from 'react';
import { ApiService } from '../services/apiService';

interface ApiContextType {
  apiService: ApiService;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};

interface ApiProviderProps {
  children: ReactNode;
}

export const ApiProvider: React.FC<ApiProviderProps> = ({ children }) => {
  const apiService = new ApiService();

  return (
    <ApiContext.Provider value={{ apiService }}>
      {children}
    </ApiContext.Provider>
  );
};