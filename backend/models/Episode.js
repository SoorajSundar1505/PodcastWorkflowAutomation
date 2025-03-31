import mongoose from 'mongoose';

const EpisodeSchema = new mongoose.Schema({
  title: String,
  status: { type: String, enum: ['draft', 'recorded', 'published'], default: 'draft' },
  duration: { type: Number }, // Episode length (mins)
  createdAt: { type: Date, default: Date.now }, // Auto-track progress
  audioUrl: { type: String }, // For future audio uploads
},
);

export default mongoose.model('Episode', EpisodeSchema);
