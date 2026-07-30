const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    latestVersionNumber: { type: Number, default: 1 },
    currentVersionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ResumeVersion",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resume", resumeSchema);