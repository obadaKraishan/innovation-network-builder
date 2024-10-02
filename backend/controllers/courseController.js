const mongoose = require('mongoose');
const sanitizeHtml = require('sanitize-html');
const fs = require('fs');
const path = require('path');
const { Course, Quiz } = require('../models/courseModel'); // Make sure this is the correct path and Course is destructured
const User = require('../models/userModel');

// Create a new course
const createCourse = async (req, res) => {
  try {
    // Sanitize lesson text in all modules, sections, and lessons
    req.body.modules.forEach(module => {
      module.sections.forEach(section => {
        section.lessons.forEach(lesson => {
          lesson.lessonText = sanitizeHtml(lesson.lessonText); // Sanitize lessonText
        });
      });
    });

    const newCourse = new Course({
      ...req.body,
      creatorId: req.user ? req.user._id : 'dummyUserId',
    });
    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    res.status(400).json({ message: 'Error creating course', error });
  }
};

// Fetch all courses
const getAllCourses = async (req, res) => {
  try {
    console.log('Fetching all courses...');
    const courses = await Course.find().populate('creatorId', 'name');
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(400).json({ message: 'Error fetching courses', error });
  }
};

// Fetch course details
const getCourseById = async (req, res) => {
  try {
    console.log('Fetching course details for courseId:', req.params.id);

    const course = await Course.findById(req.params.id).populate('creatorId', 'name');
    if (!course) {
      console.log('Course not found:', req.params.id);
      return res.status(404).json({ message: 'Course not found' });
    }
    console.log('Course found:', course.title);

    res.json(course);
  } catch (error) {
    console.error('Error fetching course details:', error);
    res.status(400).json({ message: 'Error fetching course details', error });
  }
};

// Fetch lesson details
const getLessonById = async (req, res) => {
  const { courseId, moduleId, sectionId, lessonId } = req.params;

  try {
    console.log('Fetching lesson details for courseId:', courseId, 'moduleId:', moduleId, 'sectionId:', sectionId, 'lessonId:', lessonId);

    const course = await Course.findById(courseId);
    if (!course) {
      console.log('Course not found:', courseId);
      return res.status(404).json({ message: 'Course not found' });
    }
    console.log('Course found:', course.title);

    const module = course.modules.id(moduleId);
    if (!module) {
      console.log('Module not found:', moduleId);
      return res.status(404).json({ message: 'Module not found' });
    }
    console.log('Module found:', module.moduleTitle);

    const section = module.sections.id(sectionId);
    if (!section) {
      console.log('Section not found:', sectionId);
      return res.status(404).json({ message: 'Section not found' });
    }
    console.log('Section found:', section.sectionTitle);

    const lessonIndex = section.lessons.findIndex(lesson => lesson._id.toString() === lessonId);
    if (lessonIndex === -1) {
      console.log('Lesson not found:', lessonId);
      return res.status(404).json({ message: 'Lesson not found' });
    }
    console.log('Lesson found:', section.lessons[lessonIndex].lessonTitle);

    const lesson = section.lessons[lessonIndex];
    
    // Check if previous and next lesson IDs exist
    const previousLessonId = lessonIndex > 0 ? section.lessons[lessonIndex - 1]._id : null;
    const nextLessonId = lessonIndex < section.lessons.length - 1 ? section.lessons[lessonIndex + 1]._id : null;

    res.json({ lesson, previousLessonId, nextLessonId });
  } catch (error) {
    console.error('Error fetching lesson details:', error);
    res.status(400).json({ message: 'Error fetching lesson details', error });
  }
};

// Enroll in a course
const enrollCourse = async (req, res) => {
  const { userId } = req.body;
  const { id: courseId } = req.params;

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.enrolledCourses.includes(courseId)) {
      user.enrolledCourses.push(courseId);
      await user.save();
    }

    res.status(200).json({ message: 'Enrolled in course successfully', course });
  } catch (error) {
    res.status(400).json({ message: 'Error enrolling in course', error });
  }
};

// Submit quiz answers and track progress
const submitQuiz = async (req, res) => {
  const { courseId, moduleId, sectionId, quizId, userId, answers } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const module = course.modules.id(moduleId);
    const section = module.sections.id(sectionId);
    const quiz = section.quiz.id(quizId);

    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    let score = 0;

    quiz.questions.forEach((question, index) => {
      const userAnswer = answers[index];

      if (question.type === 'text' && question.correctAnswer === userAnswer) {
        score += 1;
      } else if (['radio', 'select'].includes(question.type) && question.correctAnswer === userAnswer) {
        score += 1;
      } else if (question.type === 'checkbox') {
        const correctAnswers = question.correctAnswer.split(','); // Assuming correctAnswer is a comma-separated string
        if (correctAnswers.every((ans) => userAnswer.includes(ans))) {
          score += 1;
        }
      }
    });

    const totalQuestions = quiz.questions.length;
    const percentage = (score / totalQuestions) * 100;

    // Save progress
    const user = await User.findById(userId);
    const progress = user.courseProgress.find(
      (p) => p.courseId.toString() === courseId
    );

    if (!progress) {
      user.courseProgress.push({
        courseId,
        progress: percentage >= 80 ? 100 : (moduleId + 1 / course.modules.length) * 100,
        completed: percentage >= 80,
      });
    } else {
      progress.progress += (moduleId + 1 / course.modules.length) * 100;
      if (percentage >= 80) {
        progress.completed = true;
        progress.progress = 100;
      }
    }

    await user.save();

    res.json({ message: 'Quiz submitted successfully', score, totalQuestions, percentage });
  } catch (error) {
    res.status(400).json({ message: 'Error submitting quiz', error });
  }
};

// Function to handle course materials upload
const uploadCourseMaterials = async (req, res) => {
  const { moduleIndex, sectionIndex, lessonIndex } = req.body; // Get specific indices

  try {
    const { id } = req.params; // Get course id from request parameters
    const { title, materialType } = req.body; // Extract title and materialType from the request

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    // Add uploaded materials only to the specific lesson
    const materialUrls = req.files.map((file) => ({
      materialUrl: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`, // Full URL to access the uploaded file
      title, // Title provided by the user
      materialType, // Material type provided by the user
    }));

    // Add uploaded materials only to the specific lesson
    const lesson = course.modules[moduleIndex].sections[sectionIndex].lessons[lessonIndex];
    lesson.materials.push(...materialUrls);

    await course.save();
    res.status(200).json({ materialUrls });
  } catch (error) {
    console.error('Error uploading materials:', error);
    res.status(500).json({ message: 'Error uploading materials', error });
  }
};

// Delete a material from a lesson
const deleteMaterial = async (req, res) => {
  const { id: courseId, materialId } = req.params;

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    course.modules.forEach((module) => {
      module.sections.forEach((section) => {
        section.lessons.forEach((lesson) => {
          const materialIndex = lesson.materials.findIndex(material => material._id.toString() === materialId);
          if (materialIndex !== -1) {
            // Remove the material from the array
            const material = lesson.materials[materialIndex];
            lesson.materials.splice(materialIndex, 1);
            // Optionally delete the file from the server
            const filePath = path.join(__dirname, '..', material.materialUrl);
            fs.unlink(filePath, (err) => {
              if (err) console.error('Error deleting file:', err);
            });
          }
        });
      });
    });

    await course.save();
    res.status(200).json({ message: 'Material deleted successfully' });
  } catch (error) {
    console.error('Error deleting material:', error);
    res.status(500).json({ message: 'Error deleting material', error });
  }
};

// Track course progress for a user
const trackProgress = async (req, res) => {
  const { userId, courseId } = req.params;

  try {
    const user = await User.findById(userId);
    const progress = user.courseProgress.find(
      (p) => p.courseId.toString() === courseId
    );

    if (!progress) {
      return res.status(404).json({ message: 'No progress found for this course' });
    }

    res.json({ progress });
  } catch (error) {
    res.status(400).json({ message: 'Error fetching progress', error });
  }
};

// Issue certificate upon course completion
const issueCertificate = async (req, res) => {
  const { userId, courseId } = req.params;

  try {
    const user = await User.findById(userId);
    const progress = user.courseProgress.find(
      (p) => p.courseId.toString() === courseId
    );

    if (!progress || !progress.completed) {
      return res.status(400).json({ message: 'Course not completed yet' });
    }

    const course = await Course.findById(courseId);

    if (!course.certificateIssued) {
      course.certificateIssued = true;
      await course.save();
    }

    res.json({ message: 'Certificate issued', course });
  } catch (error) {
    res.status(400).json({ message: 'Error issuing certificate', error });
  }
};

// Post a Q&A question
const postQuestion = async (req, res) => {
  const { courseId, questionText, userId } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    course.qa.push({ questionText, postedBy: userId });
    await course.save();

    res.status(201).json({ message: 'Question posted successfully', course });
  } catch (error) {
    res.status(400).json({ message: 'Error posting question', error });
  }
};

// Post an answer to a Q&A question
const postAnswer = async (req, res) => {
  const { courseId, questionId, answerText, userId } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const question = course.qa.id(questionId);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    question.answers.push({ answerText, answeredBy: userId });
    await course.save();

    res.status(201).json({ message: 'Answer posted successfully', course });
  } catch (error) {
    res.status(400).json({ message: 'Error posting answer', error });
  }
};

// Upvote an answer in the Q&A section
const upvoteAnswer = async (req, res) => {
  const { courseId, questionId, answerId } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const question = course.qa.id(questionId);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    const answer = question.answers.id(answerId);
    if (!answer) return res.status(404).json({ message: 'Answer not found' });

    answer.upvotes += 1;
    await course.save();

    res.status(200).json({ message: 'Upvote successful', course });
  } catch (error) {
    res.status(400).json({ message: 'Error upvoting answer', error });
  }
};

// Update course details
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Validate and sanitize lesson text in all modules, sections, and lessons
    req.body.modules.forEach(module => {
      module.sections.forEach(section => {
        section.lessons.forEach(lesson => {
          if (lesson.lessonText) {
            lesson.lessonText = sanitizeHtml(lesson.lessonText);
          }
        });
      });
    });

    Object.assign(course, req.body);
    const updatedCourse = await course.save();

    console.log('Course updated:', updatedCourse);
    res.json(updatedCourse);
  } catch (error) {
    console.error('Error updating course:', error.message);
    res.status(400).json({ message: 'Error updating course', error: error.message });
  }
};


// Create a new quiz
const createQuiz = async (req, res) => {
  const { courseId, moduleId, sectionId, lessonId, quizTitle, questions, isTimed, randomizeQuestions } = req.body;

  try {
    console.log("Creating a new quiz with data:", req.body); // Log the incoming data

    const quiz = new Quiz({
      quizTitle,
      questions,
      isTimed,
      randomizeQuestions,
      courseId,
      moduleId,
      sectionId,
      lessonId,
    });

    const savedQuiz = await quiz.save();
    console.log("Quiz saved successfully:", savedQuiz); // Log success

    res.status(201).json(savedQuiz);
  } catch (error) {
    console.error("Error creating quiz:", error); // Log the error
    res.status(400).json({ message: 'Error creating quiz', error });
  }
};

// Get quizzes by lesson
const getQuizzesByLesson = async (req, res) => {
  const { lessonId } = req.params;
  try {
    const quizzes = await Quiz.find({ lessonId });
    res.json(quizzes);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching quizzes', error });
  }
};

// Assign quiz to a lesson
const assignQuizToLesson = async (req, res) => {
  const { courseId, moduleId, sectionId, lessonId, quizId } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const module = course.modules.id(moduleId);
    const section = module.sections.id(sectionId);
    const lesson = section.lessons.id(lessonId);

    lesson.quiz.push(quizId);  // Assign quiz to the lesson

    await course.save();
    res.json({ message: 'Quiz assigned successfully', course });
  } catch (error) {
    res.status(400).json({ message: 'Error assigning quiz', error });
  }
};

 // Fetch all quizzes
 const getAllQuizzes = async (req, res) => {
  try {
    console.log('Fetching all quizzes...');
    
    const quizzes = await Quiz.find()
      .populate('courseId', 'title')
      .populate('moduleId', 'moduleTitle') // Populate Module reference
      .populate('sectionId', 'sectionTitle') // Populate Section reference
      .populate('lessonId', 'lessonTitle'); // Populate Lesson reference

    console.log('Quizzes fetched successfully:', quizzes);
    res.status(200).json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(400).json({ message: 'Error fetching quizzes', error });
  }
};

// Fetch a single quiz by ID
const getQuizById = async (req, res) => {
  try { 
    console.log('Fetching quiz by ID:', req.params.id);

    // Ensure the provided ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid quiz ID' });
    }

    const quiz = await Quiz.findById(req.params.id)
      .populate('courseId', 'title')
      .populate('moduleId', 'moduleTitle')
      .populate('sectionId', 'sectionTitle')
      .populate('lessonId', 'lessonTitle');

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.status(200).json(quiz);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(400).json({ message: 'Error fetching quiz', error });
  }
};

// Update quiz
const updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.status(200).json(quiz);
  } catch (error) {
    res.status(400).json({ message: 'Error updating quiz', error });
  }
};

// Delete a quiz
const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.status(200).json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting quiz', error });
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  getLessonById,
  enrollCourse,
  uploadCourseMaterials,
  deleteMaterial,
  submitQuiz,
  trackProgress,
  issueCertificate,
  postQuestion,
  postAnswer,
  upvoteAnswer,
  updateCourse,
  createQuiz,
  getQuizzesByLesson,
  assignQuizToLesson,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
};
