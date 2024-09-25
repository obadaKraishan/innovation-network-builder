const Course = require('../models/courseModel');
const User = require('../models/userModel');

// Create a new course
const createCourse = async (req, res) => {
  try {
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
    const course = await Course.findById(req.params.id).populate('creatorId', 'name');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching course details', error });
  }
};

// Fetch lesson details
const getLessonById = async (req, res) => {
    const { courseId, moduleId, sectionId, lessonId } = req.params;
  
    try {
      const course = await Course.findById(courseId);
      if (!course) return res.status(404).json({ message: 'Course not found' });
  
      const module = course.modules.id(moduleId);
      const section = module.sections.id(sectionId);
      const lesson = section.lessons.id(lessonId);
  
      if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
  
      res.json(lesson);
    } catch (error) {
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

    Object.assign(course, req.body);
    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (error) {
    res.status(400).json({ message: 'Error updating course', error });
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  getLessonById,
  enrollCourse,
  submitQuiz,
  trackProgress,
  issueCertificate,
  postQuestion,
  postAnswer,
  upvoteAnswer,
  updateCourse,
};
