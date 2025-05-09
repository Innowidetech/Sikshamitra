import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeacherClassPlans } from '../../redux/teacher/tcurriculumSlice';
import { updateClassPlan } from '../../redux/teacher/tcurriculumSlice';

import { FaDownload, FaPlus, FaMinus } from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Header from '../adminDashboard/layout/Header';

const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-GB');
};

const Tclassplans = () => {
  const dispatch = useDispatch();
  const { classPlan, loading, errorMessage } = useSelector((state) => state.tcurriculum);
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState([{ subject: '', fields: [{ chapter: '', lessonName: '', startDate: '', endDate: '' }] }]);

  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');

  const availableClasses = ['6', '7', '8', '9', '10'];
  const availableSections = ['A', 'B', 'C'];

  // Fetch class plans on filter change (selectedClass, selectedSection)
  useEffect(() => {
    dispatch(fetchTeacherClassPlans({ className: selectedClass, section: selectedSection }));
  }, [dispatch, selectedClass, selectedSection]);

  const planArray = classPlan?.plan || [];

  const filteredPlans = planArray.filter(() => {
    const matchClass = selectedClass ? classPlan.class === selectedClass : true;
    const matchSection = selectedSection ? classPlan.section === selectedSection : true;
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
        }))
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
    doc.text(`Class Plan - Class ${classPlan.class} ${classPlan.section}`, 14, 20);

    const tableData = [];

    planArray.forEach((subjectPlan) => {
      const subject = subjectPlan.subject;
      subjectPlan.data.forEach((lesson, index) => {
        tableData.push([
          index === 0 ? subject : '',
          lesson.chapter,
          lesson.lessonName,
          formatDate(lesson.startDate),
          formatDate(lesson.endDate)
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

    const matched = planArray.find(plan => plan.subject === value);
    if (matched) {
      updatedFormData[index].fields = matched.data.map(lesson => ({
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
      classId: classPlan.classId,
      section: classPlan.section,
      plan: formData.map(subjectData => ({
        subject: subjectData.subject,
        data: subjectData.fields.map(field => ({
          chapter: field.chapter,
          lessonName: field.lessonName,
          startDate: field.startDate,
          endDate: field.endDate,
        }))
      }))
    };

    dispatch(updateClassPlan(payload))
      .unwrap()
      .then(() => {
        setShowEditModal(false);
        dispatch(fetchTeacherClassPlans({ className: selectedClass, section: selectedSection }));
      })
      .catch((err) => {
        console.error("Update failed:", err);
      });
  };

  if (loading) return <p className="p-4">Loading class plans...</p>;
  if (errorMessage) return <p className="p-4 text-red-500">Error: {errorMessage}</p>;
  if (!classPlan || !planArray.length) return null;

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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            📘 Class Plan - Class {classPlan.class} {classPlan.section}
          </h2>
          <div className="flex gap-3">
            <button
              onClick={handleOpenModal}
              className={`flex items-center gap-2 px-4 py-2 text-sm text-white font-semibold rounded transition ${planArray.length > 0 ? 'bg-[#1D5189] hover:bg-[#17426e]' : 'bg-green-600 hover:bg-green-700'}`}
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

        {/* Table View */}
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
                    <tr key={lesson._id}>
                      {i === 0 && (
                        <td rowSpan={subjectPlan.data.length} className="border border-[#B4D2E7] px-4 py-2 font-medium bg-[#E6F2FA] align-middle">
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

        {/* Mobile View */}
        <div className="md:hidden space-y-6 ">
          {filteredPlans.map((subjectPlan, idx) => (
            <div key={idx}>
              {subjectPlan.data.map((lesson, i) => (
                <div key={lesson._id} className="border border-black bg-[#E6F2FA] rounded overflow-hidden">
                  {[['Subject Name', i === 0 ? subjectPlan.subject : ''], ['Chapter', lesson.chapter], ['Lesson Name', lesson.lessonName], ['Start Date', formatDate(lesson.startDate)], ['End Date', formatDate(lesson.endDate)]].map(([label, value], index) => (
                    <div key={index} className="grid grid-cols-2 border-b border-black">
                      <div className="bg-[#1D5189] text-white p-2 font-medium border-r border-black">{label}</div>
                      <div className="p-2 break-words">{value}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {showEditModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Create Class Plan</h2>
        <button onClick={() => setShowEditModal(false)} className="text-gray-600 hover:text-red-600 text-xl">×</button>
      </div>

      <p className="text-[#1D5189] font-medium mb-6">Fill and upload class plan details</p>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        {formData.map((subjectData, subjectIndex) => (
          <div key={subjectIndex} className="space-y-4">
            {/* Subject Name + Add/Remove */}
            <div>
              <label className="block text-sm font-medium mb-1">Subject Name</label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={subjectData.subject}
                  onChange={(e) => handleSubjectChange(subjectIndex, e.target.value)}
                  className="w-full bg-[#1461921A] border border-[#1D5189] rounded px-3 py-2"
                />
                <button type="button" onClick={addSubjectField} className="text-blue-500 hover:text-blue-700">
                  <FaPlus />
                </button>
                {formData.length > 1 && (
                  <button type="button" onClick={() => removeSubjectField(subjectIndex)} className="text-red-500 hover:text-red-700">
                    <FaMinus />
                  </button>
                )}
              </div>
            </div>

            {/* Lesson Fields */}
            {subjectData.fields.map((field, fieldIndex) => (
              <div key={fieldIndex} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-[#1461921A] p-4 rounded">
                <div>
                  <label className="block text-sm font-medium mb-1">Lesson Name</label>
                  <input
                    type="text"
                    value={field.lessonName}
                    onChange={(e) => handleLessonChange(subjectIndex, fieldIndex, 'lessonName', e.target.value)}
                    className="w-full bg-white border border-[#1D5189] rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    value={field.startDate}
                    onChange={(e) => handleLessonChange(subjectIndex, fieldIndex, 'startDate', e.target.value)}
                    className="w-full bg-white border border-[#1D5189] rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Chapter No.</label>
                  <input
                    type="text"
                    value={field.chapter}
                    onChange={(e) => handleLessonChange(subjectIndex, fieldIndex, 'chapter', e.target.value)}
                    className="w-full bg-white border border-[#1D5189] rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Date</label>
                  <input
                    type="date"
                    value={field.endDate}
                    onChange={(e) => handleLessonChange(subjectIndex, fieldIndex, 'endDate', e.target.value)}
                    className="w-full bg-white border border-[#1D5189] rounded px-3 py-2"
                  />
                </div>

                {/* Add/Remove Buttons */}
                <div className="flex items-center justify-end mt-2 col-span-full">
                  {subjectData.fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeField(subjectIndex, fieldIndex)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaMinus />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => addLessonField(subjectIndex)}
                    className="ml-3 text-blue-500 hover:text-blue-700"
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
            ))}

            {/* Update Button */}
            <div className="flex justify-center mt-4">
              <button
                type="button"
                onClick={handleUpload}
                className="bg-[#1D5189] hover:bg-[#17426e] text-white font-semibold px-6 py-2 rounded"
              >
                Update
              </button>
            </div>
          </div>
        ))}
      </form>
    </div>
  </div>
)}
</div>
  );
};

export default Tclassplans;
