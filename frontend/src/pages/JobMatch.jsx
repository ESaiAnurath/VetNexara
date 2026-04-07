import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Search, Building, MapPin, DollarSign, ExternalLink } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const JobMatch = () => {

  // ✅ GET GLOBAL DATA
  const { activeScan } = useContext(AuthContext);

  // ✅ REAL DATA FROM BACKEND
  const jobs = activeScan?.jobMatches || [];

  return (
    <div className="flex flex-col w-full pt-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Smart Job Matches</h1>
          <p className="text-gray-400">Live postings matched directly to your analyzed resume.</p>
        </div>

        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search roles..."
            className="w-full md:w-64 pl-10 pr-4 py-2.5 bg-surfaceHighlight border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
      </div>

      {/* ❌ EMPTY STATE */}
      {jobs.length === 0 ? (
        <div className="text-center text-gray-400 mt-20">
          No job matches available. Please scan your resume first.
        </div>
      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className="glass-panel p-6 rounded-3xl flex flex-col h-full group hover:bg-white/[0.02] transition-colors relative"
            >

              {/* MATCH CIRCLE */}
              <div className="absolute top-6 right-6 flex items-center justify-center w-12 h-12 rounded-full border-4 border-gray-800">
                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-gray-800" />
                  <circle
                    cx="50" cy="50" r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeLinecap="round"
                    className={job.matchScore > 85 ? "text-green-500" : "text-yellow-500"}
                    strokeDasharray="283"
                    strokeDashoffset={283 - (283 * job.matchScore) / 100}
                  />
                </svg>
                <span className="text-xs font-bold text-white">{job.matchScore}%</span>
              </div>

              {/* TITLE */}
              <div className="mb-6 pr-14">
                <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-primary-light transition-colors">
                  {job.role}
                </h3>
                <p className="text-sm font-medium text-primary flex items-center gap-1">
                  <Building className="w-3 h-3" /> AI Suggested
                </p>
              </div>

              {/* INFO */}
              <div className="space-y-2 mb-6 text-sm text-gray-400 flex-grow">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" /> Remote
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-500" /> Based on market trends
                </div>
              </div>

              {/* SKILLS */}
              <div className="mb-6">
                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Key Skills</p>
                <div className="flex flex-wrap gap-2">
                  {activeScan?.parsedSkills?.slice(0, 4).map((s, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-gray-300">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* BUTTON */}
              <button className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium flex items-center justify-center gap-2 transition-all">
                Apply Now <ExternalLink className="w-4 h-4" />
              </button>

            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobMatch;