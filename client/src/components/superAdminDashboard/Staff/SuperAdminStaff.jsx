import React, { useEffect } from "react";
import {
  PencilSquareIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { fetchSuperAdminStaff } from "../../../redux/superAdmin/superAdminStaffSlice";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../../../assets/ESHIKSHAMITRA.png";

const SuperAdminStaff = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { staffList, loading } = useSelector((state) => state.superAdminStaff);

  useEffect(() => {
    dispatch(fetchSuperAdminStaff());
  }, [dispatch]);

  const generateStaffPDF = () => {
    if (!Array.isArray(staffList) || staffList.length === 0) return;

    const doc = new jsPDF("p", "mm", "a4");
    const img = new Image();
    img.src = logo;

    doc.addImage(img, "PNG", 10, 2, 25, 25);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(1, 73, 124);
    doc.text("ESHIKSHAMITRA EDUCATION", 105, 12, { align: "center" });

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0);
    doc.text(
      "eshikshamitra@gmail.com    +91 98787xxxxx    www.eshikshamitra.com",
      105,
      18,
      { align: "center" }
    );

    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(10, 26, 200, 26);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Staff Details", 105, 33, { align: "center" });

    // Multi-line headers
    const tableHead = [
      [
        { content: "S. No", rowSpan: 2 },
        { content: "Name", rowSpan: 2 },
        { content: "Phone", rowSpan: 2 },
        { content: "Email", rowSpan: 2 },
        { content: "Address", rowSpan: 2 },
        { content: "Education", colSpan: 3, styles: { halign: "center" } },
        { content: "Designation", rowSpan: 2 },
        { content: "Salary", rowSpan: 2 },
      ],
      [{ content: "Degree" }, { content: "University" }, { content: "Place" }],
    ];

    // Rows
    const tableBody = staffList.map((emp, i) => {
      const edu = emp.highestEducation || {};
      return [
        i + 1,
        emp.name || "-",
        emp.userId?.mobileNumber || "-",
        emp.userId?.email || "-",
        emp.address || "-",
        edu.degree || "-",
        edu.university || "-",
        edu.city || "-",
        emp.designation || "-",
        emp.salary || "0",
      ];
    });

    autoTable(doc, {
      startY: 38,
      head: tableHead,
      body: tableBody,
      margin: { left: 10, right: 10 },
      styles: {
        fontSize: 9,
        cellPadding: 2,
        valign: "middle",
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [1, 73, 124],
        textColor: 255,
        halign: "center",
        fontStyle: "bold",
      },
      bodyStyles: {
        textColor: 20,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    doc.save("eshikshamitra_staff_details.pdf");
  };

  return (
    <div className="p-4">
      <div className="pb-8">
        <h1 className="text-2xl font-light text-black xl:text-[38px]">Staff</h1>
        <hr className="mt-2 border-[#146192] border-[1px] w-[100px]" />
        <h1 className="mt-2 text-sm md:text-base">
          <span>Home</span> {">"}{" "}
          <span className="font-medium text-[#146192]">Staff</span>
        </h1>
      </div>

      <div className="flex justify-end gap-4 mb-4">
        <button
          onClick={() => navigate("/superadmin/staff/add-staff")}
          className="bg-[#005077] text-white px-4 py-2 rounded"
        >
          Add Staff
        </button>
        <button
          onClick={generateStaffPDF}
          className="bg-[#005077] text-white border border-[#005077] px-4 py-2 rounded flex items-center gap-1"
        >
          <ArrowDownTrayIcon className="h-5 w-5" /> PDF
        </button>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <table className="table-auto min-w-full border-collapse text-sm text-left">
          <thead>
            <tr className="bg-[#005077] text-white">
              <th className="p-3 border" rowSpan={2}>
                S. No
              </th>
              <th className="p-3 border" rowSpan={2}>
                Name
              </th>
              <th className="p-3 border" rowSpan={2}>
                Phone Number
              </th>
              <th className="p-3 border" rowSpan={2}>
                Email ID
              </th>
              <th className="p-3 border" rowSpan={2}>
                Address
              </th>
              <th className="p-3 border text-center" colSpan={3}>
                Education
              </th>
              <th className="p-3 border" rowSpan={2}>
                Designation
              </th>
              <th className="p-3 border" rowSpan={2}>
                Salary
              </th>
              <th className="p-3 border" rowSpan={2}>
                Edit
              </th>
            </tr>
            <tr className="bg-[#005077] text-white">
              <th className="p-2 border">Degree</th>
              <th className="p-2 border">University</th>
              <th className="p-2 border">Place</th>
            </tr>
          </thead>
          <tbody>
            {!loading && staffList?.length > 0 ? (
              staffList.map((emp, idx) => {
                const education = emp.highestEducation || {};
                return (
                  <tr key={emp._id} className="bg-white even:bg-gray-50">
                    <td className="p-3 border">{idx + 1}</td>
                    <td className="p-3 border">{emp.name || "N/A"}</td>
                    <td className="p-3 border">
                      {emp.userId?.mobileNumber || "N/A"}
                    </td>
                    <td className="p-3 border">{emp.userId?.email || "N/A"}</td>
                    <td className="p-3 border">{emp.address || "N/A"}</td>
                    <td className="p-3 border">{education.degree || "N/A"}</td>
                    <td className="p-3 border">
                      {education.university || "N/A"}
                    </td>
                    <td className="p-3 border">{education.city || "N/A"}</td>
                    <td className="p-3 border">{emp.designation || "N/A"}</td>
                    <td className="p-3 border">₹{emp.salary || 0}</td>
                    <td className="p-3 border">
                      <PencilSquareIcon
                        onClick={() =>
                          navigate(`/superadmin/staff/edit-staff/${emp._id}`)
                        }
                        className="h-5 w-5 text-blue-600 cursor-pointer"
                      />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={11}
                  className="text-center p-4 border text-gray-500"
                >
                  {loading ? "Loading staff data..." : "No staff data found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SuperAdminStaff;
