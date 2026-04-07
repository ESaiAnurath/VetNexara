import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm text-gray-500 hover:text-gray-400 transition-colors">
          © {new Date().getFullYear()} VetNexara. Build your ultimate career path.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
