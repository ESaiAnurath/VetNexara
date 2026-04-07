import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Upload, Brain, TrendingUp, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const features = [
    { icon: Brain, title: "AI Resume Analysis", desc: "Our Gemini 1.5 Pro model deeply understands your experience and generates a comprehensive ATS score." },
    { icon: TrendingUp, title: "Skill Gap Detection", desc: "Identify missing skills and get tailored resources to bridge the gap between you and your dream job." },
    { icon: Briefcase, title: "Smart Job Matching", desc: "Instantly match your resume to job descriptions to see your exact alignment and areas to improve." }
  ];

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center pt-20 pb-32">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen opacity-50 -z-10 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[100px] mix-blend-screen opacity-50 -z-10 animate-blob" style={{ animationDelay: '2s' }}></div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl px-4 z-10"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-primary/30 mb-8">
            <Sparkles className="w-4 h-4 text-primary-light" />
            <span className="text-sm font-medium text-primary-light">Powered by Google Gemini 1.5 Pro</span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-6xl md:text-7xl font-display font-bold text-white mb-6 leading-tight">
            Your AI-Powered <br/>
            <span className="text-gradient">Career Guide</span> & Resume Scanner
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Upload your resume and let AI unlock your career potential. From instant ATS scoring to personalized interview prep, VetNexara is your ultimate career companion.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/scanner" 
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white bg-primary hover:bg-primary-dark transition-all scale-100 hover:scale-105 shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_40px_rgba(139,92,246,0.6)]"
            >
              <Upload className="w-5 h-5" />
              Scan My Resume
            </Link>
            <Link 
              to="/career-paths" 
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white glass-panel hover:bg-white/10 transition-all"
            >
              Explore Paths
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {features.map((feature, idx) => (
            <div key={idx} className="glass-panel p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6">
                <feature.icon className="w-7 h-7 text-primary-light" />
              </div>
              <h3 className="text-2xl font-display font-semibold text-white mb-4">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

export default Landing;
