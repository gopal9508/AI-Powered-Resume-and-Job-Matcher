import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  salary: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: "USD",
    },
  },
  type: {
    type: String,
    enum: ["full-time", "part-time", "contract", "internship", "remote"],
    default: "full-time",
  },
  platform: {
    type: String,
    enum: ["linkedin", "naukri", "instahire", "indeed", "glassdoor"],
    required: true,
  },
  applyLink: {
    type: String,
    required: true,
  },
  postedDate: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
  },
  requirements: [String],
  skills: [String],
  benefits: [String],
  matchScore: Number, // For jobs fetched based on user profile
  isActive: {
    type: Boolean,
    default: true,
  },
  metadata: {
    sourceId: String,
    lastFetched: Date,
  },
});

jobSchema.index({ title: "text", description: "text", company: "text" });
jobSchema.index({ platform: 1, postedDate: -1 });
jobSchema.index({ location: 1, type: 1 });

export default mongoose.model("Job", jobSchema);
