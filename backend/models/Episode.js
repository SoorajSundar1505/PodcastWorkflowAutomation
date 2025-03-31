// import mongoose from 'mongoose';

// const EpisodeSchema = new mongoose.Schema({
//   title: String,
//   status: { type: String, enum: ['draft', 'recorded', 'published'], default: 'draft' },
//   duration: { type: Number }, // Episode length (mins)
//   createdAt: { type: Date, default: Date.now }, // Auto-track progress
//   audioUrl: { type: String }, // For future audio uploads
// },
// );

// export default mongoose.model('Episode', EpisodeSchema);

import mongoose from "mongoose";

const EpisodeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    status: {
      type: String,
      enum: ["draft", "recorded", "published"],
      default: "draft",
      index: true, // Faster status-based queries
    },
    duration: {
      type: Number,
      min: [1, "Duration must be at least 1 minute"],
      max: [300, "Duration cannot exceed 5 hours"],
    },
    audioUrl: {
      type: String,
      validate: {
        validator: (v) => /^(https?|s3):\/\/.+/i.test(v),
        message: "Invalid audio URL",
      },
    },
    lastModified: { type: Number }, // For conflict resolution
  },
  {
    timestamps: true, // A​dds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for frequently queried fields
EpisodeSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model("Episode", EpisodeSchema);

