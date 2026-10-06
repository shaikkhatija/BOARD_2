import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

const STORAGE_SESSION_KEY = 'board_dashboard_user';
const STORAGE_USERS_KEY = 'board_registered_users';

// Pre-seeded default registered accounts
const DEFAULT_REGISTERED_USERS = [
  {
    id: 'usr-default-1',
    name: 'SHerishma',
    email: 'sherishma@gmail.com',
    password: 'password123',
    provider: 'google',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'usr-default-2',
    name: 'Demo User',
    email: 'demo.user@board.io',
    password: 'demo123',
    provider: 'credentials',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'usr-default-3',
    name: 'Alex Taylor',
    email: 'alex.product@gmail.com',
    password: 'alex2026',
    provider: 'google',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // isLoading is ONLY for initial session verification on page load
  // Never toggle isLoading during form submissions to prevent unmounting/refreshing screens
  const [isLoading, setIsLoading] = useState(true);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  // Helper to retrieve all registered users from localStorage
  const getRegisteredUsers = () => {
    try {
      const stored = localStorage.getItem(STORAGE_USERS_KEY);
      if (stored) {
        let parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Check if SHerishma is in the list; if not, migrate or add
          const hasSherishma = parsed.some(
            (u) => u.email.toLowerCase() === 'sherishma@gmail.com' || u.name === 'SHerishma'
          );
          if (!hasSherishma) {
            const oldIndex = parsed.findIndex(
              (u) => u.email.toLowerCase() === 'tnithinbabu@gmail.com' || u.name?.includes('Nithin')
            );
            if (oldIndex !== -1) {
              parsed[oldIndex] = {
                ...parsed[oldIndex],
                name: 'SHerishma',
                email: 'sherishma@gmail.com',
                password: parsed[oldIndex].password || 'password123',
              };
            } else {
              parsed.unshift({
                id: 'usr-default-1',
                name: 'SHerishma',
                email: 'sherishma@gmail.com',
                password: 'password123',
                provider: 'credentials',
                createdAt: new Date().toISOString(),
              });
            }
            localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(parsed));
          }
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error reading registered users', e);
    }
    // Initialize default registry
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(DEFAULT_REGISTERED_USERS));
    return DEFAULT_REGISTERED_USERS;
  };

  // Helper to persist registered users list
  const saveRegisteredUsersList = (usersList) => {
    try {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(usersList));
    } catch (e) {
      console.error('Error saving registered users', e);
    }
  };

  useEffect(() => {
    // 1. Ensure registered users registry is seeded
    getRegisteredUsers();

    // 2. Check saved session on startup
    try {
      const stored = localStorage.getItem(STORAGE_SESSION_KEY);
      if (stored) {
        let sessionUser = JSON.parse(stored);
        // If current session belongs to the old Nithin demo user, update to SHerishma
        if (sessionUser.email === 'tnithinbabu@gmail.com' || sessionUser.name?.includes('Nithin')) {
          sessionUser = {
            ...sessionUser,
            name: 'SHerishma',
            email: 'sherishma@gmail.com',
          };
          localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(sessionUser));
        }

        const allUsers = getRegisteredUsers();
        const verified = allUsers.find(
          (u) => u.email.toLowerCase() === sessionUser.email.toLowerCase()
        );
        if (verified) {
          setUser(sessionUser);
        } else {
          localStorage.removeItem(STORAGE_SESSION_KEY);
          setUser(null);
        }
      }
    } catch (e) {
      console.error('Failed to load user session', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveUserSession = (newUser) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(newUser));
    } else {
      localStorage.removeItem(STORAGE_SESSION_KEY);
    }
  };

  // 1. Sign in with Google (registers account automatically if not in registry)
  const loginWithGoogle = async (customEmail, customName) => {
    await new Promise((r) => setTimeout(r, 400));

    const email = (customEmail || 'sherishma@gmail.com').trim().toLowerCase();
    const name = customName || (email.split('@')[0] ? email.split('@')[0].replace('.', ' ') : 'SHerishma');

    const allUsers = getRegisteredUsers();
    let existingUser = allUsers.find((u) => u.email.toLowerCase() === email);

    if (!existingUser) {
      existingUser = {
        id: 'g_' + Math.random().toString(36).substring(2, 9),
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email,
        password: 'oauth_google_' + Math.random().toString(36),
        provider: 'google',
        createdAt: new Date().toISOString(),
      };
      allUsers.push(existingUser);
      saveRegisteredUsersList(allUsers);
    }

    const sessionUser = {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      provider: 'google',
      createdAt: existingUser.createdAt,
    };

    saveUserSession(sessionUser);
    setIsGoogleModalOpen(false);
    return { success: true, user: sessionUser };
  };

  // 2. Sign in with Apple
  const loginWithApple = async () => {
    await new Promise((r) => setTimeout(r, 400));

    const email = 'user@icloud.com';
    const allUsers = getRegisteredUsers();
    let existingUser = allUsers.find((u) => u.email.toLowerCase() === email);

    if (!existingUser) {
      existingUser = {
        id: 'apple_' + Math.random().toString(36).substring(2, 9),
        name: 'Apple User',
        email,
        password: 'oauth_apple_' + Math.random().toString(36),
        provider: 'apple',
        createdAt: new Date().toISOString(),
      };
      allUsers.push(existingUser);
      saveRegisteredUsersList(allUsers);
    }

    const sessionUser = {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      provider: 'apple',
      createdAt: existingUser.createdAt,
    };

    saveUserSession(sessionUser);
    return { success: true, user: sessionUser };
  };

  // 3. Login with Credentials (VALIDATES ONLY REGISTERED USERS)
  const loginWithCredentials = async (rawEmail, rawPassword) => {
    await new Promise((r) => setTimeout(r, 250));

    const email = (rawEmail || '').trim().toLowerCase();
    const password = (rawPassword || '').trim();

    if (!email || !password) {
      return {
        success: false,
        error: 'Invalid credentials. Please enter your email and password.',
      };
    }

    const allUsers = getRegisteredUsers();
    const existing = allUsers.find((u) => u.email.toLowerCase() === email);

    // If unauthorized / not registered or incorrect password
    if (!existing || existing.password !== password) {
      return {
        success: false,
        error: 'Invalid credentials. User not registered or incorrect password.',
      };
    }

    const sessionUser = {
      id: existing.id,
      name: existing.name,
      email: existing.email,
      provider: existing.provider || 'credentials',
      createdAt: existing.createdAt,
    };

    saveUserSession(sessionUser);
    return { success: true, user: sessionUser };
  };

  // 4. Register new user with Credentials
  const registerWithCredentials = async (rawName, rawEmail, rawPassword) => {
    await new Promise((r) => setTimeout(r, 250));

    const name = (rawName || '').trim();
    const email = (rawEmail || '').trim().toLowerCase();
    const password = (rawPassword || '').trim();

    if (!email || !password) {
      return { success: false, error: 'Email and password are required.' };
    }

    const allUsers = getRegisteredUsers();
    const duplicate = allUsers.find((u) => u.email.toLowerCase() === email);

    if (duplicate) {
      return {
        success: false,
        error: 'An account with this email already exists. Please sign in.',
      };
    }

    const newUser = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name: name || email.split('@')[0],
      email,
      password,
      provider: 'credentials',
      createdAt: new Date().toISOString(),
    };

    allUsers.push(newUser);
    saveRegisteredUsersList(allUsers);

    const sessionUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      provider: 'credentials',
      createdAt: newUser.createdAt,
    };

    saveUserSession(sessionUser);
    return { success: true, user: sessionUser };
  };

  // 5. Reset Password (FORGOT PASSWORD FUNCTIONALITY)
  // Reliably updates the password in registered users storage so login works immediately!
  const resetPassword = async (rawEmail, newPassword) => {
    await new Promise((r) => setTimeout(r, 250));

    const email = (rawEmail || '').trim().toLowerCase();
    const password = (newPassword || '').trim();

    if (!email) {
      return { success: false, error: 'Please enter your registered email address.' };
    }

    if (!password || password.length < 4) {
      return { success: false, error: 'Password must be at least 4 characters long.' };
    }

    const allUsers = getRegisteredUsers();
    const userIndex = allUsers.findIndex((u) => u.email.toLowerCase() === email);

    if (userIndex !== -1) {
      // Update password of existing user
      allUsers[userIndex].password = password;
      saveRegisteredUsersList(allUsers);
    } else {
      // If account was not in registry, register it with this new password so they can log in
      const newUser = {
        id: 'usr_' + Math.random().toString(36).substring(2, 9),
        name: email.split('@')[0],
        email: email,
        password: password,
        provider: 'credentials',
        createdAt: new Date().toISOString(),
      };
      allUsers.push(newUser);
      saveRegisteredUsersList(allUsers);
    }

    return {
      success: true,
      message: `Password successfully updated for ${email}! You can now sign in with your new password.`,
    };
  };

  // 6. Logout: clears session and redirects to login page
  const logout = () => {
    saveUserSession(null);
    window.location.hash = '#/login';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        loginWithGoogle,
        loginWithApple,
        loginWithCredentials,
        registerWithCredentials,
        resetPassword,
        logout,
        isGoogleModalOpen,
        setIsGoogleModalOpen,
        getRegisteredUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
