const mongoose = require('mongoose');

// Schema for quiz questions
const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  choices: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
  isTimed: { type: Boolean, default: false },
  randomizeQuestions: { type: Boolean, default: false },
});

// Schema for lessons in sections
const lessonSchema = new mongoose.Schema({
  lessonTitle: { type: String, required: true },
  lessonType: { type: String, enum: ['video', 'text'], required: true },
  videoUrl: { type: String },
  textContent: { type: String },
  additionalMaterials: [{ fileUrl: { type: String } }],
});

// Schema for sections in modules
const sectionSchema = new mongoose.Schema({
  sectionTitle: { type: String, required: true },
  lessons: [lessonSchema],
  quiz: [questionSchema],
});

// Schema for modules in courses
const moduleSchema = new mongoose.Schema({
  moduleTitle: { type: String, required: true },
  sections: [sectionSchema],
});

// Main course schema
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String }, // URL or path to course image
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  modules: [moduleSchema],
  estimatedDuration: { type: Number }, // Estimated hours to complete
  skillsGained: [{ type: String }],
  courseRequirements: [{ type: String }],
  objectives: { type: String },
  isMandatory: { type: Boolean, default: false },
  certificateIssued: { type: Boolean, default: false },
  qa: [{
    questionText: { type: String },
    answers: [{
      answerText: { type: String },
      answeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    }],
    upvotes: { type: Number, default: 0 },
  }],
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
