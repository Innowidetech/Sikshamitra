import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { fetchIncomeAndExpenses } from "../../redux/superAdmin/superAdminAccountsSlice";
import { IncomeAccountChart, ExpenseAccountChart } from "./Charts";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { PiDownloadSimpleBold } from "react-icons/pi";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../../assets/ESHIKSHAMITRA.png";
import Header from "./layout/Header";

const SuperAdminAccounts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState("income"); // 'income' or 'expense'

  const { income, expense, loading, error } = useSelector(
    (state) => state.superAdminAccounts
  );

  useEffect(() => {
    dispatch(fetchIncomeAndExpenses());
  }, [dispatch]);

  const incomeByMonth = useMemo(() => {
    const map = {};
    income.forEach((entry) => {
      const date = new Date(entry.createdAt);
      const monthYear = date.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
      if (!map[monthYear]) map[monthYear] = 0;
      map[monthYear] += entry.paidAmount;
    });

    return Object.entries(map).map(([monthYear, totalIncome]) => ({
      monthYear,
      totalIncome,
    }));
  }, [income]);

  const expenseByMonth = useMemo(() => {
    const map = {};
    expense.forEach((entry) => {
      const date = new Date(entry.date);
      const monthYear = date.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
      if (!map[monthYear]) map[monthYear] = 0;
      map[monthYear] += entry.amount;
    });

    return Object.entries(map).map(([monthYear, totalExpenses]) => ({
      monthYear,
      totalExpenses,
    }));
  }, [expense]);

  const generateIncomePDF = (income) => {
    if (!Array.isArray(income) || income.length === 0) return;

    const doc = new jsPDF("p", "mm", "a4");
    const img = new Image();
    img.src = logo;

    // Header
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
    doc.text("Income Details", 105, 33, { align: "center" });

    const tableColumn = [
      "S. No",
      "School Code",
      "School Name",
      "Principal",
      "Contact",
      "Total Fees",
      "Paid",
      "Due",
      "Status",
      "Payment Method",
      "Transaction ID",
    ];

    const tableRows = income.map((item, i) => [
      i + 1,
      item.schoolCode || "-",
      item.schoolName || "-",
      item.principalName || "-",
      item.schoolContact || "-",
      (item.totalFees || 0).toLocaleString(),
      (item.paidAmount || 0).toLocaleString(),
      (item.dueAmount || 0).toLocaleString(),
      item.schoolStatus || "-",
      item.paymentMethod || "-",
      item.transactionId || "-",
    ]);

    // Capture final Y for summary
    let finalY = 38;

    autoTable(doc, {
      startY: finalY,
      head: [tableColumn],
      body: tableRows,
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
      didDrawPage: (data) => {
        finalY = data.cursor.y + 10;
      },
    });

    // Add total summary box at the end of the same page
    const total = income.reduce((sum, i) => sum + (i.totalFees || 0), 0);
    const received = income.reduce((sum, i) => sum + (i.paidAmount || 0), 0);

    autoTable(doc, {
      startY: finalY,
      margin: { left: 120 },
      tableWidth: 70,
      styles: {
        fontSize: 10,
        lineWidth: 0.1,
        cellPadding: 3,
        textColor: 20,
      },
      headStyles: {
        fillColor: [1, 73, 124],
        textColor: 255,
        halign: "left",
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
      },

      body: [
        ["Total Fees", `${(total || 0).toLocaleString()}`],
        ["Received", `${(received || 0).toLocaleString()}`],
      ],
    });

    doc.save("shikshamitra_income_details.pdf");
  };
  // Generate PDF for expenses

  const generateExpensePDF = (expense) => {
    if (!Array.isArray(expense) || expense.length === 0) return;

    const doc = new jsPDF("p", "mm", "a4");
    const img = new Image();
    img.src = logo;

    const formatCurrency = (value) =>
      (parseFloat(value) || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // === Header ===
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
    doc.text("Expense Details", 105, 32, { align: "center" });

    // === Table ===
    const tableColumn = [
      "S. No",
      "Name",
      "Date",
      "Purpose",
      "Amount",
      "Mode of Payment",
      "Transaction ID",
    ];

    const tableRows = expense.map((item, index) => [
      index + 1,
      item.name || "-",
      new Date(item.date).toLocaleDateString("en-IN"),
      item.purpose || "-",
      formatCurrency(item.amount),
      item.modeOfPayment || "-",
      item.transactionId || "-",
    ]);

    // === Main Table ===
    autoTable(doc, {
      startY: 36,
      head: [tableColumn],
      body: tableRows,
      margin: { left: 5, right: 5 },
      tableWidth: "auto",
      styles: {
        fontSize: 8,
        overflow: "linebreak",
        cellPadding: 2,
        valign: "top",
        lineWidth: 0.1,
        lineColor: [0, 0, 0],
      },
      headStyles: {
        fillColor: [1, 73, 124],
        textColor: 255,
        halign: "center",
        fontStyle: "bold",
        lineColor: [0, 0, 0],
      },
      bodyStyles: {
        textColor: 20,
        lineColor: [0, 0, 0],
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      verticalAlign: "middle",
      theme: "grid",
    });

    // === Summary ===
    const totalExpense = expense.reduce((sum, e) => sum + (e.amount || 0), 0);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      margin: { left: 140 },
      tableWidth: 60,

      body: [["AMOUNT", formatCurrency(totalExpense)]],
      styles: {
        fontSize: 10,
        lineWidth: 0.1,
        cellPadding: 3,
        textColor: 20,
      },
      headStyles: {
        fillColor: [1, 73, 124],
        textColor: 255,
        halign: "left",
        lineColor: [0, 0, 0],
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        lineColor: [0, 0, 0],
      },
      theme: "grid",
    });

    // === Save ===
    doc.save("shikshamitra_expense_details.pdf");
  };
  return (
    <div>
      <div className="pb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-light text-black xl:text-[38px]">
              Accounts
            </h1>
            <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
            <h1 className="mt-2 text-sm md:text-base">
              <span>Home</span> {">"}{" "}
              <span className="font-medium text-[#146192]">Accounts </span>
            </h1>
          </div>

          <Header />
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Income Chart */}
          <div
            onClick={() => setSelectedTab("income")}
            className={`flex-1 h-[400px] bg-white rounded-lg pb-16 p-4 shadow cursor-pointer ${
              selectedTab === "income" ? "ring-2 ring-[#146192]" : ""
            }`}
          >
            <h2 className="text-lg font-semibold mb-4">Income</h2>
            <IncomeAccountChart accountsCount={incomeByMonth} />
          </div>

          {/* Expense Chart */}
          <div
            onClick={() => setSelectedTab("expense")}
            className={`flex-1 h-[400px] bg-white rounded-lg pb-16 p-4 shadow cursor-pointer ${
              selectedTab === "expense" ? "ring-2 ring-[#146192]" : ""
            }`}
          >
            <ExpenseAccountChart accountsCount={expenseByMonth} />
          </div>
        </div>
      )}

      {/* Income Table */}
      {selectedTab === "income" && (
        <div className="px-4 py-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Income Details</h2>
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/superadmin/account/add-income")}
                className="bg-[#146192] text-white px-4 py-2 rounded-md text-sm"
              >
                Add Income
              </button>
              <button
                onClick={() => generateIncomePDF(income)}
                className="bg-[#146192] text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <PiDownloadSimpleBold />
                <span>PDF</span>
              </button>
            </div>
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full text-sm border border-gray-300 rounded">
              <thead className="bg-[#07486F] text-white">
                <tr>
                  {[
                    "S. No",
                    "School Code",
                    "School Name",
                    "Principal",
                    "Contact",
                    "Total Fees",
                    "Paid",
                    "Due",
                    "Status",
                    "Payment Method",
                    "Transaction id",
                    "Edit",
                  ].map((header, i) => (
                    <th key={i} className="px-4 py-2 border text-left">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {income.map((item, index) => (
                  <tr key={item._id} className="even:bg-gray-50">
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="border px-4 py-2">{item.schoolCode}</td>
                    <td className="border px-4 py-2">{item.schoolName}</td>
                    <td className="border px-4 py-2">
                      {item.principalName || "-"}
                    </td>
                    <td className="border px-4 py-2">
                      {item.schoolContact || "-"}
                    </td>
                    <td className="border px-4 py-2 text-blue-600">
                      {(item.totalFees || 0).toLocaleString()}
                    </td>
                    <td className="border px-4 py-2 text-green-600">
                      {(item.paidAmount || 0).toLocaleString()}
                    </td>
                    <td className="border px-4 py-2 text-red-500">
                      {(item.dueAmount || 0).toLocaleString()}
                    </td>
                    <td className="border px-4 py-2">
                      {item.schoolStatus || "-"}
                    </td>
                    <td className="border px-4 py-2">{item.paymentMethod}</td>
                    <td className="border px-4 py-2">{item.transactionId}</td>
                    <td className="border px-4 py-2 text-center">
                      <PencilSquareIcon
                        onClick={() =>
                          navigate(
                            `/superadmin/account/edit-income/${item._id}`
                          )
                        }
                        className="w-5 h-5 text-[#146192] cursor-pointer"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="block md:hidden mt-4">
        {income?.length === 0 && !loading && (
          <p className="text-center text-gray-500">No income data found.</p>
        )}

        {income?.map((item, index) => (
          <div
            key={item._id}
            className="rounded-lg overflow-hidden mb-4 shadow bg-white border border-[#0000004D]"
          >
            <div className="grid grid-cols-2 text-sm">
              <div className="bg-[#146192E8] text-white p-2 font-semibold border">
                S. No
              </div>
              <div className="p-2 border">{index + 1}</div>

              <div className="bg-[#146192E8] text-white p-2 font-semibold border">
                School Code
              </div>
              <div className="p-2 border">{item.schoolCode}</div>

              <div className="bg-[#146192E8] text-white p-2 font-semibold border">
                School Name
              </div>
              <div className="p-2 border">{item.schoolName}</div>

              <div className="bg-[#146192E8] text-white p-2 font-semibold border">
                Principal
              </div>
              <div className="p-2 border">{item.principalName || "-"}</div>

              <div className="bg-[#146192E8] text-white p-2 font-semibold border">
                Contact
              </div>
              <div className="p-2 border">{item.schoolContact || "-"}</div>

              <div className="bg-[#146192E8] text-white p-2 font-semibold border">
                Total Fees
              </div>
              <div className="p-2 border text-blue-600">
                {(item.totalFees || 0).toLocaleString()}
              </div>

              <div className="bg-[#146192E8] text-white p-2 font-semibold border">
                Paid
              </div>
              <div className="p-2 border text-green-600">
                {(item.paidAmount || 0).toLocaleString()}
              </div>

              <div className="bg-[#146192E8] text-white p-2 font-semibold border">
                Due
              </div>
              <div className="p-2 border text-red-500">
                {(item.dueAmount || 0).toLocaleString()}
              </div>

              <div className="bg-[#146192E8] text-white p-2 font-semibold border">
                Status
              </div>
              <div className="p-2 border">{item.schoolStatus || "-"}</div>

              <div className="bg-[#146192E8] text-white p-2 font-semibold border">
                Payment Method
              </div>
              <div className="p-2 border">{item.paymentMethod}</div>

              <div className="bg-[#146192E8] text-white p-2 font-semibold border">
                Transaction ID
              </div>
              <div className="p-2 border break-all">{item.transactionId}</div>

              <div className="bg-[#146192E8] text-white p-2 font-semibold border">
                Edit
              </div>
              <div className="p-2 border">
                <PencilSquareIcon
                  onClick={() =>
                    navigate(`/superadmin/account/edit-income/${item._id}`)
                  }
                  className="w-5 h-5 text-[#146192] cursor-pointer"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Expense Table */}
      {selectedTab === "expense" && (
        <div className="px-4 py-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Expenses Details</h2>
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/superadmin/account/add-expense")}
                className="bg-[#146192] text-white px-4 py-2 rounded-md text-sm"
              >
                Add Expense
              </button>
              <button
                onClick={() => generateExpensePDF(expense)}
                className="bg-[#146192] text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <PiDownloadSimpleBold />
                <span>PDF</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-gray-300 rounded">
              <thead className="bg-[#07486F] text-white">
                <tr>
                  {[
                    "S. No",
                    "Name",
                    "Date",
                    "Purpose",
                    "Amount",
                    "Mode of Payment",
                    "Transaction ID",
                    "Edit",
                  ].map((header, i) => (
                    <th key={i} className="px-4 py-2 border text-left">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {expense.map((item, index) => (
                  <tr key={item._id || index} className="even:bg-gray-50">
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="border px-4 py-2">{item.name || "-"}</td>
                    <td className="border px-4 py-2">
                      {new Date(item.date).toLocaleDateString("en-IN")}
                    </td>
                    <td className="border px-4 py-2">{item.purpose || "-"}</td>
                    <td className="border px-4 py-2 text-red-600">
                      ₹ {(item.amount || 0).toLocaleString()}
                    </td>
                    <td className="border px-4 py-2">
                      {item.modeOfPayment || "-"}
                    </td>
                    <td className="border px-4 py-2">
                      {item.transactionId || "-"}
                    </td>
                    <td
                      onClick={() =>
                        navigate(`/superadmin/account/edit-expense/${item._id}`)
                      }
                      className="border px-4 py-2 text-center"
                    >
                      <PencilSquareIcon className="w-5 h-5 text-[#146192] cursor-pointer" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminAccounts;
