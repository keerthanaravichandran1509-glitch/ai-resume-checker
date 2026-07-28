const mongoose = require("mongoose");

const resumeVersionSchema = new mongoose.Schema(
  {
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
      index: true,
    },
    versionNumber: { type: Number, required: true },
    label: { type: String, required: true },
    rawText: { type: String, default: "" },
    parsedSections: { type: mongoose.Schema.Types.Mixed, default: {} },
    sourceType: {
      type: String,
      enum: ["upload", "rewrite"],
      default: "upload",
    },
    parentVersionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ResumeVersion",
      default: null,
    },
    latestAnalysisId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Analysis",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ResumeVersion", resumeVersionSchema);