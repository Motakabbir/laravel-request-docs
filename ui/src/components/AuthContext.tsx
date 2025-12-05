import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import useLocalStorage from 'react-use-localstorage';
import type { IAuthState, IConfig } from '../libs/types';

interface AuthContextType {
    authState: IAuthState;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    updateCredentials: (email: string, password: string) => void;
    autoLogin: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
    config: IConfig;
    host: string;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, config, host }) => {
    const [authToken, setAuthToken] = useLocalStorage('lrd_auth_token', '');
    const [authTokenType, setAuthTokenType] = useLocalStorage('lrd_auth_token_type', 'Bearer');
    const [adminEmail, setAdminEmail] = useLocalStorage(
        'lrd_admin_email',
        config.auto_login?.credentials_fields?.email || ''
    );
    const [adminPassword, setAdminPassword] = useLocalStorage(
        'lrd_admin_password',
        config.auto_login?.credentials_fields?.password || ''
    );

    const [authState, setAuthState] = useState<IAuthState>({
        isAuthenticated: !!authToken,
        token: authToken || null,
        tokenType: authTokenType || 'Bearer',
        adminEmail: adminEmail || '',
        adminPassword: adminPassword || '',
    });

    useEffect(() => {
        setAuthState({
            isAuthenticated: !!authToken,
            token: authToken || null,
            tokenType: authTokenType || 'Bearer',
            adminEmail: adminEmail || '',
            adminPassword: adminPassword || '',
        });
    }, [authToken, authTokenType, adminEmail, adminPassword]);

    const login = async (email: string, password: string): Promise<boolean> => {
        if (!config.auto_login) {
            console.error('Auto-login is not configured');
            return false;
        }

        try {
            const loginEndpoint = config.auto_login.endpoint;
            const loginMethod = config.auto_login.method || 'POST';
            const tokenPath = config.auto_login.token_response_path || 'token';
            const tokenType = config.auto_login.token_type || 'Bearer';

            const response = await fetch(`${host}${loginEndpoint}`, {
                method: loginMethod,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            });

            if (!response.ok) {
                console.error('Login failed:', response.statusText);
                return false;
            }

            const data = await response.json();

            // Extract token from response using the configured path
            const token = data[tokenPath];

            if (!token) {
                console.error(`Token not found at path: ${tokenPath}`);
                return false;
            }

            setAuthToken(token);
            setAuthTokenType(tokenType);
            setAdminEmail(email);
            setAdminPassword(password);

            return true;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    const logout = () => {
        setAuthToken('');
        setAuthState({
            isAuthenticated: false,
            token: null,
            tokenType: authTokenType || 'Bearer',
            adminEmail: adminEmail || '',
            adminPassword: adminPassword || '',
        });
    };

    const updateCredentials = (email: string, password: string) => {
        setAdminEmail(email);
        setAdminPassword(password);
    };

    const autoLogin = async (): Promise<boolean> => {
        if (!config.auto_login?.enabled) {
            return false;
        }

        if (authState.isAuthenticated) {
            return true;
        }

        if (!authState.adminEmail || !authState.adminPassword) {
            console.warn('Admin credentials not configured');
            return false;
        }

        return await login(authState.adminEmail, authState.adminPassword);
    };

    return (
        <AuthContext.Provider value={{ authState, login, logout, updateCredentials, autoLogin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
