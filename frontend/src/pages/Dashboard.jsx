import React, { useEffect, useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Target, CheckCircle2, AlertTriangle, BookOpen, Briefcase, RefreshCw, ChevronRight, FileX } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const location = useLocation();
  const { user, api, activeScan, setActiveScan } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedScan, setSelectedScan] = useState(null);
  // The latest scan result could be passed from the Scanner page after an exact scan
  const recentScan = location.state?.scanResult;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/scan/history');

        setHistory(res.data);

        // ✅ Set latest scan locally
        if (res.data.length > 0) {
          setSelectedScan(res.data[0]);

          // ✅ OPTIONAL: set global active scan (if using context)
          if (setActiveScan) {
            setActiveScan(res.data[0]);
          }
        }

      } catch (err) {
        console.error("Failed to fetch history", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (!recentScan) {
      fetchHistory();
    } else {
      setSelectedScan(recentScan);

      if (setActiveScan) {
        setActiveScan(recentScan);
      }

      setIsLoading(false);
    }
  }, [api, recentScan]);

  const activeData = recentScan || selectedScan || history[0];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };
  if (isLoading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  if (!activeData) {
    return (
      <div className="text-center mt-20 text-gray-500">
        No data available. Upload resume.
      </div>
    );
  }
  return (
    <div className="flex-grow flex flex-col w-full">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
            Welcome to VetNexara, {user?.name || "User"}!
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {activeData ? "Here is the real-time AI analysis of your uploaded resume." : "Upload your resume to generate your ATS score and job skills."}
          </p>
        </div>
        <Link to="/scanner" className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark shadow-lg shadow-primary/30 text-white font-semibold transition-all">
          <RefreshCw className="w-5 h-5" />
          <span>Add New Resume</span>
        </Link>
      </div>

      {!isLoading && !activeData ? (
        // EPMTY STATE
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-20 px-4 text-center glass-panel rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
        >
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6">
            <FileX className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">No ATS Data Available</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8">
            You haven't analyzed a resume yet! Upload your document for testing to generate your ATS score, missing skills, and custom job matches.
          </p>
          <Link to="/scanner" className="px-8 py-3 rounded-xl text-white font-bold bg-primary hover:bg-primary-dark shadow-xl hover:shadow-primary/30 transition-all">
            Test My Resume Now
          </Link>
        </motion.div>
      ) : (
        // DATA AVAILABLE STATE
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <motion.div variants={itemVariants} className="glass-panel p-8 rounded-3xl lg:col-span-1 flex flex-col items-center justify-center relative overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[50px]"></div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-8 self-start">Overall ATS Score</h3>
            <div className="relative w-48 h-48 flex items-center justify-center mb-6">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-gray-200 dark:text-gray-700" />
                <motion.circle
                  cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" className="text-primary" strokeDasharray="283"
                  initial={{ strokeDashoffset: 283 }}
                  animate={{ strokeDashoffset: 283 - (283 * (activeData?.atsScore || 0)) / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-5xl font-display font-bold text-gray-900 dark:text-white">{activeData?.atsScore || 0}</span>
                <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase mt-1">out of 100</span>
              </div>
            </div>
            <p className="text-center text-gray-600 dark:text-gray-300">
              {(activeData?.atsScore || 0) >= 80 ? 'Great job! Your resume is highly ATS-friendly.' : 'There is room for improvement to pass ATS filters.'}
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-panel p-8 rounded-3xl lg:col-span-2 flex flex-col gap-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Actionable Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <h4 className="font-semibold text-green-800 dark:text-green-100">Top Detected Skills</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeData?.parsedSkills?.length > 0 && (activeData?.parsedSkills || []).map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 text-xs rounded-full font-medium">{skill}</span>
                  ))}
                </div>
              </div>

              <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <h4 className="font-semibold text-red-800 dark:text-red-100">Missing Critical Skills</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeData?.missingSkills?.length > 0 && (activeData?.missingSkills || []).map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 text-xs rounded-full font-medium">{skill}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <h4 className="text-gray-900 dark:text-white font-medium mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" /> Target Role Analysis
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-surfaceHighlight p-4 rounded-xl border border-gray-100 dark:border-white/5">
                  Your resume aligns well with <strong className="text-gray-900 dark:text-white">{activeData?.jobMatch || "Unknown"}</strong> roles based on our AI processing.
                </p>
              </div>
              <div>
                <h4 className="text-gray-900 dark:text-white font-medium mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-500" /> Recommended Improvements
                </h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-surfaceHighlight p-4 rounded-xl border border-gray-100 dark:border-white/5 space-y-2">
                  {activeData?.recommendations?.length > 0 && (activeData?.recommendations || []).map((rec, i) => (
                    <li key={i} className="flex gap-2"><span className="text-blue-500 font-bold">•</span> {rec}</li>
                  ))}
                </ul>
                {/* 🔥 NEW AI FEATURES */}

                {/* Career Paths */}
                {/* <div>
                  <h4 className="text-gray-900 dark:text-white font-medium mb-2 flex items-center gap-2">
                    🚀 Career Paths
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeData?.careerPaths?.length > 0 && (activeData?.careerPaths || []).map((path, i) => (
                      <div key={i} className="p-3 rounded bg-blue-50 dark:bg-blue-500/10">
                        <p className="font-semibold text-blue-700 dark:text-blue-300">
                          {path.role}
                        </p>
                        <p className="text-xs text-gray-500">
                          Match: {path.match}% • {path.timeline}
                        </p>
                        <p className="text-xs text-gray-400">
                          {path.focus}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Job Matches */}
                {/*  <div>
                  <h4 className="text-gray-900 dark:text-white font-medium mb-2 flex items-center gap-2">
                    🎯 Job Matches
                  </h4>
                  <div className="space-y-2">
                    {activeData?.jobMatches?.length > 0 && (activeData?.jobMatches || []).map((job, i) => (
                      <div key={i} className="flex justify-between text-sm bg-gray-50 dark:bg-surfaceHighlight p-2 rounded">
                        <span>{job.role}</span>
                        <span className="font-bold text-primary">{job.matchScore}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interview Topics */}
                {/*} <div>
                  <h4 className="text-gray-900 dark:text-white font-medium mb-2 flex items-center gap-2">
                    🎤 Interview Topics
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeData?.interviewTopics?.length > 0 && (activeData?.interviewTopics || []).map((topic, i) => (
                      <span key={i} className="px-3 py-1 bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-xs rounded-full font-medium">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Project Suggestions */}
                <div>
                  <h4 className="text-gray-900 dark:text-white font-medium mb-2 flex items-center gap-2">
                    💡 Project Suggestions
                  </h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-surfaceHighlight p-4 rounded-xl space-y-2">
                    {activeData?.projectSuggestions?.length > 0 && (activeData?.projectSuggestions || []).map((proj, i) => (
                      <li key={i}>• {proj}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

        </motion.div>
      )}
      <motion.div
        variants={itemVariants}
        className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          📜 Resume History
        </h3>

        {history.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No previous scans available.
          </p>
        ) : (
          <div className="space-y-3">
            {history.map((scan, i) => (
              <div
                key={i}
                onClick={() => {
                  setSelectedScan(scan);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex justify-between items-center p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 cursor-pointer transition-all"
              >
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {scan.originalFileName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(scan.scannedAt).toLocaleString()}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-primary">
                    {scan.atsScore}%
                  </p>
                  <p className="text-xs text-gray-400">
                    ATS Score
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Action shortcuts are always shown below data or empty state */}
      <motion.div variants={itemVariants} initial="hidden" animate="visible" className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { title: "Explore Career Paths", link: "/career-paths", bg: "bg-blue-50 dark:bg-blue-500/10", border: "border-blue-100 dark:border-blue-500/20", icon: Briefcase, text: "text-blue-600 dark:text-blue-400" },
          { title: "Review Job Matches", link: "/job-match", bg: "bg-purple-50 dark:bg-purple-500/10", border: "border-purple-100 dark:border-purple-500/20", icon: Target, text: "text-purple-600 dark:text-purple-400" },
          { title: "Interview Prep", link: "/interview-prep", bg: "bg-pink-50 dark:bg-pink-500/10", border: "border-pink-100 dark:border-pink-500/20", icon: CheckCircle2, text: "text-pink-600 dark:text-pink-400" }
        ].map((action, i) => (
          <Link key={i} to={action.link} className={`${action.bg} ${action.border} border p-5 rounded-2xl flex items-center justify-between group hover:-translate-y-1 transition-all`}>
            <div className="flex items-center gap-3">
              <action.icon className={`w-5 h-5 ${action.text} transition-colors`} />
              <span className="font-semibold text-gray-800 dark:text-white/90 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{action.title}</span>
            </div>
            <ChevronRight className={`w-5 h-5 ${action.text} opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all`} />
          </Link>
        ))}
      </motion.div>
    </div>
  );
};

export default Dashboard;
