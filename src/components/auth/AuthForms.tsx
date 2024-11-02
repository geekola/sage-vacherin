import React, { useState } from 'react';
import { Login } from './Login';
import { SignUp } from './SignUp';
import { ForgotPassword } from './ForgotPassword';

type AuthView = 'login' | 'signup' | 'forgot-password';

export const AuthForms: React.FC = () => {
  const [view, setView] = useState<AuthView>('login');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4">
      <div className="max-w-md w-full">
        {view === 'login' && <Login onViewChange={setView} />}
        {view === 'signup' && <SignUp onViewChange={setView} />}
        {view === 'forgot-password' && <ForgotPassword onViewChange={setView} />}
      </div>
    </div>
  );
};