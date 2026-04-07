import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, googleLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed. Please check your credentials.');
    }
    setIsSubmitting(false);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsSubmitting(true);
    try {
      await googleLogin(credentialResponse.credential);
      navigate('/dashboard');
    } catch (err) {
      setError('Google login failed');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 transition-colors">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-[32px] shadow-xl border border-gray-100 dark:border-gray-700 relative"
      >
        <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
                <span className="text-white font-bold text-xl">V</span>
            </div>
            <h2 className="text-2xl font-bold text-primary">VetNexara</h2>
        </div>

        <div className="flex p-1 mb-8 bg-gray-100 dark:bg-gray-700/50 rounded-xl">
            <button className="flex-1 py-2 text-sm font-semibold rounded-lg bg-primary text-white shadow-md">
                Login
            </button>
            <Link to="/register" className="flex-1 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400 text-center hover:text-gray-700 dark:hover:text-gray-200 transition-colors rounded-lg">
                Register
            </Link>
        </div>
        
        {error && <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm rounded-lg text-center">{error}</div>}

        <form className="space-y-5" onSubmit={onSubmit}>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
              <input 
                name="email" type="email" required 
                onChange={onChange} value={formData.email}
                className="w-full px-4 py-3 bg-transparent border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="you@email.com" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <input 
                  name="password" type={showPassword ? "text" : "password"} required 
                  onChange={onChange} value={formData.password}
                  className="w-full pl-4 pr-12 py-3 bg-transparent border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  placeholder="Min 6 characters" 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="text-right mt-2">
                  <a href="#" className="text-xs font-semibold text-primary hover:text-primary-dark cursor-not-allowed">Forgot password?</a>
              </div>
            </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-xl text-white font-bold bg-primary hover:bg-primary-dark transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 mt-4 flex items-center justify-center shadow-lg shadow-primary/30"
          >
            {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : 'Login →'}
          </button>
        </form>

        <div className="mt-8 flex flex-col items-center">
        <div className="relative w-full flex items-center justify-center my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-700"></div></div>
            <div className="relative bg-white dark:bg-gray-800 px-4 text-xs tracking-wider uppercase font-semibold text-gray-400">Or continue with</div>
        </div>
        
        {/* We use a standard wrapper to ensure Google block fills nicely */}
        <div className="w-full flex justify-center">
            <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google Login Failed')}
                theme="outline"
                shape="pill"
                width="100%"
            />
        </div>
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6 font-medium">
          No account? <Link to="/register" className="text-primary hover:text-primary-dark transition-colors font-bold">Register here</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
