import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../utils/api";
import Sidebar from "./Sidebar";
import { FaArrowLeft } from "react-icons/fa";

const CourseQuizDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [course, setCourse] = useState(null);
  const [module, setModule] = useState(null);
  const [section, setSection] = useState(null);
  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        const { data: quizData } = await api.get(`/courses/quizzes/${id}`);
        console.log("Quiz Data:", quizData); // Log the full quiz data to verify its structure
        setQuiz(quizData);
  
        let { courseId, moduleId, sectionId, lessonId } = quizData;
  
        // Ensure these are strings and not objects
        if (typeof courseId === "object" && courseId._id)
          courseId = courseId._id;
        if (typeof moduleId === "object" && moduleId._id)
          moduleId = moduleId._id;
        if (typeof sectionId === "object" && sectionId._id)
          sectionId = sectionId._id;
        if (typeof lessonId === "object" && lessonId._id)
          lessonId = lessonId._id;
  
        // Fetch related data
        const { data: courseData } = await api.get(`/courses/${courseId}`);
        setCourse(courseData);
  
        const selectedModule = courseData.modules.find(
          (mod) => mod._id === moduleId
        );
        setModule(selectedModule);
  
        const selectedSection = selectedModule.sections.find(
          (sec) => sec._id === sectionId
        );
        setSection(selectedSection);
  
        const selectedLesson = selectedSection.lessons.find(
          (les) => les._id === lessonId
        );
        setLesson(selectedLesson);
      } catch (error) {
        toast.error("Error fetching quiz details");
      }
    };
  
    fetchQuizDetails();
  }, [id]);  

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  if (!quiz || !course || !module || !section || !lesson)
    return <div>Loading...</div>;

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="mb-4 bg-blue-500 text-white py-2 px-4 rounded inline-flex items-center hover:bg-blue-600 transition"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>

        <h2 className="font-bold text-3xl mb-6 text-gray-700">Quiz Details</h2>

        {/* Course, Module, Section, and Lesson Details */}
        <div className="mb-6 p-6 bg-white shadow-md rounded-lg">
          <h3 className="font-bold text-xl text-gray-700 mb-2">
            Course Information
          </h3>
          <p className="text-lg text-gray-900">
            <strong>Course:</strong> {course.title}
          </p>
          <p className="text-lg text-gray-900">
            <strong>Module:</strong> {module.moduleTitle}
          </p>
          <p className="text-lg text-gray-900">
            <strong>Section:</strong> {section.sectionTitle}
          </p>
          <p className="text-lg text-gray-900">
            <strong>Lesson:</strong> {lesson.lessonTitle}
          </p>
        </div>

        {/* Quiz Title */}
        <div className="mb-6 p-6 bg-white shadow-md rounded-lg">
          <h3 className="font-bold text-xl text-gray-700 mb-2">Quiz Title</h3>
          <p className="text-lg text-gray-900">{quiz.quizTitle}</p>
        </div>

        {/* Quiz Settings */}
        <div className="mb-6 p-6 bg-white shadow-md rounded-lg">
          <h3 className="font-bold text-xl text-gray-700 mb-2">
            Quiz Settings
          </h3>
          <ul className="list-disc pl-6">
            <li>
              <strong>Timed:</strong> {quiz.isTimed ? "Yes" : "No"}
            </li>
            <li>
              <strong>Randomize Questions:</strong>{" "}
              {quiz.randomizeQuestions ? "Yes" : "No"}
            </li>
          </ul>
        </div>

        {/* Quiz Questions */}
        <div className="p-6 bg-white shadow-md rounded-lg">
          <h3 className="font-bold text-xl text-gray-700 mb-4">Questions</h3>
          {quiz.questions.length > 0 ? (
            <div className="space-y-4">
              {quiz.questions.map((question, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg shadow-inner"
                >
                  <p className="text-lg font-semibold text-gray-900 mb-2">
                    Question {index + 1}
                  </p>
                  <p>
                    <strong>Type:</strong> {question.type}
                  </p>
                  <p>
                    <strong>Text:</strong> {question.questionText}
                  </p>

                  {["radio", "checkbox", "select"].includes(question.type) && (
                    <div className="mt-2">
                      <p className="font-bold">Choices:</p>
                      <ul className="list-inside list-disc pl-6">
                        {question.choices.map((choice, choiceIndex) => (
                          <li key={choiceIndex} className="text-gray-700">
                            {choice}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <p className="mt-2">
                    <strong>Correct Answer:</strong>{" "}
                    {question.correctAnswer || "N/A"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>No questions available for this quiz.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseQuizDetails;
