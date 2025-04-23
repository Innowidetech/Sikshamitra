import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudyMaterials, deleteStudyMaterial } from '../../redux/teacher/studyMSlice';
import { User, Calendar, Book, ChevronRight, Search, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import Header from '../adminDashboard/layout/Header';

const colorPool = [
  'bg-[#e6d8f5]', 'bg-[#fcebc5]', 'bg-[#c7eaf8]', 'bg-[#d7f3d8]',
  'bg-[#ffe2e6]', 'bg-[#f3d9d9]', 'bg-[#d2f5e3]', 'bg-[#f9e6ff]',
  'bg-[#fef7dc]', 'bg-[#cfe2f3]'
];

function StudyMaterial() {
  const dispatch = useDispatch();
  const navigate = useNavigate();  // Use the navigate hook
  const { teacherMaterial, classMaterial, loading, error } = useSelector((state) => state.studyMaterial);
  const [subjectColorMap, setSubjectColorMap] = useState({});

  useEffect(() => {
    dispatch(fetchStudyMaterials());
  }, [dispatch]);

  useEffect(() => {
    if (classMaterial.length > 0) {
      const map = {};
      let colorIndex = 0;
      classMaterial.forEach(item => {
        const subject = item.subject || 'Unknown';
        if (!map[subject]) {
          map[subject] = colorPool[colorIndex] || 'bg-gray-100';
          colorIndex++;
        }
      });
      setSubjectColorMap(map);
    }
  }, [classMaterial]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      dispatch(deleteStudyMaterial(id));
    }
  };

  const handleDownload = async (fileUrl) => {
    if (!fileUrl) {
      alert('No material available to download.');
      return;
    }

    try {
      // Check if the URL ends with .pdf to distinguish it from other file types (e.g., video)
      const isPDF = fileUrl.endsWith('.pdf');
      
      // Fetch the file with headers (if needed, e.g., for authorization)
      const response = await fetch(fileUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // If token is required for authorization
        }
      });

      // If the response isn't successful, show an error
      if (!response.ok) {
        throw new Error('Failed to fetch the file.');
      }

      // Convert the response to a Blob (binary data)
      const blob = await response.blob();

      // Open the file in a new tab
      const blobUrl = window.URL.createObjectURL(blob);
      window.open(blobUrl, '_blank'); // This opens the file in a new tab

      // If it's a PDF, the browser will try to render it in the new tab
      // No need to create a download link here for a new tab
      window.URL.revokeObjectURL(blobUrl); // Clean up the Blob URL
    } catch (error) {
      alert(`Error downloading file: ${error.message}`);
      console.error("Error downloading file:", error);
    }
  };

  const TableHeader = ({ label }) => (
    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
      {label}
    </th>
  );

  const navigateToAddMaterial = () => {
    navigate('/teacher/materialPage');  // Navigate to the route for adding material
  };

  return (
    <>
      <div className="flex justify-between items-center mx-8 mt-20 md:ml-72">
        <div>
          <h1 className="text-2xl font-light text-black xl:text-[38px]">Study Material</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
          <h1 className="mt-2">
            <span className="xl:text-[17px] text-xl">Home</span> {'>'}
            <span className="xl:text-[17px] text-xl font-medium text-[#146192]">Study Material</span>
          </h1>
        </div>
        <Header />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 md:ml-72">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="relative w-full md:w-[400px] mb-4 md:mb-0">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-500" />
            </div>
            <input
              type="search"
              className="block w-full p-2.5 pl-10 text-sm text-gray-900 border border-gray-300 rounded-md bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search"
            />
          </div>
          <button
            className="bg-[#1e5b8e] text-white px-6 py-2 rounded-md hover:bg-[#146192] transition-colors"
            onClick={navigateToAddMaterial}  // Navigate to the add material page
          >
            Add Study Material
          </button>
        </div>

        {loading && <p className="text-blue-600">Loading materials...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {/* Class Material Cards */}
        <section className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <Book className="w-6 h-6 mr-2" />
              <span className="font-medium">Class Study Material</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {classMaterial.map(item => (
              <div
                key={item._id}
                className={`${subjectColorMap[item.subject] || 'bg-gray-100'} p-4 rounded-lg`}
              >
                <h3 className="font-medium text-lg mb-3 border-b border-gray-300 pb-2">{item.subject}</h3>
                <div className="mb-2 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  <span>{item.teacherName}</span>
                </div>
                <div className="mb-2 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>{new Date(item.createdAt).toLocaleDateString('en-US')}</span>
                </div>
                <div className="mb-4 flex items-center">
                  <Book className="w-5 h-5 mr-2" />
                  <span>Chapter {item.chapter}</span>
                </div>
                <button
                  className="w-full bg-white text-center py-1 text-sm rounded hover:bg-gray-100 transition-colors"
                  onClick={() => handleDownload(item.material)}
                  disabled={loading}
                >
                  VIEW
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Teacher Material Table */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <Book className="w-6 h-6 mr-2" />
              <span className="font-medium">Teachers' Study Material Uploaded Information</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <TableHeader label="Teacher Name" />
                  <TableHeader label="Chapter" />
                  <TableHeader label="Class" />
                  <TableHeader label="Section" />
                  <TableHeader label="Subject Name" />
                  <TableHeader label="Date" />
                  <TableHeader label="View" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {teacherMaterial.map(item => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{item.teacherName}</td>
                    <td className="px-4 py-3 text-sm">{item.chapter}</td>
                    <td className="px-4 py-3 text-sm">{item.class}</td>
                    <td className="px-4 py-3 text-sm">{item.section}</td>
                    <td className="px-4 py-3 text-sm">{item.subject}</td>
                    <td className="px-4 py-3 text-sm">
                      {new Date(item.createdAt).toLocaleDateString('en-US')}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          className="text-green-600 bg-green-100 hover:bg-green-200 px-2 py-1 rounded-md text-xs"
                          onClick={() => handleDownload(item.material)}
                          disabled={loading}
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-red-600 hover:text-red-800 disabled:opacity-50"
                          title="Delete"
                          disabled={loading}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}

export default StudyMaterial;
