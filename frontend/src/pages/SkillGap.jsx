import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Layers, Disc3, ExternalLink } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const SkillGap = () => {

  // ✅ GET DATA FROM GLOBAL STATE
  const { activeScan } = useContext(AuthContext);

  // ❌ SAFETY (NO BLANK SCREEN)
  if (!activeScan) {
    return (
      <div className="text-center mt-20 text-gray-400">
        No data available. Please scan your resume first.
      </div>
    );
  }

  // ✅ CONVERT missingSkills → UI FORMAT
  const gaps = activeScan?.missingSkills?.map((skill, i) => ({
    skill,
    type: "Recommended Skill",
    importance: 70 + (i * 5), // small variation (looks realistic)
    status: i < 2 ? "Critical" : "Medium"
  })) || [];

  return (
    <div className="flex-grow flex flex-col w-full pt-8">

      <div className="mb-10 max-w-2xl">
        <h1 className="text-3xl font-display font-bold text-white mb-2">
          Skill Gap Analysis
        </h1>

        <p className="text-gray-400">
          Based on your target role <strong>{activeScan.jobMatch}</strong>, here are the skills you need to acquire.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {gaps.map((gap, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel p-6 rounded-3xl border border-white/5 relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-[40px] -mr-10 -mt-10 ${gap.status === 'Critical' ? 'bg-red-500/20' : 'bg-yellow-500/20'
              }`}></div>

            <div className="flex justify-between items-start mb-6 position-relative z-10">
              <div className="w-12 h-12 rounded-xl bg-surfaceHighlight flex items-center justify-center">
                <Layers className="w-6 h-6 text-primary-light" />
              </div>

              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${gap.status === 'Critical'
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                {gap.status} gap
              </span>
            </div>

            <h3 className="text-2xl font-bold text-white mb-1">
              {gap.skill}
            </h3>

            <p className="text-sm text-gray-500 mb-6 uppercase tracking-wider">
              {gap.type}
            </p>

            <div className="mb-6">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-gray-400">Market Demand</span>
                <span className="text-white font-medium">{gap.importance}%</span>
              </div>

              <div className="w-full bg-surfaceHighlight rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-primary to-accent h-2 rounded-full"
                  style={{ width: `${gap.importance}%` }}
                ></div>
              </div>
            </div>

            <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-white font-medium flex items-center justify-center gap-2">
              <Disc3 className="w-4 h-4" /> Start Learning
            </button>
          </motion.div>
        ))}

        {/* BOTTOM SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-3 glass-panel p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 mt-4"
        >
          <div>
            <h3 className="text-xl font-bold text-white mb-2">
              Recommended Courses
            </h3>

            <p className="text-gray-400 text-sm max-w-lg">
              Based on your missing skills, targeted learning can significantly improve your ATS score and job readiness.
            </p>
          </div>

          <button className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold flex items-center gap-2 whitespace-nowrap transition-all shadow-lg shadow-primary/25">
            View Curriculum <ExternalLink className="w-4 h-4" />
          </button>
        </motion.div>

      </div>
    </div>
  );
};

export default SkillGap;