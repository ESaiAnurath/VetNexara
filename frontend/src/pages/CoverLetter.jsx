import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Download, RefreshCw, FileText } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const CoverLetter = () => {

  const { activeScan, user } = useContext(AuthContext);
  const [tone, setTone] = useState("Professional");

  // ❌ SAFETY CHECK
  if (!activeScan) {
    return (
      <div className="text-center mt-20 text-gray-400">
        No data available. Please scan your resume first.
      </div>
    );
  }

  // ✅ GENERATE LETTER DYNAMICALLY
  const generateLetter = () => {
    return `Dear Hiring Manager,

I am excited to apply for the ${activeScan.jobMatch} position.

With strong experience in ${activeScan.parsedSkills?.slice(0, 5).join(", ")}, 
I have developed a solid foundation in building scalable and efficient applications.

I am particularly interested in this role because it aligns with my passion for problem-solving 
and continuous learning. My background allows me to contribute effectively from day one.

I am eager to bring value to your organization and grow as a professional.

Thank you for your time and consideration.

Sincerely,
${user?.name || "Candidate"}
`;
  };

  const [generatedLetter, setGeneratedLetter] = useState(generateLetter());

  // ✅ COPY FUNCTION
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter);
    alert("Copied to clipboard!");
  };

  // ✅ REGENERATE FUNCTION
  const handleRegenerate = () => {
    setGeneratedLetter(generateLetter());
  };

  return (
    <div className="flex-grow flex flex-col w-full pt-8">

      <div className="mb-10 max-w-3xl">
        <h1 className="text-3xl font-display font-bold text-white mb-4">
          AI Cover Letter Generator
        </h1>

        <p className="text-gray-400">
          AI has generated a personalized cover letter for the <strong>{activeScan.jobMatch}</strong> role.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* LEFT PANEL */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-white/5">

            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Tone Settings
            </h4>

            <div className="space-y-2">
              {['Professional', 'Enthusiastic', 'Direct', 'Creative'].map((t, i) => (
                <label key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="tone"
                    className="accent-primary"
                    checked={tone === t}
                    onChange={() => setTone(t)}
                  />
                  <span className="text-sm text-gray-300">{t}</span>
                </label>
              ))}
            </div>

            <button
              onClick={handleRegenerate}
              className="w-full mt-6 py-2.5 rounded-xl bg-surfaceHighlight hover:bg-white/10 text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Regenerate
            </button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-3 glass-panel p-8 rounded-3xl border border-white/10 relative"
        >

          {/* ACTION BUTTONS */}
          <div className="absolute top-6 right-6 flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg bg-surfaceHighlight hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
              title="Copy"
            >
              <Copy className="w-5 h-5" />
            </button>

            <button
              className="p-2 rounded-lg bg-surfaceHighlight hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
              title="Download PDF"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-3 mb-8">
            <FileText className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-semibold text-white">
              Generated Draft
            </h3>
          </div>

          <div className="prose prose-invert max-w-none">
            <textarea
              className="w-full min-h-[400px] bg-transparent text-gray-300 resize-none focus:outline-none focus:ring-1 focus:ring-primary/50 p-4 rounded-xl border border-transparent hover:border-white/5 transition-all"
              value={generatedLetter}
              onChange={(e) => setGeneratedLetter(e.target.value)}
            />
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default CoverLetter;