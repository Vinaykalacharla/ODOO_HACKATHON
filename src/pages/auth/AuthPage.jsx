import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, UserRound, ArrowRight, KeyRound, Sparkles, BadgeCheck, ShieldCheck } from 'lucide-react';
import AuthShell from '../../components/layout/AuthShell';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import { useToastStore } from '../../store/toastStore';
import { validateLogin, validateSignup } from '../../lib/validators';

const demoLogin = {
  email: 'traveler@demo.com',
  password: 'demo1234',
};

export default function AuthPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const signup = useAuthStore((state) => state.signup);
  const currentUser = useAuthStore((state) => state.getCurrentUser());
  const pushToast = useToastStore((state) => state.pushToast);

  const [tab, setTab] = useState('login');

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginTouched, setLoginTouched] = useState({});
  const [loginLoading, setLoginLoading] = useState(false);

  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '' });
  const [signupTouched, setSignupTouched] = useState({});
  const [signupLoading, setSignupLoading] = useState(false);

  const [forgotForm, setForgotForm] = useState({ email: '' });
  const [forgotTouched, setForgotTouched] = useState({});
  const [forgotLoading, setForgotLoading] = useState(false);

  const loginErrors = useMemo(() => validateLogin(loginForm), [loginForm]);
  const signupErrors = useMemo(() => validateSignup(signupForm), [signupForm]);
  const forgotErrors = useMemo(() => (forgotForm.email ? {} : { email: 'Enter your email address.' }), [forgotForm]);

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard', { replace: true });
    }
  }, [currentUser, navigate]);

  const blur = (setter, form, validateFn, field) => {
    setter((state) => ({ ...state, [field]: true }));
    validateFn(form);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoginTouched({ email: true, password: true });
    if (Object.keys(loginErrors).length > 0) return;
    setLoginLoading(true);
    try {
      await login(loginForm);
      pushToast({ title: 'Signed in', description: 'Welcome back to Traveloop.', variant: 'success' });
      navigate('/dashboard');
    } catch (error) {
      pushToast({ title: 'Sign in failed', description: error.message, variant: 'error' });
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    setSignupTouched({ name: true, email: true, password: true });
    if (Object.keys(signupErrors).length > 0) return;
    setSignupLoading(true);
    try {
      await signup(signupForm);
      pushToast({ title: 'Account created', description: 'Your Traveloop workspace is ready.', variant: 'success' });
      navigate('/dashboard');
    } catch (error) {
      pushToast({ title: 'Signup failed', description: error.message, variant: 'error' });
    } finally {
      setSignupLoading(false);
    }
  };

  const handleForgot = async (event) => {
    event.preventDefault();
    setForgotTouched({ email: true });
    if (Object.keys(forgotErrors).length > 0) return;
    setForgotLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      pushToast({ title: 'Reset ready', description: 'Password reset instructions were queued for the demo.', variant: 'success' });
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <AuthShell>
      <Card className="w-full max-w-xl p-6 lg:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">Secure access</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-text">Book your next route</h2>
          </div>
          <div className="rounded-2xl bg-[#eef4ff] px-3 py-2 text-right">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#1d4ed8]">Demo ready</p>
            <p className="mt-1 text-xs font-semibold text-text">traveler@demo.com</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 rounded-full bg-[#f1f6ff] p-1">
          {[
            ['login', 'Login'],
            ['signup', 'Signup'],
            ['forgot', 'Reset'],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setTab(value)}
              className={`focus-ring rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                tab === value ? 'bg-white text-text shadow-[0_10px_25px_rgba(15,23,42,0.08)]' : 'text-muted hover:text-text'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-[1.35rem] border border-sky-100 bg-sky-50/70 p-4">
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-700">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 font-semibold text-sky-700 shadow-sm">
              <Sparkles className="h-4 w-4" />
              Professional booking-style UI
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 font-semibold text-teal-700 shadow-sm">
              <ShieldCheck className="h-4 w-4" />
              Demo auth
            </span>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Use the demo login to inspect the app quickly, or create a fresh workspace with signup.
          </p>
        </div>

        <div className="mt-6">
          {tab === 'login' ? (
            <form className="space-y-4" onSubmit={handleLogin}>
              <Input
                label="Email"
                type="email"
                value={loginForm.email}
                onChange={(event) => setLoginForm((state) => ({ ...state, email: event.target.value }))}
                onBlur={() => blur(setLoginTouched, loginForm, validateLogin, 'email')}
                error={loginTouched.email ? loginErrors.email : ''}
                placeholder="traveler@demo.com"
                helperText="Use the demo login if you want to inspect the app quickly."
                icon={<Mail className="h-4 w-4" />}
              />
              <Input
                label="Password"
                type="password"
                value={loginForm.password}
                onChange={(event) => setLoginForm((state) => ({ ...state, password: event.target.value }))}
                onBlur={() => blur(setLoginTouched, loginForm, validateLogin, 'password')}
                error={loginTouched.password ? loginErrors.password : ''}
                placeholder="Enter your password"
                icon={<Lock className="h-4 w-4" />}
              />

              <div className="flex flex-wrap gap-3 pt-2">
                <Button type="submit" loading={loginLoading} className="flex-1">
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setLoginForm(demoLogin);
                    setTab('login');
                  }}
                >
                  Demo login
                </Button>
              </div>
            </form>
          ) : null}

          {tab === 'signup' ? (
            <form className="space-y-4" onSubmit={handleSignup}>
              <Input
                label="Name"
                value={signupForm.name}
                onChange={(event) => setSignupForm((state) => ({ ...state, name: event.target.value }))}
                onBlur={() => blur(setSignupTouched, signupForm, validateSignup, 'name')}
                error={signupTouched.name ? signupErrors.name : ''}
                placeholder="Your name"
                icon={<UserRound className="h-4 w-4" />}
              />
              <Input
                label="Email"
                type="email"
                value={signupForm.email}
                onChange={(event) => setSignupForm((state) => ({ ...state, email: event.target.value }))}
                onBlur={() => blur(setSignupTouched, signupForm, validateSignup, 'email')}
                error={signupTouched.email ? signupErrors.email : ''}
                placeholder="you@example.com"
                icon={<Mail className="h-4 w-4" />}
              />
              <Input
                label="Password"
                type="password"
                value={signupForm.password}
                onChange={(event) => setSignupForm((state) => ({ ...state, password: event.target.value }))}
                onBlur={() => blur(setSignupTouched, signupForm, validateSignup, 'password')}
                error={signupTouched.password ? signupErrors.password : ''}
                placeholder="At least 8 characters"
                helperText="Use a mix of letters and numbers."
                icon={<Lock className="h-4 w-4" />}
              />
              <Button type="submit" loading={signupLoading} className="w-full">
                Create account
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          ) : null}

          {tab === 'forgot' ? (
            <form className="space-y-4" onSubmit={handleForgot}>
              <Input
                label="Email"
                type="email"
                value={forgotForm.email}
                onChange={(event) => setForgotForm({ email: event.target.value })}
                onBlur={() => blur(setForgotTouched, forgotForm, () => (forgotForm.email ? {} : { email: 'Enter your email address.' }), 'email')}
                error={forgotTouched.email ? forgotErrors.email : ''}
                placeholder="you@example.com"
                icon={<KeyRound className="h-4 w-4" />}
              />
              <Button type="submit" loading={forgotLoading} className="w-full">
                Send reset request
              </Button>
            </form>
          ) : null}
        </div>
      </Card>
    </AuthShell>
  );
}
