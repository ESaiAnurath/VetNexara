import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Terminal, Upload, Target, Briefcase, UserCircle, LogOut } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const links = [
    { name: 'Scanner', path: '/scanner', icon: Upload },
    { name: 'Dashboard', path: '/dashboard', icon: Target },
    { name: 'Careers', path: '/career-paths', icon: Briefcase },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 mt-2">
        <div className="glass-panel rounded-2xl flex items-center justify-between px-6 py-3">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent group-hover:scale-105 transition-transform">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold text-gradient">VetNexara</span>
          </Link>
          
          {user && (
            <div className="hidden md:flex gap-1 items-center">
              {links.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    location.pathname === link.path 
                      ? 'bg-white/10 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.name}
                </Link>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-300 hidden md:flex items-center gap-2">
                  <UserCircle className="w-4 h-4" /> {user.name?.split(' ')[0]}
                </span>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="Log out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-5 py-2.5 rounded-lg text-sm font-semibold text-gray-300 hover:text-white transition-all">
                  Log in
                </Link>
                <Link to="/register" className="hidden md:flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-primary hover:bg-primary-dark transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
