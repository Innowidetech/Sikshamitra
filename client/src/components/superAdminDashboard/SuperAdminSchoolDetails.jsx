import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllSchools,
  updateSchoolStatus,
} from "../../redux/superAdmin/superAdminSchoolSlice";
import Header from "./layout/Header";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../../assets/ESHIKSHAMITRA.png"; // Adjust the path as necessary
import { PiDownloadSimpleBold } from "react-icons/pi";

const SuperAdminSchoolDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { schools, loading, error } = useSelector(
    (state) => state.superAdminSchools
  );

  useEffect(() => {
    dispatch(fetchAllSchools());
  }, [dispatch]);

  const handleStatusChange = (schoolId, currentStatus, newStatus) => {
    console.log("=== STATUS CHANGE TRIGGERED ===");
    console.log("School ID:", schoolId);
    console.log("Current Status:", currentStatus);
    console.log("New Status:", newStatus);

    // Find the school object to verify we have the right one
    const school = schools.find((s) => s._id === schoolId);
    console.log(
      "Found school object:",
      school ? school.schoolName : "NOT FOUND"
    );

    if (newStatus === currentStatus) return;

    dispatch(updateSchoolStatus({ id: schoolId, status: newStatus }))
      .unwrap()
      .then(() => {
        console.log("Status updated successfully for school:", schoolId);
        toast.success("Status updated successfully");
      })
      .catch((err) => {
        console.error("Failed to update status:", err);
        toast.error(err || "Failed to update status");
      });
  };
  const generatePDF = (schools) => {
    if (!Array.isArray(schools) || schools.length === 0) return;

    const doc = new jsPDF("p", "mm", "a4");
    const img = new Image();
    img.src = logo;

    img.onload = () => {
      // === Logo ===
      doc.addImage(img, "PNG", 10, 2, 25, 25);

      // === Heading ===
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(1, 73, 124);
      doc.text("ESHIKSHAMITRA EDUCATION", 105, 12, { align: "center" });

      // === Contact Info ===
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0);
      doc.text(
        "eshikshamitra@gmail.com    +91 98787xxxxx    www.eshikshamitra.com",
        105,
        18,
        { align: "center" }
      );

      // === Divider ===
      doc.setDrawColor(0);
      doc.setLineWidth(0.5);
      doc.line(10, 26, 200, 26);

      // === Section Title ===
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("School Details", 105, 32, { align: "center" });

      // === Table Header ===
      const tableColumn = [
        "Code",
        "Name",
        "Phone",
        "Email",
        "Address",
        "Website",
        "Principal",
        "Board",
        "Medium",
        "Status",
      ];

      // === Prepare Table Rows ===
      const tableRows = schools.map((school) => [
        school.schoolCode || "-",
        school.schoolName || "-",
        school.contact?.phone || "-",
        school.userId?.email || "-",
        school.address || "-",
        school.contact?.website || "-",
        school.principalName || "-",
        school.details?.boardType || "-",
        school.details?.medium || "-",
        school.status || "-",
      ]);

      // === Render Table ===
      autoTable(doc, {
        startY: 36,
        head: [tableColumn],
        body: tableRows,
        margin: { left: 0, right: 0 }, // No side margin
        tableWidth: "auto",
        styles: {
          fontSize: 7.5,
          overflow: "linebreak",
          cellPadding: 1,
          valign: "top",
        },
        headStyles: {
          fillColor: [1, 73, 124],
          textColor: 255,
          halign: "center",
          fontStyle: "bold",
        },
        pageBreak: "auto",
        didDrawPage: () => {
          const pageCount = doc.internal.getNumberOfPages();
          doc.setFontSize(8);
          doc.text(
            `Page ${pageCount}`,
            doc.internal.pageSize.getWidth() - 20,
            doc.internal.pageSize.getHeight() - 10
          );
        },
      });

      doc.save("shikshamitra_school_details.pdf");
    };
  };
  return (
    <div>
      <div className="pb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-light text-black xl:text-[38px]">
              School Details
            </h1>
            <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
            <h1 className="mt-2 text-sm md:text-base">
              <span>Home</span> {">"}{" "}
              <span className="font-medium text-[#146192]">School Details</span>
            </h1>
          </div>

          <Header />
        </div>
      </div>

      <div className="flex justify-end items-center gap-3 mb-4">
        <button
          onClick={() => navigate("/superadmin/school-details/register")}
          className="bg-[#146192] text-white px-4 py-2 rounded"
        >
          Registration
        </button>
        <button
          onClick={() => generatePDF(schools)}
          className="bg-[#146192] text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <PiDownloadSimpleBold />
          <span>PDF</span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-md bg-white">
        <table className="w-full text-sm text-gray-800 border border-collapse">
          <thead className="bg-[#01497c] text-white">
            <tr>
              <th className="p-3 border text-left">School Code</th>
              <th className="p-3 border text-left">School Name</th>
              <th className="p-3 border text-left">Contact</th>
              <th className="p-3 border text-left">Email Id</th>
              <th className="p-3 border text-left">Address</th>
              <th className="p-3 border text-left">Website Link</th>
              <th className="p-3 border text-left">Principal Name</th>
              <th className="p-3 border text-left">Board Type</th>
              <th className="p-3 border text-left">Medium</th>
              <th className="p-3 border text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="10" className="text-center p-4 text-gray-500">
                  Loading schools...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="10" className="text-center p-4 text-red-500">
                  {error}
                </td>
              </tr>
            ) : schools.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center p-4 text-gray-500">
                  No school data found.
                </td>
              </tr>
            ) : (
              schools.map((school, index) => {
                return (
                  <tr key={school._id} className="hover:bg-gray-50">
                    <td className="p-3 border">{school.schoolCode}</td>
                    <td className="p-3 border">{school.schoolName}</td>
                    <td className="p-3 border">{school.contact?.phone}</td>
                    <td className="p-3 border">{school.userId?.email}</td>
                    <td className="p-3 border">{school.address}</td>
                    <td className="p-3 border">
                      <a
                        href={school.contact?.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline"
                      >
                        Website
                      </a>
                    </td>
                    <td className="p-3 border">{school.principalName}</td>
                    <td className="p-3 border">{school.details?.boardType}</td>
                    <td className="p-3 border">{school.details?.medium}</td>
                    <td className="p-3 border">
                      <select
                        key={`${school._id}-${school.status}`} // Force re-render on status change
                        value={school.status}
                        onChange={(e) => {
                          console.log("=== DROPDOWN CHANGED ===");
                          console.log("School Name:", school.schoolName);
                          console.log("School ID:", school._id);
                          console.log("New Status:", e.target.value);
                          handleStatusChange(
                            school._id,
                            school.status,
                            e.target.value
                          );
                        }}
                        className={`text-xs p-1 rounded border bg-white ${
                          school.status === "active"
                            ? "text-green-600 border-green-600"
                            : school.status === "inactive"
                            ? "text-red-600 border-red-600"
                            : "text-blue-600 border-blue-600"
                        }`}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default SuperAdminSchoolDetails;
