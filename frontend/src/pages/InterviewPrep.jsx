import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MessageSquare, Video, CheckCircle, BrainCircuit } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const InterviewPrep = () => {
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // ✅ GET GLOBAL DATA
  const { activeScan } = useContext(AuthContext);

  // ✅ CONVERT TOPICS → QUESTIONS
  const questions = activeScan?.interviewTopics?.map((topic, idx) => ({
    type: "Technical",
    difficulty: "Medium",
    q: `Explain ${topic} in detail.`,
    tips: [
      `Define ${topic}`,
      `Give real-world example of ${topic}`,
      `Explain where ${topic} is used`
    ]
  })) || [];

  // ❌ EMPTY STATE (IMPORTANT)
  if (questions.length === 0) {
    return (
      <div className="text-center text-gray-400 mt-20">
        No interview topics available. Please scan your resume first.
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col w-full pt-8">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-display font-bold text-white mb-4">AI Interview Coach</h1>
        <p className="text-gray-400">Practice your answers based on questions tailored to your matched job roles.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT SIDE */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-xl font-semibold text-white mb-4">Question Bank</h3>

          {questions.map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ x: 4 }}
              onClick={() => setActiveQuestion(idx)}
              className={`p-4 rounded-2xl cursor-pointer border transition-all ${activeQuestion === idx
                  ? 'bg-primary/20 border-primary/50'
                  : 'glass-panel border-transparent hover:border-white/10'
                }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-primary">{item.type}</span>
                <span className="text-xs px-2 py-1 rounded-md bg-yellow-500/20 text-yellow-300">
                  {item.difficulty}
                </span>
              </div>

              <p className="text-sm text-gray-200 line-clamp-2">
                {item.q}
              </p>
            </motion.div>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div className="lg:col-span-2 flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeQuestion}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel rounded-3xl p-8 flex-grow flex flex-col"
            >
              <div className="flex items-center gap-2 mb-6 text-primary-light">
                <MessageSquare className="w-5 h-5" />
                <span className="font-medium">
                  Question {activeQuestion + 1}
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-display font-medium text-white mb-8 leading-relaxed">
                "{questions[activeQuestion]?.q}"
              </h2>

              <div className="bg-surfaceHighlight rounded-2xl p-6 border border-white/5 mb-8">
                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4" /> AI Tips
                </h4>

                <ul className="space-y-3">
                  {questions[activeQuestion]?.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                      <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto flex flex-col sm:flex-row gap-4 items-center justify-center">
                <button className="w-full sm:w-auto px-8 py-4 rounded-xl glass-panel text-white font-medium flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                  <Video className="w-5 h-5" />
                  Record Video
                </button>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`w-full sm:w-auto px-8 py-4 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all shadow-lg ${isPlaying
                      ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
                      : 'bg-primary hover:bg-primary-dark shadow-primary/20'
                    }`}
                >
                  {isPlaying ? (
                    <>Stop Recording</>
                  ) : (
                    <><Mic className="w-5 h-5" /> Start Speaking</>
                  )}
                </button>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default InterviewPrep;