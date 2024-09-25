const mongoose = require('mongoose');

// Schema for quiz questions with multiple types
const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['text', 'radio', 'checkbox', 'select', 'date'], 
    required: true 
  }, // Question type
  choices: [String], // Options for radio, checkbox, and select types
  correctAnswer: { type: String }, // Correct answer for the question
  isTimed: { type: Boolean, default: false },
  randomizeQuestions: { type: Boolean, default: false },
});

// Schema for lesson materials
const materialSchema = new mongoose.Schema({
  materialType: { type: String, enum: ['video', 'pdf', 'text'], required: true },
  materialUrl: { type: String }, // URL of the material
  title: { type: String, required: true },
  description: { type: String }
});

// Schema for lessons in sections
const lessonSchema = new mongoose.Schema({
  lessonTitle: { type: String, required: true },
  description: { type: String },
  lessonText: { type: String }, // Text content of the lesson
  materials: [materialSchema], // Existing materials schema (videos, PDFs, etc.)
  quiz: [questionSchema], // A quiz can be associated with each lesson
});

// Schema for sections in modules
const sectionSchema = new mongoose.Schema({
  sectionTitle: { type: String, required: true },
  lessons: [lessonSchema], // Each section can have multiple lessons
});

// Schema for modules in courses
const moduleSchema = new mongoose.Schema({
  moduleTitle: { type: String, required: true },
  sections: [sectionSchema], // Each module can have multiple sections
});

// Main course schema
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String }, // URL or path to course image
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  modules: [moduleSchema], // Each course can have multiple modules
  finalQuiz: [questionSchema], // Final course quiz (if any)
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
