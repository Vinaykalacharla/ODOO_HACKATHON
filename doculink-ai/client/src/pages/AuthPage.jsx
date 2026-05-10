import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import motion from 'framer-motion';
import useAuthStore from '../store/useAuthStore';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { Mail, Lock, User, Layout } from 'lucide-react';

const AuthPage = ({ isLogin = true }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const { login, signup, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = isLogin 
      ? await login(formData.email, formData.password)
      : await signup(formData.name, formData.email, formData.password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-8 pt-20">
      <div className="absolute top-0 -z-10 h-screen w-screen overflow-hidden opacity-50">
        <div className="absolute top-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-accent/10 blur-[120px]" />
        <div className="absolute bottom-[10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-teal/5 blur-[120px]" />
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="bg-accent h-16 w-16 rounded-2xl flex items-center justify-center shadow-2xl shadow-accent/20 mx-auto mb-6">
            <Layout className="text-white h-10 w-10" />
          </div>
          <h1 className="text-4xl font-serif font-bold mb-2">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h1>
          <p className="text-muted">
            {isLogin ? 'Enter your details to continue.' : 'Join the future of document intelligence.'}
          </p>
        </div>

        <Card className="p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <Input 
                label="Full Name"
                placeholder="John Doe"
                icon={User}
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            )}
            <Input 
              label="Email Address"
              type="email"
              placeholder="name@company.com"
              icon={Mail}
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
            <Input 
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
            <Button type="submit" loading={loading} className="w-full h-12 text-lg mt-4">
              {isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>
        </Card>

        <p className="text-center mt-8 text-muted">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <Link 
            to={isLogin ? '/signup' : '/login'} 
            className="text-accent font-bold hover:underline"
          >
            {isLogin ? 'Sign up' : 'Login'}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
