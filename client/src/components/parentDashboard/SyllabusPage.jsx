import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSyllabus } from "../../redux/parent/curriculumSlice";
import { FaBookOpen } from "react-icons/fa";
import axios from "axios";

const SyllabusPage = () => {
  const dispatch = useDispatch();
  const { syllabus, loading, errorMessage } = useSelector((state) => state.curriculum);

  useEffect(() => {
    dispatch(fetchSyllabus());
  }, [dispatch]);

  const syllabusList = syllabus?.syllabus || [];

  // Secure PDF download handler
  const downloadFile = async (fileUrl, fileName) => {
    try {
      const response = await axios.get(fileUrl, {
        responseType: 'blob',
        // withCredentials: true, // Uncomment if your backend uses cookies
        // headers: {
        //   Authorization: `Bearer YOUR_TOKEN`, // Add auth header if needed
        // },
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', fileName || 'syllabus.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(blobUrl); // clean up
    } catch (error) {
      console.error("Failed to download PDF:", error);
      alert("Unable to download file. Please try again.");
    }
  };

  return (
    <div className="p-4 md:p-6">
      {/* Heading */}
      <div className="flex items-center gap-3 mb-6 md:ml-72 mt-20">
        <FaBookOpen size={24} className="text-[#146192]" />
        <h2 className="text-xl font-semibold text-black">Class Syllabus Uploaded Information</h2>
      </div>

      {/* States */}
      {loading ? (
        <p className="text-gray-600 text-lg">Loading syllabus...</p>
      ) : errorMessage ? (
        <p className="text-red-600 text-lg">Error: {errorMessage}</p>
      ) : syllabusList.length === 0 ? (
        <p className="text-gray-600 text-lg">No syllabus available.</p>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block md:ml-72 overflow-x-auto">
            <table className="min-w-full border border-black text-sm bg-[#FFF4E9]">
              <thead>
                <tr>
                  <th className="border border-black px-4 py-2 text-left">Class</th>
                  
                  <th className="border border-black px-4 py-2 text-left">Created By</th>
                  <th className="border border-black px-4 py-2 text-left">Uploaded On</th>
                  <th className="border border-black px-4 py-2 text-left">Syllabus File</th>
                </tr>
              </thead>
              <tbody>
                {syllabusList.map((item) => (
                  <tr key={item._id}>
                    <td className="border border-black px-4 py-2">{item.class}</td>
                    
                    <td className="border border-black px-4 py-2">{item.createdBy}</td>
                    <td className="border border-black px-4 py-2">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="border border-black px-4 py-2">
                      <button
                        onClick={() => downloadFile(item.syllabus, `Syllabus_${item.class}.pdf`)}
                        className="text-blue-600 hover:underline"
                      >
                        View / Download PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="space-y-6 md:hidden">
            {syllabusList.map((item) => (
              <div
                key={item._id}
                className="border border-black bg-[#FFF4E9] rounded shadow-sm overflow-hidden"
              >
                {[
                  ["Class", item.class],
                  ["Section", item.section],
                  ["Created By", item.createdBy],
                  ["Uploaded On", new Date(item.createdAt).toLocaleDateString()],
                  [
                    "Syllabus File",
                    <button
                      onClick={() => downloadFile(item.syllabus, `Syllabus_${item.class}.pdf`)}
                      className="text-blue-600 underline"
                    >
                      View / Download PDF
                    </button>,
                  ],
                ].map(([label, value], idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-2 border-b border-black"
                  >
                    <div className="bg-[#146192] text-white p-2 font-medium border-r border-black whitespace-nowrap">
                      {label}
                    </div>
                    <div className="p-2 break-words min-w-0 w-full">{value}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SyllabusPage;
