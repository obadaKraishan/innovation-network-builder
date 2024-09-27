import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import api from "../utils/api";
import { toast } from "react-toastify";
import { FaCertificate } from "react-icons/fa";
import { Link } from "react-router-dom";

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const { data } = await api.get(`/courses/${id}`);
        setCourse(data);
      } catch (error) {
        toast.error("Failed to load course details");
      }
    };

    fetchCourseDetails();
  }, [id]);

  if (!course) return <div>Loading...</div>;

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <button
          onClick={() => window.history.back()}
          className="mb-4 bg-blue-500 text-white py-2 px-4 rounded"
        >
          ← Back
        </button>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">{course.title}</h2>
          <p className="text-gray-700 mb-4">{course.description}</p>
          <p className="text-gray-500 mb-4">
            Duration: {course.estimatedDuration || "N/A"} hours
          </p>
          <p className="text-gray-500 mb-4">
            Skills:{" "}
            {course.skillsGained?.length
              ? course.skillsGained.join(", ")
              : "N/A"}
          </p>

          {/* Modules */}
          <div className="modules">
            {course.modules?.length > 0 ? (
              course.modules.map((module, moduleIndex) => (
                <div
                  key={moduleIndex}
                  className="module bg-gray-100 p-4 rounded-lg mb-4"
                >
                  <h3 className="text-lg font-bold">{module.moduleTitle}</h3>
                  {module.sections?.length > 0 ? (
                    module.sections.map((section, sectionIndex) => (
                      <div
                        key={sectionIndex}
                        className="section bg-white p-4 rounded-lg shadow-md mb-2"
                      >
                        <h4 className="text-md font-semibold">
                          {section.sectionTitle}
                        </h4>
                        <ul className="lessons-list">
                          {section.lessons?.length > 0 ? (
                            section.lessons.map((lesson) => (
                              <li key={lesson._id} className="lesson mb-2">
                                <Link
                                  to={`/courses/${id}/module/${module._id}/section/${section._id}/lesson/${lesson._id}`}
                                >
                                  {lesson.lessonTitle}
                                </Link>
                              </li>
                            ))
                          ) : (
                            <p>No lessons available.</p>
                          )}
                        </ul>

                        {/* Quiz Section */}
                        {section.quiz?.length > 0 && (
                          <div className="quiz mt-4">
                            <h4 className="text-md font-semibold">Quiz</h4>
                            {section.quiz.map((quiz, quizIndex) => (
                              <p key={quizIndex}>{quiz.questionText}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p>No sections available.</p>
                  )}
                </div>
              ))
            ) : (
              <p>No modules available for this course.</p>
            )}
          </div>

          {/* Certificate Button */}
          {course.certificateIssued && (
            <button className="mt-4 bg-green-500 text-white p-3 rounded-lg flex items-center">
              <FaCertificate className="mr-2" /> Download Certificate
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
