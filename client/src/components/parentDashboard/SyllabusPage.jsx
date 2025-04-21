import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSyllabus } from "../../redux/parent/curriculumSlice";
import { FaBookOpen } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const SyllabusPage = () => {
  const dispatch = useDispatch();
  const { syllabus, loading, errorMessage } = useSelector((state) => state.curriculum);

  useEffect(() => {
    dispatch(fetchSyllabus());
  }, [dispatch]);

  const syllabusList = syllabus?.syllabus || [];

  const downloadPdf = () => {
    const doc = new jsPDF("landscape");
    doc.setFontSize(14);
    doc.text("Class Syllabus Uploaded Information", 14, 20);

    const tableData = syllabusList.map((item) => [
      item.class,
      item.section,
      item.createdBy,
      new Date(item.createdAt).toLocaleDateString(),
      item.syllabus,
    ]);

    autoTable(doc, {
      head: [["Class", "Section", "Created By", "Uploaded On", "Syllabus File"]],
      body: tableData,
      startY: 30,
      theme: "grid",
      headStyles: { fillColor: [20, 97, 146] },
      styles: { fontSize: 10, cellPadding: 3 },
      didDrawCell: (data) => {
        if (data.column.index === 4 && data.cell.text[0]) {
          doc.textWithLink("View PDF", data.cell.x + 2, data.cell.y + 8, {
            url: data.cell.text[0],
          });
        }
      },
    });

    doc.save("syllabus.pdf");
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
                  <th className="border border-black px-4 py-2 text-left">Section</th>
                  <th className="border border-black px-4 py-2 text-left">Created By</th>
                  <th className="border border-black px-4 py-2 text-left">Uploaded On</th>
                  <th className="border border-black px-4 py-2 text-left">Syllabus File</th>
                </tr>
              </thead>
              <tbody>
                {syllabusList.map((item) => (
                  <tr key={item._id}>
                    <td className="border border-black px-4 py-2">{item.class}</td>
                    <td className="border border-black px-4 py-2">{item.section}</td>
                    <td className="border border-black px-4 py-2">{item.createdBy}</td>
                    <td className="border border-black px-4 py-2">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="border border-black px-4 py-2">
                      <button onClick={downloadPdf} className="text-blue-600 hover:underline">
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
                      onClick={downloadPdf}
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
