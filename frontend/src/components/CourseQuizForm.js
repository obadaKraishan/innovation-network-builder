// File: frontend/src/components/CourseQuizForm.js
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaPlusCircle } from 'react-icons/fa';

const questionTypes = [
  { value: 'text', label: 'Text' },
  { value: 'radio', label: 'Multiple Choice (Radio)' },
  { value: 'checkbox', label: 'Multiple Choice (Checkbox)' },
  { value: 'select', label: 'Dropdown' },
  { value: 'date', label: 'Date Picker' },
];

const CourseQuizForm = ({ moduleIndex, modules, setModules }) => {
  const { control } = useForm();
  const [quiz, setQuiz] = useState({
    quizTitle: '',
    questions: [{ type: 'text', label: '', options: [] }],
    isTimed: false,
    randomizeQuestions: false,
  });

  const handleQuizChange = (e) => {
    setQuiz({ ...quiz, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[index][field] = value;
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const addQuestion = () => {
    setQuestions([...quiz.questions, { type: 'text', label: '', options: [] }]);
  };

  const handleAddQuiz = () => {
    const updatedModules = [...modules];
    if (!updatedModules[moduleIndex].quiz) {
      updatedModules[moduleIndex].quiz = [];
    }
    updatedModules[moduleIndex].quiz.push(quiz);
    setModules(updatedModules);
    setQuiz({
      quizTitle: '',
      questions: [{ type: 'text', label: '', options: [] }],
      isTimed: false,
      randomizeQuestions: false,
    });
  };

  const removeQuestion = (index) => {
    setQuiz({
      ...quiz,
      questions: quiz.questions.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="mt-6">
      <h4 className="font-bold">Add Quiz</h4>

      <input
        type="text"
        name="quizTitle"
        value={quiz.quizTitle}
        onChange={handleQuizChange}
        placeholder="Quiz Title"
        className="w-full p-3 border border-gray-300 rounded mt-2"
      />

      {quiz.questions.map((question, index) => (
        <div key={index} className="mt-4 p-4 border rounded-lg bg-gray-100">
          <div className="flex justify-between">
            <input
              type="text"
              name="label"
              value={question.label}
              onChange={(e) => handleQuestionChange(index, 'label', e.target.value)}
              placeholder="Question Title"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <button type="button" onClick={() => removeQuestion(index)} className="text-red-500 ml-2">
              Remove
            </button>
          </div>

          <div className="mb-2">
            <label>Question Type</label>
            <Select
              options={questionTypes}
              onChange={(selected) => handleQuestionChange(index, 'type', selected.value)}
              defaultValue={questionTypes.find((type) => type.value === question.type)}
            />
          </div>

          {['radio', 'checkbox', 'select'].includes(question.type) && (
            <div className="mb-4">
              <label>Options (comma-separated)</label>
              <input
                type="text"
                value={question.options.join(', ')}
                onChange={(e) => handleQuestionChange(index, 'options', e.target.value.split(','))}
                placeholder="Option1, Option2, Option3"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          )}

          {question.type === 'date' && (
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

      <button
        type="button"
        onClick={addQuestion}
        className="text-blue-500 hover:underline mt-2 flex items-center"
      >
        <FaPlusCircle className="mr-2" /> Add Question
      </button>

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
            onChange={(e) => setQuiz({ ...quiz, randomizeQuestions: e.target.checked })}
            className="mr-2"
          />
          Randomize Questions
        </label>
      </div>

      <button
        type="button"
        onClick={handleAddQuiz}
        className="mt-4 bg-green-500 text-white py-2 px-4 rounded flex items-center"
      >
        Add Quiz
      </button>
    </div>
  );
};

export default CourseQuizForm;
