import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Map, ArrowRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const CareerPaths = () => {
  const { activeScan } = useContext(AuthContext);

  if (!activeScan) {
    return (
      <div className="text-center mt-20 text-gray-400">
        <h2 className="text-2xl font-bold mb-4">No Data Found</h2>
        <p>Please upload your resume first to see career paths.</p>
        <Link to="/scanner" className="text-primary underline">
          Upload Resume
        </Link>
      </div>
    );
  }
  const paths = activeScan?.careerPaths || [];

  return (
    <div className="flex-grow flex flex-col w-full pt-8">

      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">Your AI Career Map</h1>
      </div>

      <div className="max-w-4xl mx-auto w-full space-y-6">
        {paths.map((path, idx) => (
          <motion.div key={idx} className="p-6 rounded-3xl bg-gray-800">

            <h3 className="text-2xl text-white">{path.role}</h3>

            <p className="text-gray-400">{path.timeline}</p>
            <p className="text-gray-400">{path.focus}</p>

            <p className="text-green-400 font-bold">{path.match}% Match</p>

          </motion.div>
        ))}

        <div className="mt-8 text-center">
          <Link to="/job-match">Go to Job Matches →</Link>
        </div>
      </div>
    </div>
  );
};

export default CareerPaths;