import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AiOutlineSave, AiOutlineRollback, AiOutlinePlusCircle } from "react-icons/ai";
import api from "../utils/api";
import Sidebar from "./Sidebar";
import CourseMaterialUpload from "./CourseMaterialUpload";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // ReactQuill styling

const CourseEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Ensure default values for all fields to prevent controlled/uncontrolled warnings
  const [course, setCourse] = useState({
    title: "",
    description: "",
    image: "",
    estimatedDuration: 0,
    skillsGained: [""],
    courseRequirements: [""],
    objectives: "",
    modules: [], // Initialize as an empty array
  });

  // Fetch course details
  const fetchCourse = async () => {
    try {
      const { data } = await api.get(`/courses/${id}`);
      const courseData = {
        ...data,
        modules: data.modules || [], // Ensure modules is an array
        skillsGained: data.skillsGained.length ? data.skillsGained : [""], // Prevent undefined array
        courseRequirements: data.courseRequirements.length ? data.courseRequirements : [""], // Prevent undefined array
        description: data.description || "", // Prevent undefined description
      };
      setCourse(courseData);
    } catch (error) {
      toast.error("Failed to load course details");
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [id]);

  // Ensure fields are valid
  const validateCourse = (courseData) => {
    const validatedCourse = { ...courseData };

    validatedCourse.skillsGained = validatedCourse.skillsGained.filter(Boolean);
    validatedCourse.courseRequirements = validatedCourse.courseRequirements.filter(Boolean);

    if (!validatedCourse.title) throw new Error("Course title is required.");
    if (!validatedCourse.description) throw new Error("Course description is required.");

    return validatedCourse;
  };

  const handleSubmit = async () => {
    try {
      const validatedCourse = validateCourse(course);
      await api.put(`/courses/${id}`, validatedCourse);
      toast.success("Course updated successfully!");
      navigate("/course-management");
    } catch (error) {
      toast.error(`Error updating course: ${error.message}`);
    }
  };

  const handleArrayChange = (field, index, value) => {
    const newArray = [...course[field]];
    newArray[index] = value;
    setCourse({ ...course, [field]: newArray });
  };

  const handleModuleChange = (moduleIndex, key, value) => {
    const newModules = [...course.modules];
    newModules[moduleIndex][key] = value;
    setCourse({ ...course, modules: newModules });
  };

  const addModule = () => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      modules: [
        ...prevCourse.modules,
        {
          moduleTitle: "",
          sections: [
            {
              sectionTitle: "",
              lessons: [
                {
                  lessonTitle: "",
                  lessonText: "",
                  materials: [],
                },
              ],
            },
          ],
        },
      ],
    }));
  };

  const addSection = (moduleIndex) => {
    const newModules = [...course.modules];
    newModules[moduleIndex].sections.push({
      sectionTitle: "",
      lessons: [
        {
          lessonTitle: "",
          lessonText: "",
          materials: [],
        },
      ],
    });
    setCourse({ ...course, modules: newModules });
  };

  const addLesson = (moduleIndex, sectionIndex) => {
    const newModules = [...course.modules];
    newModules[moduleIndex].sections[sectionIndex].lessons.push({
      lessonTitle: "",
      lessonText: "",
      materials: [],
    });
    setCourse({ ...course, modules: newModules });
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        <div className="flex justify-between mb-6">
          <h2 className="text-3xl font-bold">Edit Course</h2>
          <button
            onClick={() => navigate("/course-management")}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow flex items-center"
          >
            <AiOutlineRollback className="mr-2" />
            Cancel
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
          {/* Course Title */}
          <div>
            <label className="block text-sm font-bold mb-2">Course Title</label>
            <input
              type="text"
              value={course.title || ""}
              onChange={(e) => setCourse({ ...course, title: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter course title"
            />
          </div>

          {/* Course Description */}
          <div>
            <label className="block text-sm font-bold mb-2">Description</label>
            <textarea
              value={course.description || ""}
              onChange={(e) =>
                setCourse({ ...course, description: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter course description"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-bold mb-2">Image URL</label>
            <input
              type="text"
              value={course.image || ""}
              onChange={(e) => setCourse({ ...course, image: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter image URL"
            />
          </div>

          {/* Estimated Duration */}
          <div>
            <label className="block text-sm font-bold mb-2">Estimated Duration (hours)</label>
            <input
              type="number"
              value={course.estimatedDuration || 0}
              onChange={(e) =>
                setCourse({
                  ...course,
                  estimatedDuration: Number(e.target.value),
                })
              }
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter estimated duration"
            />
          </div>

          {/* Skills Gained */}
          <div>
            <label className="block text-sm font-bold mb-2">Skills Gained</label>
            {course.skillsGained?.map((skill, index) => (
              <input
                key={index}
                type="text"
                value={skill || ""}
                onChange={(e) =>
                  handleArrayChange("skillsGained", index, e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded mb-2"
                placeholder="Enter skill"
              />
            ))}
          </div>

          {/* Course Requirements */}
          <div>
            <label className="block text-sm font-bold mb-2">Course Requirements</label>
            {course.courseRequirements?.map((requirement, index) => (
              <input
                key={index}
                type="text"
                value={requirement || ""}
                onChange={(e) =>
                  handleArrayChange("courseRequirements", index, e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded mb-2"
                placeholder="Enter requirement"
              />
            ))}
          </div>

          {/* Objectives */}
          <div>
            <label className="block text-sm font-bold mb-2">Objectives</label>
            <textarea
              value={course.objectives || ""}
              onChange={(e) =>
                setCourse({ ...course, objectives: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter objectives"
            />
          </div>

          {/* Modules */}
          <div>
            <h3 className="text-lg font-bold mb-4">Modules</h3>
            {course.modules?.map((module, moduleIndex) => (
              <div key={moduleIndex} className="mb-4 bg-gray-100 p-4 rounded">
                <label className="block text-sm font-bold mb-2">
                  Module {moduleIndex + 1}
                </label>
                <input
                  type="text"
                  value={module.moduleTitle || ""}
                  onChange={(e) =>
                    handleModuleChange(
                      moduleIndex,
                      "moduleTitle",
                      e.target.value
                    )
                  }
                  className="w-full p-3 mb-2 border border-gray-300 rounded"
                  placeholder="Module Title"
                />

                {module.sections?.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="ml-6 mb-4">
                    <label className="block text-sm font-bold mb-2">
                      Section {sectionIndex + 1}
                    </label>
                    <input
                      type="text"
                      value={section.sectionTitle || ""}
                      onChange={(e) => {
                        const newModules = [...course.modules];
                        newModules[moduleIndex].sections[
                          sectionIndex
                        ].sectionTitle = e.target.value;
                        setCourse({ ...course, modules: newModules });
                      }}
                      className="w-full p-2 mb-2 border border-gray-300 rounded"
                      placeholder="Section Title"
                    />

                    {section.lessons?.map((lesson, lessonIndex) => (
                      <div key={lessonIndex} className="ml-4 mb-2">
                        <label className="block text-sm font-bold mb-2">
                          Lesson {lessonIndex + 1}
                        </label>
                        <input
                          type="text"
                          value={lesson.lessonTitle || ""}
                          onChange={(e) => {
                            const newModules = [...course.modules];
                            newModules[moduleIndex].sections[
                              sectionIndex
                            ].lessons[lessonIndex].lessonTitle = e.target.value;
                            setCourse({ ...course, modules: newModules });
                          }}
                          className="w-full p-2 mb-2 border border-gray-300 rounded"
                          placeholder="Lesson Title"
                        />

                        {/* Lesson Text Editor */}
                        <ReactQuill
                          value={section.lessons[lessonIndex]?.lessonText || ""}
                          onChange={(content) => {
                            const updatedModules = [...course.modules];
                            updatedModules[moduleIndex].sections[
                              sectionIndex
                            ].lessons[lessonIndex].lessonText = content;
                            setCourse({ ...course, modules: updatedModules });
                          }}
                        />

                        <CourseMaterialUpload
                          moduleIndex={moduleIndex}
                          sectionIndex={sectionIndex}
                          lessonIndex={lessonIndex}
                          courseId={id}
                          modules={course.modules}
                          setModules={setCourse}
                          refreshCourse={fetchCourse}
                        />
                      </div>
                    ))}
                    <button
                      onClick={() => addLesson(moduleIndex, sectionIndex)}
                      className="text-blue-500 hover:underline mt-2"
                    >
                      Add New Lesson
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addSection(moduleIndex)}
                  className="text-blue-500 hover:underline mt-2"
                >
                  Add New Section
                </button>
              </div>
            ))}
            <button
              onClick={addModule}
              className="text-blue-500 hover:underline mt-2"
            >
              <AiOutlinePlusCircle className="mr-2" /> Add New Module
            </button>
          </div>

          {/* Save Changes Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow flex items-center"
            >
              <AiOutlineSave className="mr-2" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseEdit;
