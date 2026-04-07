const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const componentsDir = path.join(__dirname, 'src', 'components', 'layout');

[pagesDir, componentsDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const pages = [
  'Landing', 'Scanner', 'Dashboard', 'CareerPaths', 
  'JobMatch', 'InterviewPrep', 'SkillGap', 'CoverLetter'
];

pages.forEach(page => {
  const file = path.join(pagesDir, `${page}.jsx`);
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, `import React from 'react';
import { motion } from 'framer-motion';

const ${page} = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex-grow flex flex-col pt-8"
    >
      <div className="glass-panel p-8 rounded-2xl">
        <h1 className="text-3xl font-display font-bold text-white mb-4">${page}</h1>
        <p className="text-gray-400">Content for ${page} goes here.</p>
      </div>
    </motion.div>
  );
};

export default ${page};
`);
  }
});

const footerPath = path.join(componentsDir, 'Footer.jsx');
if (!fs.existsSync(footerPath)) {
  fs.writeFileSync(footerPath, `import React from 'react';

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
`);
}

console.log("Scaffolding complete!");
