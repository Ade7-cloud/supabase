import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  User as UserIcon, 
  Phone, 
  KeyRound, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';
import { User } from '../types';
import { initialCurrentUser } from '../data/initialData';

interface AuthTwoPaneProps {
  onAuthSuccess: (user: User) => void;
}

export const AuthTwoPane: React.FC<AuthTwoPaneProps> = ({ onAuthSuccess }) => {
  const [activePane, setActivePane] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('tunde.adebayo@gmail.com');
  const [loginPassword, setLoginPassword] = useState('TrustPass@2026');
  const [rememberMe, setRememberMe] = useState(true);

  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regBvn, setRegBvn] = useState('');
  const [regPin, setRegPin] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  // Handle Login submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!loginEmail || !loginPassword) {
      setErrorMessage('Please enter your email or phone number and password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Log in with existing user data or created user
      onAuthSuccess({
        ...initialCurrentUser,
        email: loginEmail,
      });
    }, 900);
  };

  // Handle Quick Demo Login
  const handleQuickDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onAuthSuccess(initialCurrentUser);
    }, 400);
  };

  // Handle Registration submission
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!regFullName || !regEmail || !regPhone || !regPassword) {
      setErrorMessage('Please fill in all mandatory fields.');
      return;
    }

    if (!agreedToTerms) {
      setErrorMessage('You must accept the TrustPass Escrow & Thrift Contribution Terms.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const newUser: User = {
        id: `usr_${Date.now().toString().slice(-4)}`,
        fullName: regFullName,
        email: regEmail,
        phone: regPhone.startsWith('+234') ? regPhone : `+234 ${regPhone}`,
        bvn: regBvn || '22384910291',
        accountNumber: '9928374829',
        bankName: 'Providus Bank / Wema',
        walletBalance: 25000, // Welcome gift bonus
        lockedEscrowBalance: 0,
        totalSaved: 0,
        totalEarned: 0,
        transactionPin: regPin || '1234',
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(regFullName)}`,
      };

      onAuthSuccess(newUser);
    }, 1100);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between text-slate-100 selection:bg-emerald-500 selection:text-white relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Brand Bar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-6 py-3.5 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-900/40">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white font-heading">
                TrustPass
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Portal Container */}
      <main className="flex-1 max-w-lg w-full mx-auto px-4 py-8 sm:py-12 flex items-center justify-center z-10">
        <div className="w-full bg-slate-900/90 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl p-6 sm:p-10">
          <section className="flex flex-col justify-center">
            
            {/* Two-Pane Tab Switcher */}
            <div className="flex items-center p-1.5 bg-slate-950 rounded-2xl border border-slate-800 mb-6">
              <button
                type="button"
                id="tab-login-btn"
                onClick={() => { setActivePane('login'); setErrorMessage(''); }}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                  activePane === 'login'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>Sign In to Portal</span>
              </button>
              <button
                type="button"
                id="tab-register-btn"
                onClick={() => { setActivePane('register'); setErrorMessage(''); }}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                  activePane === 'register'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserIcon className="w-4 h-4" />
                <span>Create Account</span>
              </button>
            </div>

            {/* Error banner if any */}
            {errorMessage && (
              <div className="mb-5 p-3.5 bg-red-900/30 border border-red-500/40 rounded-xl text-red-200 text-xs flex items-center gap-2.5 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* 1-Click Demo Login Bar */}
            <div className="mb-5 p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="text-slate-300 font-medium">Quick Evaluator Access:</span>
              </div>
              <button
                type="button"
                id="quick-demo-login-btn"
                onClick={handleQuickDemoLogin}
                className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-lg font-semibold text-xs transition flex items-center gap-1.5"
              >
                <span>Demo Sign In (Tunde Adebayo)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* LOGIN FORM */}
            {activePane === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Email Address or Portal ID
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      id="login-email-input"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. tunde.adebayo@gmail.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Account Password
                    </label>
                    <button
                      type="button"
                      onClick={() => alert('Password reset link sent to your registered Nigerian phone number and email (Simulated).')}
                      className="text-xs text-emerald-400 hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="login-password-input"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-950/70 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Remember this device</span>
                  </label>
                </div>

                <button
                  type="submit"
                  id="submit-login-btn"
                  disabled={isLoading}
                  className="w-full mt-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-900/30 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span>Enter TrustPass Dashboard</span>
                  )}
                </button>
              </form>
            ) : (
              /* REGISTER FORM */
              <form onSubmit={handleRegister} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Full Legal Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      id="register-fullname-input"
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      placeholder="e.g. Olawale Johnson"
                      className="w-full pl-10 pr-4 py-2 bg-slate-950/70 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        id="register-email-input"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="olawale@example.ng"
                        className="w-full pl-10 pr-3 py-2 bg-slate-950/70 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Phone Number (+234)
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        id="register-phone-input"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="0803 123 4567"
                        className="w-full pl-10 pr-3 py-2 bg-slate-950/70 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        BVN (11-Digits)
                      </label>
                      <span className="text-[10px] text-emerald-400">KYC Required</span>
                    </div>
                    <input
                      type="text"
                      maxLength={11}
                      id="register-bvn-input"
                      value={regBvn}
                      onChange={(e) => setRegBvn(e.target.value)}
                      placeholder="22201928471"
                      className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-xl text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      4-Digit Transaction PIN
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      id="register-pin-input"
                      value={regPin}
                      onChange={(e) => setRegPin(e.target.value)}
                      placeholder="••••"
                      className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-xl text-sm font-mono font-bold text-center text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Create Password
                  </label>
                  <input
                    type="password"
                    id="register-password-input"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div className="pt-1">
                  <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-400">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-slate-700 bg-slate-800 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>
                      I agree to the <strong className="text-slate-200">TrustPass Digital Ajo Escrow Rules</strong>, NDPR privacy policy, and rotational contribution obligations.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  id="submit-register-btn"
                  disabled={isLoading}
                  className="w-full mt-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-900/30 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Complete Registration & Open Wallet</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

          </section>
        </div>
      </main>

      {/* Institutional Portal Footer */}
      <footer className="py-4 px-6 border-t border-slate-800/60 bg-slate-950/80 text-center text-xs text-slate-400 z-10">
        <p>© 2026 TrustPass Financial Technologies Ltd. Licensed Digital Thrift Savings & Escrow Platform. Lagos • Abuja • Port Harcourt.</p>
      </footer>
    </div>
  );
};
