const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdf = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const auth = require('../middleware/authMiddleware');
const ResumeScan = require('../models/ResumeScan');
const { sendAtsReport } = require('../utils/emailHelper');
// Configure Multer for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are currently supported via the backend API'));
    }
  }
});

// Standard Gemini prompt for ATS
const buildAtsPrompt = (resumeText) => `
You are an expert AI ATS system, Senior Recruiter, and Career Coach.

Analyze the resume and return structured, realistic career intelligence.

STRICT RULES:
- Return ONLY valid JSON
- No markdown
- No explanations
- No extra text

JSON FORMAT:

{
  "atsScore": Number,

  "parsedSkills": ["skill1","skill2"],

  "missingSkills": ["skill1","skill2"],

  "recommendations": ["rec1","rec2"],

  "jobMatch": "Single best job role",

  "careerPaths": [
    {
      "role": "Job title",
      "match": Number (0-100),
      "timeline": "e.g. 0-6 months / 1-2 years",
      "focus": "What to learn/improve"
    }
  ],

  "jobMatches": [
    {
      "role": "Job title",
      "matchScore": Number (0-100)
    }
  ],

  "interviewTopics": ["topic1","topic2"],

  "projectSuggestions": ["project1","project2"]
}

CONSTRAINTS:
- careerPaths must have 3-5 entries
- jobMatches must have 3-5 entries
- matchScore must be realistic (not all 90+)
- Do not repeat same roles everywhere
- Keep answers concise and relevant to resume

Resume:
${resumeText}
`;


// @route   POST /api/scan/upload
// @desc    Extract PDF, structure with Gemini, save to MongoDB
// @access  Private (though we can make it public for testing if needed)
router.post('/upload', auth, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is missing in backend .env' });
    }

    // 1. Extract text from PDF buffer
    let resumeText = '';
    try {
      const data = await pdf(req.file.buffer);
      resumeText = data.text;
    } catch (err) {
      return res.status(400).json({ error: 'Failed to extract text from PDF' });
    }

    // 2. Call Google Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let resultJSON = {};
    let responseText = '';
    try {
      const result = await model.generateContent(buildAtsPrompt(resumeText));
      responseText = result.response.text();

      // Better JSON extraction finding the first { and last }
      const firstBrace = responseText.indexOf('{');
      const lastBrace = responseText.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        const cleaned = responseText.substring(firstBrace, lastBrace + 1);
        resultJSON = JSON.parse(cleaned);
      } else {
        throw new Error("No JSON structure found in the response text.");
      }
    } catch (err) {
      console.error("Gemini/Parse Error:", err.message);
      console.error("Raw Response Text:", responseText);
      return res.status(500).json({ error: 'Failed to process AI response: ' + err.message, details: responseText });
    }

    // 3. Save to MongoDB ONLY if user is attached (auth middleware passed)
    // If we want to allow guest scans, we'll conditionally save.
    if (req.user) {
      try {
        const newScan = new ResumeScan({
          user: req.user.id,
          originalFileName: req.file.originalname,
          atsScore: resultJSON.atsScore,
          parsedSkills: resultJSON.parsedSkills,
          missingSkills: resultJSON.missingSkills,
          recommendations: resultJSON.recommendations,
          jobMatch: resultJSON.jobMatch,

          careerPaths: resultJSON.careerPaths || [],
          jobMatches: resultJSON.jobMatches || [],
          interviewTopics: resultJSON.interviewTopics || [],
          projectSuggestions: resultJSON.projectSuggestions || [],
        });

        const savedScan = await newScan.save();
        console.log("✅ Scan saved to DB");

        // 🔥 VERY IMPORTANT

        // Send email (optional)
        const User = require('../models/User');
        const userDetails = await User.findById(req.user.id);

        if (userDetails?.email) {
          console.log("🚀 Calling email function...");
          await sendAtsReport(userDetails.email, resultJSON);
        }
        return res.json(savedScan);

      } catch (dbErr) {
        console.error("❌ DB Save Error:", dbErr.message);
      }
    }



  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error during upload processing' });
  }
});

// @route   GET /api/scan/history
// @desc    Get user's previous scans
// @access  Private
router.get('/history', auth, async (req, res) => {
  try {
    const scans = await ResumeScan.find({ user: req.user.id }).sort({ scannedAt: -1 });
    res.json(scans);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ✅ MOVE OUTSIDE
router.get('/test-email', async (req, res) => {
  try {
    const { sendAtsReport } = require('../utils/emailHelper');

    await sendAtsReport("yourgmail@gmail.com", {
      atsScore: 85,
      parsedSkills: ["React", "Node.js"],
      missingSkills: ["Docker"],
      recommendations: ["Improve formatting"],
      jobMatch: "Frontend Developer"
    });

    res.send("Email sent successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});


module.exports = router;
