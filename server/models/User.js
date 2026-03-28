import mongoose from 'mongoose'

const weakSoundSchema = new mongoose.Schema({
  th: { type: Number, default: 0 },
  rl: { type: Number, default: 0 },
  vw: { type: Number, default: 0 },
  silent: { type: Number, default: 0 },
})

const accuracySchema = new mongoose.Schema({
  timestamp: { type: String },
  score: { type: Number },
})

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  level: { type: String, default: 'Beginner' },
  xp: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  successes: { type: Number, default: 0 },
  accuracyHistory: [accuracySchema],
  weakSounds: { type: weakSoundSchema, default: () => ({}) },
  completedWords: { type: [String], default: [] },
  achievements: { type: [String], default: [] },
  tutor: { type: String, default: 'panda' },
})

export default mongoose.model('User', userSchema)
