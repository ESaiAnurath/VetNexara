import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Scanner = () => {
  const [file, setFile] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { api, setActiveScan } = useContext(AuthContext);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsHovering(true);
  };

  const handleDragLeave = () => {
    setIsHovering(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsHovering(false);

    const droppedFile = e.dataTransfer.files[0];

    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
      setError(null);
    } else {
      setError("Only PDF files are allowed.");
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError(null);
    } else {
      setError("Only PDF files are allowed.");
    }
  };

  const handleScan = async () => {
    if (!file) {
      setError("Please upload a file first.");
      return;
    }

    setIsScanning(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const res = await api.post('/scan/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log("SCAN RESULT:", res.data);

      // ✅ ONLY global state
      setActiveScan(res.data);

      // ❌ NO state passing
      navigate('/dashboard');

    } catch (err) {
      console.error("SCAN ERROR:", err);

      if (err.response) {
        setError(err.response.data?.error || "Backend error occurred");
      } else if (err.request) {
        setError("No response from server. Check backend.");
      } else {
        setError("Unexpected error occurred.");
      }
    } finally {
      setIsScanning(false);
    }
    setSuccess(true);

    // Auto hide after 3 sec
    setTimeout(() => setSuccess(false), 3000);
    {
      success && (
        <div className="fixed top-6 right-6 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-bounce z-50">
          <CheckCircle2 className="w-5 h-5" />
          Report sent to your email 📧
        </div>
      )
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full pt-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >

        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Upload Your Resume
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Let AI analyze your resume and generate ATS insights.
          </p>
        </div>

        {/* UPLOAD BOX */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative bg-white dark:bg-gray-800 rounded-3xl p-10 text-center border-2 transition-all ${isHovering
            ? 'border-primary bg-primary/5'
            : 'border-dashed border-gray-300'
            }`}
        >

          {/* LOADING */}
          {isScanning && (
            <div className="absolute inset-0 bg-white/80 dark:bg-black/80 flex flex-col items-center justify-center">
              <Loader2 className="w-10 h-10 animate-spin text-primary mb-3" />
              <p className="font-semibold">Analyzing Resume...</p>
            </div>
          )}

          {/* FILE SELECTED */}
          {file ? (
            <div className="flex flex-col items-center">
              <CheckCircle2 className="w-10 h-10 text-green-500 mb-3" />
              <p className="font-bold">{file.name}</p>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setFile(null)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Change
                </button>

                <button
                  onClick={handleScan}
                  disabled={isScanning}
                  className="px-6 py-2 bg-primary text-white rounded"
                >
                  Analyze
                </button>
              </div>
            </div>
          ) : (
            <div>
              <UploadCloud className="w-12 h-12 mx-auto mb-4 text-primary" />
              <p className="font-bold">Drag & Drop PDF</p>

              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="mt-4"
              />
            </div>
          )}
        </div>

        {/* ERROR */}
        {error && (
          <div className="mt-6 p-4 bg-red-100 text-red-600 flex items-center gap-2 rounded">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

      </motion.div>
    </div>
  );
};

export default Scanner;