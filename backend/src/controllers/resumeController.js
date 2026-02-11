/* ================= IMPORTS ================= */

import ResumeAnalysis from "../models/ResumeAnalysis.js";
import FileParser from "../utils/fileParser.js";
import jobScraper from "../services/jobScraper.js";
import { advancedAnalyzeResume } from "../services/advancedResumeAnalysis.js";

/* =====================================================
   @desc    Upload and parse resume
   @route   POST /api/resume/upload
   @access  Private
===================================================== */
export const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a resume file",
      });
    }

    const parsedData = await FileParser.parseFile(req.file.path);
    const cleanText = FileParser.cleanText(parsedData.text);
    const sections = FileParser.extractSections(cleanText);

    req.user.resumeFile = req.file.path;
    req.user.resumeText = cleanText;
    await req.user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "Resume uploaded successfully",
      data: {
        fileName: req.file.filename,
        sections,
        metadata: parsedData.metadata || {},
      },
    });
  } catch (error) {
    next(error);
  }
};

/* =====================================================
   @desc    Advanced resume analysis (ATS + Section wise)
   @route   POST /api/resume/analyze
   @access  Private
===================================================== */
export const analyzeResume = async (req, res, next) => {
  try {
    const { jobDescription } = req.body;

    if (!jobDescription || jobDescription.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message: "Job description must be at least 50 characters long",
      });
    }

    if (!req.user.resumeText) {
      return res.status(400).json({
        success: false,
        message: "Please upload your resume first",
      });
    }

    const sections = FileParser.extractSections(req.user.resumeText);

    const result = advancedAnalyzeResume(sections, jobDescription);

    const savedAnalysis = await ResumeAnalysis.create({
      user: req.user._id,
      jobDescription,
      resumeText: req.user.resumeText,
      matchScore: result.matchScore,
      matchBreakdown: {
        skills: result.sectionScores.skills,
        experience: result.sectionScores.experience,
        education: result.sectionScores.education,
        keywords: result.sectionScores.keywords,
      },
      keywords: {
        missing: result.missingKeywords.map((k) => ({ keyword: k })),
      },
      atsOptimization: {
        score: result.atsScore,
        recommendations: result.suggestions,
      },
      analysis: {
        suggestions: result.suggestions,
      },
    });

    res.status(200).json({
      success: true,
      message: "Advanced resume analysis completed",
      data: {
        analysisId: savedAnalysis._id,
        matchScore: result.matchScore,
        atsScore: result.atsScore,
        sectionScores: result.sectionScores,
        missingKeywords: result.missingKeywords,
        suggestions: result.suggestions,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* =====================================================
   @desc    Get job recommendations
   @route   POST /api/resume/job-recommendations
   @access  Private
===================================================== */
export const getJobRecommendations = async (req, res, next) => {
  try {
    if (!req.user.resumeText) {
      return res.status(400).json({
        success: false,
        message: "Please upload your resume first",
      });
    }

    const { keywords, location = "", limit = 10, analysisId } = req.body;

    const searchKeywords =
      keywords ||
      req.user.resumeText.split(/\W+/).slice(0, 5).join(" ");

    const jobs = await jobScraper.searchJobs(
      searchKeywords,
      location,
      limit
    );

    const jobsWithScores = jobs.map((job) => {
      const score = advancedAnalyzeResume(
        FileParser.extractSections(req.user.resumeText),
        job.description || ""
      ).matchScore;

      return { ...job, matchScore: score };
    });

    jobsWithScores.sort((a, b) => b.matchScore - a.matchScore);

    if (analysisId) {
      await ResumeAnalysis.findByIdAndUpdate(analysisId, {
        jobRecommendations: jobsWithScores.slice(0, 5),
      });
    }

    res.status(200).json({
      success: true,
      message: "Job recommendations generated",
      data: {
        jobs: jobsWithScores,
        total: jobsWithScores.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* =====================================================
   @desc    Get analysis history
   @route   GET /api/resume/analysis-history
   @access  Private
===================================================== */
export const getAnalysisHistory = async (req, res, next) => {
  try {
    const analyses = await ResumeAnalysis.find({
      user: req.user._id,
    })
      .sort({ createdAt: -1 })
      .select("-resumeText -jobDescription");

    res.status(200).json({
      success: true,
      data: analyses,
    });
  } catch (error) {
    next(error);
  }
};

/* =====================================================
   @desc    Get single analysis
   @route   GET /api/resume/analysis/:id
   @access  Private
===================================================== */
export const getAnalysis = async (req, res, next) => {
  try {
    const analysis = await ResumeAnalysis.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: "Analysis not found",
      });
    }

    res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    next(error);
  }
};
