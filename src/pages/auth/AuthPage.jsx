import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useToast } from '../../components/ui/Toast';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import { Plane, MapPin, Globe } from 'lucide-react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  
  const { login, signup, loading } = useAuthStore();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!isLogin && !formData.name) newErrors.name = 'Name is required';
    if (formData.password && formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (isLogin) {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        addToast('Welcome back to Traveloop!', 'success');
        navigate('/dashboard');
      } else {
        addToast(result.error, 'error');
      }
    } else {
      const result = await signup(formData.name, formData.email, formData.password);
      if (result.success) {
        addToast('Account created! You can now login.', 'success');
        setIsLogin(true);
      } else {
        addToast(result.error, 'error');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const handleForgotPassword = (e) => {
    e.preventDefault();
    addToast(`Password reset link sent to ${resetEmail}!`, 'info');
    setIsForgotModalOpen(false);
    setResetEmail('');
  };

  return (
    <div className="min-h-screen flex">
      {/* ... existing branding ... */}
      <div className="hidden lg:flex lg:w-1/2 bg-accent items-center justify-center relative overflow-hidden p-12">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <Globe className="absolute -top-20 -left-20 h-[600px] w-[600px]" />
          <MapPin className="absolute bottom-20 right-20 h-40 w-40" />
        </div>
        <div className="relative z-10 text-white max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <Plane className="h-12 w-12 rotate-45" />
            <h1 className="text-5xl font-serif">Traveloop</h1>
          </div>
          <h2 className="text-3xl mb-6 font-serif">The smarter way to plan your next adventure.</h2>
          <p className="text-lg opacity-90 leading-relaxed">
            Multi-city planning, budget tracking, and itinerary sharing—all in one premium platform. Join thousands of travelers today.
          </p>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-bg">
        <div className="w-full max-w-md">
          <Card className="p-8">
            <div className="flex gap-4 mb-8 border-b border-border">
              <button
                onClick={() => setIsLogin(true)}
                className={`pb-4 px-2 font-bold transition-all border-b-2 ${isLogin ? 'border-accent text-accent' : 'border-transparent text-muted'}`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`pb-4 px-2 font-bold transition-all border-b-2 ${!isLogin ? 'border-accent text-accent' : 'border-transparent text-muted'}`}
              >
                Signup
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {!isLogin && (
                <Input
                  label="Full Name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  onBlur={validate}
                />
              )}
              <Input
                label="Email Address"
                type="email"
                name="email"
                placeholder="traveler@example.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                onBlur={validate}
              />
              <Input
                label="Password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                onBlur={validate}
                helper={!isLogin ? "Min. 8 chars, 1 letter, 1 number" : ""}
              />

              <Button type="submit" loading={loading} className="mt-4 py-4 text-lg">
                {isLogin ? 'Sign In' : 'Create Account'}
              </Button>

              {isLogin && (
                <button 
                  type="button" 
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-sm font-semibold text-accent hover:underline text-center"
                >
                  Forgot Password?
                </button>
              )}
            </form>
          </Card>
          <p className="text-center mt-8 text-sm text-muted">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-accent font-bold hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal 
        isOpen={isForgotModalOpen} 
        onClose={() => setIsForgotModalOpen(false)} 
        title="Reset Password"
      >
        <form onSubmit={handleForgotPassword} className="space-y-6">
          <p className="text-muted">Enter your email address and we'll send you a link to reset your password.</p>
          <Input 
            label="Email Address"
            type="email"
            placeholder="traveler@example.com"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            required
          />
          <Button type="submit" className="w-full">
            Send Reset Link
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default AuthPage;
