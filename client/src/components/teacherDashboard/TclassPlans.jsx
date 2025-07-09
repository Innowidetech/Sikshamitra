import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeacherClassPlans, updateClassPlan, } from '../../redux/teacher/tcurriculumSlice';

import { FaDownload, FaPlus, FaMinus } from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Header from '../adminDashboard/layout/Header';

const formatDate = (isoDate) => {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-GB');
};

const Tclassplans = () => {
  const dispatch = useDispatch();
  const { classPlan, loading, errorMessage } = useSelector((state) => state.tcurriculum);

  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState([
    { subject: '', fields: [{ chapter: '', lessonName: '', startDate: '', endDate: '' }] },
  ]);

  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');

  const availableClasses = ['6', '7', '8', '9', '10'];
  const availableSections = ['A', 'B', 'C'];

  // Fetch class plans on filter change
  useEffect(() => {
    dispatch(fetchTeacherClassPlans({ className: selectedClass, section: selectedSection }));
  }, [dispatch, selectedClass, selectedSection]);

  const planArray = classPlan?.plan || [];

  // Filter plans based on selectedClass and selectedSection
  // (But your API likely returns filtered data anyway)
  const filteredPlans = planArray.filter(() => {
    const matchClass = selectedClass ? classPlan?.class === selectedClass : true;
    const matchSection = selectedSection ? classPlan?.section === selectedSection : true;
    return matchClass && matchSection;
  });

  const handleOpenModal = () => {
    if (planArray.length > 0) {
      const mappedFormData = planArray.map((subjectPlan) => ({
        subject: subjectPlan.subject || '',
        fields: subjectPlan.data.map((lesson) => ({
          chapter: lesson.chapter || '',
          lessonName: lesson.lessonName || '',
          startDate: lesson.startDate?.slice(0, 10) || '',
          endDate: lesson.endDate?.slice(0, 10) || '',
        })),
      }));
      setFormData(mappedFormData);
    } else {
      setFormData([{ subject: '', fields: [{ chapter: '', lessonName: '', startDate: '', endDate: '' }] }]);
    }
    setShowEditModal(true);
  };

  const downloadPdf = () => {
    const doc = new jsPDF('landscape');
    doc.setFontSize(14);
    doc.text(`Class Plan - Class ${classPlan?.class || ''} ${classPlan?.section || ''}`, 14, 20);

    const tableData = [];

    planArray.forEach((subjectPlan) => {
      const subject = subjectPlan.subject;
      subjectPlan.data.forEach((lesson, index) => {
        tableData.push([
          index === 0 ? subject : '',
          lesson.chapter,
          lesson.lessonName,
          formatDate(lesson.startDate),
          formatDate(lesson.endDate),
        ]);
      });
    });

    autoTable(doc, {
      head: [['Subject Name', 'Chapter', 'Lesson Name', 'Start Date', 'End Date']],
      body: tableData,
      startY: 30,
      theme: 'grid',
      headStyles: { fillColor: [29, 81, 137] },
      styles: { fontSize: 10, cellPadding: 3 },
    });

    doc.save('teacher-class-plan.pdf');
  };

  const addSubjectField = () => {
    setFormData([...formData, { subject: '', fields: [{ chapter: '', lessonName: '', startDate: '', endDate: '' }] }]);
  };

  const addLessonField = (index) => {
    const updatedFormData = [...formData];
    updatedFormData[index].fields.push({ chapter: '', lessonName: '', startDate: '', endDate: '' });
    setFormData(updatedFormData);
  };

  const removeField = (subjectIndex, fieldIndex) => {
    const updatedFormData = [...formData];
    updatedFormData[subjectIndex].fields = updatedFormData[subjectIndex].fields.filter((_, idx) => idx !== fieldIndex);
    setFormData(updatedFormData);
  };

  const removeSubjectField = (index) => {
    const updatedFormData = [...formData];
    updatedFormData.splice(index, 1);
    setFormData(updatedFormData);
  };

  const handleSubjectChange = (index, value) => {
    const updatedFormData = [...formData];
    updatedFormData[index].subject = value;

    const matched = planArray.find((plan) => plan.subject === value);
    if (matched) {
      updatedFormData[index].fields = matched.data.map((lesson) => ({
        chapter: lesson.chapter || '',
        lessonName: lesson.lessonName || '',
        startDate: lesson.startDate?.slice(0, 10) || '',
        endDate: lesson.endDate?.slice(0, 10) || '',
      }));
    } else {
      updatedFormData[index].fields = [{ chapter: '', lessonName: '', startDate: '', endDate: '' }];
    }

    setFormData(updatedFormData);
  };

  const handleLessonChange = (subjectIndex, fieldIndex, fieldName, value) => {
    const updatedFormData = [...formData];
    updatedFormData[subjectIndex].fields[fieldIndex][fieldName] = value;
    setFormData(updatedFormData);
  };

  const handleUpload = () => {
    const payload = {
      classId: classPlan?.classId,
      section: classPlan?.section,
      plan: formData.map((subjectData) => ({
        subject: subjectData.subject,
        data: subjectData.fields.map((field) => ({
          chapter: field.chapter,
          lessonName: field.lessonName,
          startDate: field.startDate,
          endDate: field.endDate,
        })),
      })),
    };

    dispatch(updateClassPlan(payload))
      .unwrap()
      .then(() => {
        setShowEditModal(false);
        dispatch(fetchTeacherClassPlans({ className: selectedClass, section: selectedSection }));
      })
      .catch((err) => {
        console.error('Update failed:', err);
      });
  };

  return (
    <div className="font-sans text-sm text-gray-800">
      {/* Header */}
      <div className="flex justify-between items-center mx-6 md:mx-10 md:ml-72">
        <div>
          <h1 className="text-2xl font-light text-black xl:text-[38px]">Curriculum</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
          <h1 className="mt-2">
            <span className="xl:text-[17px] text-xl">Home</span> {'>'}{' '}
            <span className="xl:text-[17px] text-xl font-medium text-[#146192]">Curriculum</span>
          </h1>
        </div>
        <Header />
      </div>

      {/* Content */}
      <div className="p-4 md:p-6 md:ml-64">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Select Class</label>
            <select
              className="px-3 py-2 border border-[#1D5189] rounded bg-white"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="">All Classes</option>
              {availableClasses.map((cls) => (
                <option key={cls} value={cls}>
                  Class {cls}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Select Section</label>
            <select
              className="px-3 py-2 border border-[#1D5189] rounded bg-white"
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
            >
              <option value="">All Sections</option>
              {availableSections.map((sec) => (
                <option key={sec} value={sec}>
                  Section {sec}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Header & Buttons */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            📘 Class Plan - Class {classPlan?.class || selectedClass || '-'} {classPlan?.section || selectedSection || '-'}
          </h2>
          <div className="flex gap-3">
            <button
              onClick={handleOpenModal}
              className={`flex items-center gap-2 px-4 py-2 text-sm text-white font-semibold rounded transition ${
                planArray.length > 0 ? 'bg-[#1D5189] hover:bg-[#17426e]' : 'bg-[#1D5189] hover:bg-[#17426e]'
              }`}
            >
              {planArray.length > 0 ? '✏️ Edit' : '➕ Create'}
            </button>
            <button
              onClick={downloadPdf}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-[#F7931E] text-white font-semibold rounded hover:bg-[#f17e00] transition"
            >
              <FaDownload />
              PDF
            </button>
          </div>
        </div>

        {/* Loading and Error */}
        {loading && <p className="p-4 text-blue-600">Loading class plans...</p>}
        {/* {errorMessage && <p className="p-4 text-red-500">Error: {errorMessage}</p>} */}

        {/* Conditional Data Display */}
        {planArray.length === 0 ? (
          <p className="text-gray-600 p-4">
            No class plans available for Class {selectedClass || '-'} {selectedSection || '-'}.
          </p>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full border-collapse text-center">
                <thead className="bg-[#1D5189] text-white text-sm font-bold uppercase">
                  <tr>
                    <th className="border border-[#B4D2E7] px-4 py-2">Subject Name</th>
                    <th className="border border-[#B4D2E7] px-4 py-2">Chapter</th>
                    <th className="border border-[#B4D2E7] px-4 py-2">Lesson Name</th>
                    <th className="border border-[#B4D2E7] px-4 py-2">Start Date</th>
                    <th className="border border-[#B4D2E7] px-4 py-2">End Date</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-center">
                  {filteredPlans.map((subjectPlan, idx) => (
                    <React.Fragment key={idx}>
                      {subjectPlan.data.map((lesson, i) => (
                        <tr key={lesson._id || `${i}-${idx}`}>
                          {i === 0 && (
                            <td
                              rowSpan={subjectPlan.data.length}
                              className="border border-[#B4D2E7] px-4 py-2 font-medium bg-[#E6F2FA] align-middle"
                            >
                              {subjectPlan.subject}
                            </td>
                          )}
                          <td className="border border-[#B4D2E7] px-4 py-2">{lesson.chapter}</td>
                          <td className="border border-[#B4D2E7] px-4 py-2">{lesson.lessonName}</td>
                          <td className="border border-[#B4D2E7] px-4 py-2">{formatDate(lesson.startDate)}</td>
                          <td className="border border-[#B4D2E7] px-4 py-2">{formatDate(lesson.endDate)}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Accordion */}
            <div className="md:hidden">
              {filteredPlans.map((subjectPlan, idx) => (
                <SubjectAccordion key={idx} subjectPlan={subjectPlan} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
    <div className="bg-white rounded max-w-4xl w-full max-h-[90vh] overflow-auto p-6 relative">
      <h3 className="text-lg font-semibold mb-4">Create / Edit Class Plan</h3>
      <button
        onClick={() => setShowEditModal(false)}
        className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-xl font-bold"
        aria-label="Close Modal"
      >
        &times;
      </button>

      <div>
        {formData.map((subjectData, subjectIndex) => (
          <div key={subjectIndex} className="mb-6 border p-4 rounded">
            <div className="flex justify-between items-center mb-3">
              <label className="block font-semibold mb-1">Subject Name</label>
              <button
                type="button"
                onClick={() => removeSubjectField(subjectIndex)}
                disabled={formData.length === 1}
                className="text-red-600 hover:text-red-800 font-bold"
              >
                <FaMinus />
              </button>
            </div>
            {/* Changed from select to input */}
            <input
              type="text"
              placeholder="Enter Subject Name"
              value={subjectData.subject}
              onChange={(e) => handleSubjectChange(subjectIndex, e.target.value)}
              className="mb-4 px-3 py-2 border border-gray-300 rounded w-full"
            />

            {subjectData.fields.map((field, fieldIndex) => (
              <div
                key={fieldIndex}
                className="mb-4 border rounded p-3 relative bg-gray-50"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Lesson {fieldIndex + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeField(subjectIndex, fieldIndex)}
                    disabled={subjectData.fields.length === 1}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaMinus />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Chapter"
                    value={field.chapter}
                    onChange={(e) =>
                      handleLessonChange(subjectIndex, fieldIndex, 'chapter', e.target.value)
                    }
                    className="px-3 py-2 border border-gray-300 rounded"
                  />
                  <input
                    type="text"
                    placeholder="Lesson Name"
                    value={field.lessonName}
                    onChange={(e) =>
                      handleLessonChange(subjectIndex, fieldIndex, 'lessonName', e.target.value)
                    }
                    className="px-3 py-2 border border-gray-300 rounded"
                  />
                  <input
                    type="date"
                    placeholder="Start Date"
                    value={field.startDate}
                    onChange={(e) =>
                      handleLessonChange(subjectIndex, fieldIndex, 'startDate', e.target.value)
                    }
                    className="px-3 py-2 border border-gray-300 rounded"
                  />
                  <input
                    type="date"
                    placeholder="End Date"
                    value={field.endDate}
                    onChange={(e) =>
                      handleLessonChange(subjectIndex, fieldIndex, 'endDate', e.target.value)
                    }
                    className="px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => addLessonField(subjectIndex)}
              className="px-3 py-1 bg-[#1D5189] hover:bg-[#17426e] text-white rounded "
            >
              + Add Lesson
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addSubjectField}
          className="px-4 py-2 bg-[#1D5189] hover:bg-[#17426e] text-white rounded  mb-4"
        >
          + Add Subject
        </button>

        <div className="flex justify-end gap-4">
          <button
            onClick={() => setShowEditModal(false)}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="px-4 py-2 bg-[#1D5189] text-white rounded hover:bg-[#17426e]"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

// Mobile Accordion for each subject plan
const SubjectAccordion = ({ subjectPlan }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-3 border rounded shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center w-full p-3 bg-[#1D5189] text-white font-semibold rounded-t"
      >
        <span>{subjectPlan.subject}</span>
        <span>{open ? <FaMinus /> : <FaPlus />}</span>
      </button>
      {open && (
        <div className="p-3 bg-gray-50">
          {subjectPlan.data.map((lesson, i) => (
            <div key={lesson._id || i} className="mb-4 border-b last:border-b-0 pb-2">
              <p>
                <strong>Chapter:</strong> {lesson.chapter}
              </p>
              <p>
                <strong>Lesson Name:</strong> {lesson.lessonName}
              </p>
              <p>
                <strong>Start Date:</strong> {formatDate(lesson.startDate)}
              </p>
              <p>
                <strong>End Date:</strong> {formatDate(lesson.endDate)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tclassplans;
