import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Episode from './models/Episode.js';

const app = express();
const port = 5000;
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://Suraj:Dr$trange2Mom@podcastworkflow.4toviwp.mongodb.net/podcastDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Get all episodes
app.get('/episodes', async (req, res) => {
  const episodes = await Episode.find();
  res.json(episodes);
});

// Create new episode
app.post('/episodes', async (req, res) => {
  const { title, status } = req.body;
  const newEpisode = new Episode({ title, status });
  await newEpisode.save();
  res.status(201).json(newEpisode);
});

// Update episode status
app.put('/episodes/:id', async (req, res) => {
  const { status } = req.body;
  const updatedEpisode = await Episode.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  res.json(updatedEpisode);
});

app.listen(port, () => console.log('Server running on port 5000'));
