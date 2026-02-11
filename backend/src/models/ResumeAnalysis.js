import mongoose from "mongoose";

const ResumeAnalysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    jobDescription: {
      type: String,
      required: true,
    },

    resumeText: {
      type: String,
      required: true,
    },

    matchScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    matchBreakdown: {
      skills: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      experience: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      education: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      keywords: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
    },

    keywords: {
      present: [
        {
          keyword: {
            type: String,
          },
          importance: {
            type: String, // required | optional
          },
          frequency: {
            type: Number,
          },
        },
      ],
      missing: [
        {
          keyword: {
            type: String,
          },
          importance: {
            type: String,
          },
          suggestion: {
            type: String,
          },
        },
      ],
    },

    analysis: {
      strengths: [
        {
          type: String,
        },
      ],
      weaknesses: [
        {
          type: String,
        },
      ],
      suggestions: [
        {
          type: String,
        },
      ],
    },

    atsOptimization: {
      score: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      issues: [
        {
          type: String,
        },
      ],
      recommendations: [
        {
          type: String,
        },
      ],
    },

    jobRecommendations: [
      {
        title: String,
        company: String,
        location: String,
        platform: String,
        matchScore: Number,
        salary: String,
        postedDate: Date,
        applyLink: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("ResumeAnalysis", ResumeAnalysisSchema);
