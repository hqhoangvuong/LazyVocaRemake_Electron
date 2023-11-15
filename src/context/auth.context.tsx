/* eslint-disable no-console */
/* eslint-disable react/jsx-no-constructed-context-values */
// AuthContext.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';
// import Store, { Schema } from 'electron-store';

interface LoginToken {
  AccessToken: string;
  TokenType: string;
  ExpiresIn: number;
  RefreshToken: string;
}

// const loginTokenSchema: Schema<LoginToken> = {
//   AccessToken: {
//     type: 'string',
//     default: '',
//   },
//   TokenType: {
//     type: 'string',
//     default: 'Bearer',
//   },
//   ExpiresIn: {
//     type: 'number',
//     minimum: 1,
//     default: -1,
//   },
//   RefreshToken: {
//     type: 'string',
//     default: '',
//   },
// };

type AuthContextType = {
  token: string | null;
  login: (newToken: string) => void;
  logout: () => void;
};

// const loginTokenStorage = new Store<LoginToken>({ schema: loginTokenSchema });

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(null);

  const login = (newToken: string) => {
    setToken(newToken);
    // console.table(loginTokenStorage.get('someObject'));
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
