import React, { useState } from 'react';
import { useAuth } from './AuthContext';

export default function AuthSettings({ onClose }: { onClose: () => void }) {
    const { authState, login, logout, updateCredentials } = useAuth();
    const [email, setEmail] = useState(authState.adminEmail);
    const [password, setPassword] = useState(authState.adminPassword);
    const [loginStatus, setLoginStatus] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const handleTestLogin = async () => {
        setIsLoading(true);
        setLoginStatus('');

        const success = await login(email, password);

        if (success) {
            setLoginStatus('✅ Login successful! Token saved.');
        } else {
            setLoginStatus('❌ Login failed. Check your credentials.');
        }

        setIsLoading(false);
    };

    const handleSaveCredentials = () => {
        updateCredentials(email, password);
        setLoginStatus('💾 Credentials saved to localStorage');
    };

    const handleLogout = () => {
        logout();
        setLoginStatus('🔓 Logged out successfully');
    };

    return (
        <div className="modal modal-open">
            <div className="modal-box max-w-2xl">
                <h3 className="font-bold text-lg mb-4">🔐 Authentication Settings</h3>

                {/* Current Status */}
                <div className="alert mb-4" style={{ backgroundColor: authState.isAuthenticated ? '#d1fae5' : '#fee2e2' }}>
                    <div>
                        <span className="text-lg">
                            {authState.isAuthenticated ? '🔓 Authenticated' : '🔒 Not Authenticated'}
                        </span>
                        {authState.isAuthenticated && authState.token && (
                            <div className="text-sm mt-2 font-mono break-all">
                                Token: {authState.token.substring(0, 40)}...
                            </div>
                        )}
                    </div>
                </div>

                {/* Credentials Form */}
                <div className="form-control w-full mb-4">
                    <label className="label">
                        <span className="label-text">Admin Email</span>
                    </label>
                    <input
                        type="email"
                        placeholder="admin@example.com"
                        className="input input-bordered w-full"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="form-control w-full mb-4">
                    <label className="label">
                        <span className="label-text">Admin Password</span>
                    </label>
                    <input
                        type="password"
                        placeholder="password"
                        className="input input-bordered w-full"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {/* Status Message */}
                {loginStatus && (
                    <div className="alert alert-info mb-4">
                        <span>{loginStatus}</span>
                    </div>
                )}

                {/* Warning */}
                <div className="alert alert-warning mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>Credentials are stored in browser localStorage. Only use for development/testing!</span>
                </div>

                {/* Action Buttons */}
                <div className="modal-action">
                    <button
                        className="btn btn-secondary"
                        onClick={handleSaveCredentials}
                        disabled={!email || !password}
                    >
                        💾 Save Credentials
                    </button>

                    <button
                        className="btn btn-primary"
                        onClick={handleTestLogin}
                        disabled={isLoading || !email || !password}
                    >
                        {isLoading ? '⏳ Testing...' : '🧪 Test Login'}
                    </button>

                    {authState.isAuthenticated && (
                        <button
                            className="btn btn-error"
                            onClick={handleLogout}
                        >
                            🔓 Logout
                        </button>
                    )}

                    <button className="btn" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}
