const mongoose = require('mongoose');

// Schema for quiz questions with multiple types
const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['text', 'radio', 'checkbox', 'select', 'date'], 
    required: true 
  },
  choices: [String],
  correctAnswer: { type: String },
  isTimed: { type: Boolean, default: false },
  randomizeQuestions: { type: Boolean, default: false },
});

// Schema for quiz with references to course, module, section, and lesson
const quizSchema = new mongoose.Schema({
  quizTitle: { type: String, required: true },
  questions: [questionSchema],
  isTimed: { type: Boolean, default: false },
  randomizeQuestions: { type: Boolean, default: false },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },  
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },  
  sectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true }, 
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },   
  isFinalQuiz: { type: Boolean, default: false }
}, { timestamps: true });

// Schema for lesson materials
const materialSchema = new mongoose.Schema({
  materialType: { type: String, enum: ['video', 'pdf'], required: true },
  materialUrl: { type: String }, 
  title: { type: String, required: true },
  description: { type: String }
});

// Schema for lessons in sections
const lessonSchema = new mongoose.Schema({
  lessonTitle: { type: String, required: true },
  description: { type: String },
  lessonText: { type: String },
  materials: [materialSchema],
  quiz: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }],  
});

// Schema for sections in modules
const sectionSchema = new mongoose.Schema({
  sectionTitle: { type: String, required: true },
  lessons: [lessonSchema],
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
  image: { type: String },
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  modules: [moduleSchema],
  finalQuiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },  
  estimatedDuration: { type: Number },
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
const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = { Course, Quiz };
