import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

interface AuthPageProps {
  onSuccess: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-accent-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-brand-600 mb-2">CivicConnect</h1>
          <h2 className="text-2xl font-bold text-gray-900">
            {isLogin ? 'Welcome Back' : 'Join Our Community'}
          </h2>
          <p className="text-gray-600 mt-2">
            {isLogin 
              ? 'Sign in to track your civic issues and make your voice heard' 
              : 'Create an account to start reporting civic issues in your area'
            }
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          {isLogin ? (
            <LoginForm
              onSuccess={onSuccess}
              onToggleMode={() => setIsLogin(false)}
            />
          ) : (
            <RegisterForm
              onSuccess={onSuccess}
              onToggleMode={() => setIsLogin(true)}
            />
          )}
        </div>

        <div className="text-center text-sm text-gray-600">
          <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
};