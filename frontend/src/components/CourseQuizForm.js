import React, { useState } from 'react';
import { FaPlusCircle } from 'react-icons/fa';

const CourseQuizForm = ({ moduleIndex, modules, setModules }) => {
  const [quiz, setQuiz] = useState({
    quizTitle: '',
    questions: [{ questionText: '', choices: ['', ''], correctAnswer: '' }],
    isTimed: false,
    randomizeQuestions: false,
  });

  const handleQuizChange = (e) => {
    setQuiz({ ...quiz, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (index, e) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[index][e.target.name] = e.target.value;
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const addQuestion = () => {
    setQuiz({
      ...quiz,
      questions: [...quiz.questions, { questionText: '', choices: ['', ''], correctAnswer: '' }],
    });
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
      questions: [{ questionText: '', choices: ['', ''], correctAnswer: '' }],
      isTimed: false,
      randomizeQuestions: false,
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
        <div key={index} className="mt-4">
          <input
            type="text"
            name="questionText"
            value={question.questionText}
            onChange={(e) => handleQuestionChange(index, e)}
            placeholder="Question Text"
            className="w-full p-3 border border-gray-300 rounded"
          />

          {question.choices.map((choice, i) => (
            <input
              key={i}
              type="text"
              value={choice}
              onChange={(e) => {
                const updatedChoices = [...question.choices];
                updatedChoices[i] = e.target.value;
                handleQuestionChange(index, { target: { name: 'choices', value: updatedChoices } });
              }}
              placeholder={`Choice ${i + 1}`}
              className="w-full p-3 border border-gray-300 rounded mt-2"
            />
          ))}

          <input
            type="text"
            name="correctAnswer"
            value={question.correctAnswer}
            onChange={(e) => handleQuestionChange(index, e)}
            placeholder="Correct Answer"
            className="w-full p-3 border border-gray-300 rounded mt-2"
          />
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
