import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register, googleLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
        return setError("Passwords do not match");
    }

    setIsSubmitting(true);
    try {
      await register(formData.name, formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed. Try a different email.');
    }
    setIsSubmitting(false);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsSubmitting(true);
    try {
      await googleLogin(credentialResponse.credential);
      navigate('/dashboard');
    } catch (err) {
      setError('Google signup failed');
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

        <div className="flex p-1 mb-6 bg-gray-100 dark:bg-gray-700/50 rounded-xl">
            <Link to="/login" className="flex-1 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400 text-center hover:text-gray-700 dark:hover:text-gray-200 transition-colors rounded-lg">
                Login
            </Link>
            <button className="flex-1 py-2 text-sm font-semibold rounded-lg bg-primary text-white shadow-md">
                Register
            </button>
        </div>
        
        {error && <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm rounded-lg text-center">{error}</div>}

        <form className="space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
              <input 
                name="name" type="text" required 
                onChange={onChange} value={formData.name}
                className="w-full px-4 py-2.5 bg-transparent border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm"
                placeholder="Your full name" 
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
              <input 
                name="email" type="email" required 
                onChange={onChange} value={formData.email}
                className="w-full px-4 py-2.5 bg-transparent border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm"
                placeholder="you@email.com" 
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <input 
                  name="password" type={showPassword ? "text" : "password"} required 
                  onChange={onChange} value={formData.password}
                  className="w-full pl-4 pr-12 py-2.5 bg-transparent border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm"
                  placeholder="Min 6 characters" 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Confirm Password</label>
              <div className="relative">
                <input 
                  name="confirmPassword" type={showConfirmPassword ? "text" : "password"} required 
                  onChange={onChange} value={formData.confirmPassword}
                  className="w-full pl-4 pr-12 py-2.5 bg-transparent border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm"
                  placeholder="Repeat password" 
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

          {/* Dummy reCAPTCHA matching the screenshot */}
          <div className="w-full bg-[#1e2025] border border-gray-700 rounded p-4 flex items-center justify-between mt-6">
              <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-white rounded-sm border border-gray-300"></div>
                  <span className="text-white text-sm">I'm not a robot</span>
              </div>
              <div className="flex flex-col items-center">
                  <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-1"></div>
                  <span className="text-[9px] text-gray-400">reCAPTCHA</span>
              </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-xl text-white font-bold bg-primary hover:bg-primary-dark transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 mt-4 flex items-center justify-center shadow-lg shadow-primary/30"
          >
            {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : 'Create Account →'}
          </button>

          <div className="my-2 flex flex-col items-center">
             <div className="relative w-full flex items-center justify-center my-2">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-700"></div></div>
                <div className="relative bg-white dark:bg-gray-800 px-4 text-[10px] tracking-wider uppercase font-bold text-gray-400">Or use Google</div>
             </div>
             
             <div className="w-full flex justify-center scale-90">
                 <GoogleLogin
                     onSuccess={handleGoogleSuccess}
                     onError={() => setError('Google Login Failed')}
                     theme="outline"
                     shape="pill"
                     width="100%"
                 />
             </div>
         </div>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4 font-medium">
          Have an account? <Link to="/login" className="text-primary hover:text-primary-dark transition-colors font-bold">Login</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
