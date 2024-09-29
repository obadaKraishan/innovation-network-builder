import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaPlusCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../utils/api";
import Sidebar from "./Sidebar"; // Import the sidebar component

const questionTypes = [
  { value: "text", label: "Text" },
  { value: "radio", label: "Multiple Choice (Radio)" },
  { value: "checkbox", label: "Multiple Choice (Checkbox)" },
  { value: "select", label: "Dropdown" },
  { value: "date", label: "Date Picker" },
];

const CourseQuizForm = () => {
  const { control } = useForm();
  const [quiz, setQuiz] = useState({
    quizTitle: "",
    questions: [{ type: "text", label: "", options: [], correctAnswer: "" }],
    isTimed: false,
    randomizeQuestions: false,
  });

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);

  // Fetch all courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await api.get("/courses");
        setCourses(
          data.map((course) => ({ value: course._id, label: course.title }))
        );
      } catch (error) {
        toast.error("Error fetching courses");
      }
    };
    fetchCourses();
  }, []);

  // Fetch full course details when a course is selected
  const fetchCourseDetails = async (courseId) => {
    try {
      const { data } = await api.get(`/courses/${courseId}`);
      setSelectedCourse(data); // Set the full course object including modules
    } catch (error) {
      toast.error("Error fetching course details");
    }
  };

  const handleQuizChange = (e) => {
    setQuiz({ ...quiz, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...quiz.questions];

    // For options field, split by comma and trim spaces
    if (field === "options") {
      const trimmedOptions = value.split(",").map((opt) => opt.trim());
      updatedQuestions[index][field] = trimmedOptions;
    } else {
      updatedQuestions[index][field] = value;
    }

    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const addQuestion = () => {
    setQuiz({
      ...quiz,
      questions: [
        ...quiz.questions,
        { type: "text", label: "", options: [], correctAnswer: "" },
      ],
    });
  };

  const handleAddQuiz = async () => {
    if (
      !selectedCourse ||
      !selectedModule ||
      !selectedSection ||
      !selectedLesson
    ) {
      return toast.error("Please select course, module, section, and lesson");
    }
  
    try {
      const quizData = {
        ...quiz,
        courseId: selectedCourse._id, // Use the full course object
        moduleId: selectedModule._id,
        sectionId: selectedSection._id,
        lessonId: selectedLesson._id,
      };
  
      // Add the API request here
      await api.post("/api/courses/quizzes/create", quizData);
  
      toast.success("Quiz added successfully!");
      setQuiz({
        quizTitle: "",
        questions: [
          { type: "text", label: "", options: [], correctAnswer: "" },
        ],
        isTimed: false,
        randomizeQuestions: false,
      });
    } catch (error) {
      console.error("Error adding quiz:", error);
      toast.error("Error adding quiz");
    }
  };  

  const removeQuestion = (index) => {
    setQuiz({
      ...quiz,
      questions: quiz.questions.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="flex h-screen">
      <Sidebar /> {/* Sidebar added here */}
      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        <h4 className="font-bold">Create a New Quiz</h4>

        {/* Select Course */}
        <Select
          options={courses}
          placeholder="Select Course"
          value={
            selectedCourse
              ? { value: selectedCourse._id, label: selectedCourse.title }
              : null
          }
          onChange={(selected) => {
            fetchCourseDetails(selected.value); // Fetch course details when a course is selected
            setSelectedModule(null);
            setSelectedSection(null);
            setSelectedLesson(null);
          }}
        />

        {/* Select Module */}
        {selectedCourse && (
          <Select
            options={selectedCourse.modules.map((module) => ({
              value: module._id,
              label: module.moduleTitle,
            }))}
            placeholder="Select Module"
            value={
              selectedModule
                ? {
                    value: selectedModule._id,
                    label: selectedModule.moduleTitle,
                  }
                : null
            }
            onChange={(selected) => {
              const module = selectedCourse.modules.find(
                (mod) => mod._id === selected.value
              );
              setSelectedModule(module);
              setSelectedSection(null);
              setSelectedLesson(null);
            }}
          />
        )}

        {/* Select Section */}
        {selectedModule && (
          <Select
            options={selectedModule.sections.map((section) => ({
              value: section._id,
              label: section.sectionTitle,
            }))}
            placeholder="Select Section"
            value={
              selectedSection
                ? {
                    value: selectedSection._id,
                    label: selectedSection.sectionTitle,
                  }
                : null
            }
            onChange={(selected) => {
              const section = selectedModule.sections.find(
                (sec) => sec._id === selected.value
              );
              setSelectedSection(section);
              setSelectedLesson(null);
            }}
          />
        )}

        {/* Select Lesson */}
        {selectedSection && (
          <Select
            options={selectedSection.lessons.map((lesson) => ({
              value: lesson._id,
              label: lesson.lessonTitle,
            }))}
            placeholder="Select Lesson"
            value={
              selectedLesson
                ? {
                    value: selectedLesson._id,
                    label: selectedLesson.lessonTitle,
                  }
                : null
            }
            onChange={(selected) => {
              const lesson = selectedSection.lessons.find(
                (les) => les._id === selected.value
              );
              setSelectedLesson(lesson);
            }}
          />
        )}

        {/* Quiz Title */}
        <input
          type="text"
          name="quizTitle"
          value={quiz.quizTitle}
          onChange={handleQuizChange}
          placeholder="Quiz Title"
          className="w-full p-3 border border-gray-300 rounded mt-2"
        />

        {/* Questions */}
        {quiz.questions.map((question, index) => (
          <div key={index} className="mt-4 p-4 border rounded-lg bg-gray-100">
            <div className="flex justify-between">
              <input
                type="text"
                name="label"
                value={question.label}
                onChange={(e) =>
                  handleQuestionChange(index, "label", e.target.value)
                }
                placeholder="Question Title"
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              <button
                type="button"
                onClick={() => removeQuestion(index)}
                className="text-red-500 ml-2"
              >
                Remove
              </button>
            </div>

            {/* Question Type */}
            <div className="mb-2">
              <label>Question Type</label>
              <Select
                options={questionTypes}
                onChange={(selected) =>
                  handleQuestionChange(index, "type", selected.value)
                }
                defaultValue={questionTypes.find(
                  (type) => type.value === question.type
                )}
              />
            </div>

            {/* Options for Radio, Checkbox, Select */}
            {["radio", "checkbox", "select"].includes(question.type) && (
              <div className="mb-4">
                <label>Options (comma-separated)</label>
                <input
                  type="text"
                  value={question.options.join(", ")}
                  onChange={(e) =>
                    handleQuestionChange(index, "options", e.target.value)
                  }
                  placeholder="Option1, Option2, Option3"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            )}

            {/* Correct Answer */}
            <div className="mb-4">
              <label>Correct Answer</label>
              <input
                type="text"
                value={question.correctAnswer}
                onChange={(e) =>
                  handleQuestionChange(index, "correctAnswer", e.target.value)
                }
                placeholder="Enter correct answer"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            {/* Date Picker for Date Questions */}
            {question.type === "date" && (
              <div className="mb-4">
                <label>Select Default Date</label>
                <Controller
                  control={control}
                  name={`questions[${index}].defaultDate`}
                  render={({ field }) => (
                    <DatePicker
                      className="w-full p-2 border border-gray-300 rounded"
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                    />
                  )}
                />
              </div>
            )}
          </div>
        ))}

        {/* Add Question Button */}
        <button
          type="button"
          onClick={addQuestion}
          className="text-blue-500 hover:underline mt-2 flex items-center"
        >
          <FaPlusCircle className="mr-2" /> Add Question
        </button>

        {/* Timed and Randomize Options */}
        <div className="flex items-center mt-4">
          <label className="flex items-center mr-4">
            <input
              type="checkbox"
              name="isTimed"
              checked={quiz.isTimed}
              onChange={(e) => setQuiz({ ...quiz, isTimed: e.target.checked })}
              className="mr-2"
            />
            Timed Quiz
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              name="randomizeQuestions"
              checked={quiz.randomizeQuestions}
              onChange={(e) =>
                setQuiz({ ...quiz, randomizeQuestions: e.target.checked })
              }
              className="mr-2"
            />
            Randomize Questions
          </label>
        </div>

        {/* Submit Quiz Button */}
        <button
          type="button"
          onClick={handleAddQuiz}
          className="mt-4 bg-green-500 text-white py-2 px-4 rounded flex items-center"
        >
          Add Quiz
        </button>
      </div>
    </div>
  );
};

export default CourseQuizForm;
