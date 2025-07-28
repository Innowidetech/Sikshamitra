import React from "react";
import { Chart } from "react-google-charts";
// import { Chart } from "react-google-charts";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Title
);
const formatMonthYear = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
};
export const SchoolStatusChart = ({
  activeSchools = 0,
  inActiveSchools = 0,
  suspendedSchools = 0,
}) => {
  const data = [
    ["Status", "Count"],
    ["Active", activeSchools],
    ["Inactive", inActiveSchools],
    ["Suspended", suspendedSchools],
  ];

  const options = {
    pieHole: 0.7,
    colors: ["#4CAF50", "#FFC107", "#F44336"],
    legend: { position: "none" },
    pieSliceText: "none",
    backgroundColor: "transparent",
    chartArea: { width: "100%", height: "80%" },
  };

  return (
    <div className="relative pb-8 mb-2">
      {" "}
      {/* Adds padding at bottom to give space */}
      <Chart
        chartType="PieChart"
        width="100%"
        height="200px"
        data={data}
        options={options}
      />
      {/* Adjusted position of legend */}
      <div className="absolute left-0 right-0 -bottom-8 flex justify-around text-sm">
        {[
          { label: "Active", value: activeSchools, color: "#4CAF50" },
          { label: "Inactive", value: inActiveSchools, color: "#FFC107" },
          { label: "Suspended", value: suspendedSchools, color: "#F44336" },
        ].map(({ label, value, color }) => (
          <div key={label} className="flex flex-col items-center">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: color }}
            ></span>
            <span
              className="text-[#a3a3a3] mt-1"
              style={{ fontFamily: "Inter" }}
            >
              {label}
            </span>
            <span className="font-semibold">{value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ExpenseChart = ({ accountsCount }) => {
  if (!accountsCount || accountsCount.length === 0) return null;

  const barColors = ["#4FE397", "#2139DE", "#F22829"];

  const labels = accountsCount.map((item) => item.monthYear);
  const amounts = accountsCount.map((item) => item.totalExpenses);
  const formattedAmounts = amounts.map(
    (amount) => `Rs. ${amount.toLocaleString("en-IN")}`
  );

  const backgroundColors = amounts.map(
    (_, i) => barColors[i % barColors.length]
  );

  const data = {
    labels,
    datasets: [
      {
        label: "Total Expenses (K)",
        data: amounts.map((val) => val / 1000),
        backgroundColor: backgroundColors,
        borderRadius: 6,
        barThickness: 40,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `₹${context.parsed.y}K`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `${value}K`,
          font: { family: "Inter" },
        },
        grid: { color: "#f0f0f0" },
      },
      x: {
        ticks: { font: { family: "Inter" } },
        grid: { display: false },
      },
    },
  };

  return (
    <div>
      {/* Month-Year & Amount Legend */}
      <div className="flex justify-between mb-4">
        {accountsCount.map((item, index) => (
          <div key={index} className="text-center">
            <p className="text-xs text-gray-500">{item.monthYear}</p>
            <p className="text-sm font-semibold">{`Rs. ${item.totalExpenses.toLocaleString(
              "en-IN"
            )}`}</p>
            <div
              className="h-1 w-12 mx-auto mt-1 rounded"
              style={{ backgroundColor: barColors[index % barColors.length] }}
            />
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="h-[250px]">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};
export const IncomeChart = ({ accountsCount }) => {
  if (!accountsCount || accountsCount.length === 0) return null;

  const labels = accountsCount.map((item) => item.monthYear);
  const amounts = accountsCount.map((item) => item.totalIncome / 1000);

  const totalAmount = accountsCount.reduce(
    (sum, item) => sum + item.totalIncome,
    0
  );

  const formattedAmount = `${totalAmount.toLocaleString("en-IN")}`;

  const data = {
    labels,
    datasets: [
      {
        label: "",
        data: amounts,
        fill: true,
        borderColor: "#14238A",
        backgroundColor: "rgba(27, 60, 255, 0.1)",
        tension: 0.4,
        pointRadius: 6,
        pointBackgroundColor: "#14238A",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => `₹${context.parsed.y}K`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `${value}K`,
          font: { family: "Inter" },
        },
        grid: { color: "#e5e7eb" },
      },
      x: {
        ticks: { font: { family: "Inter" } },
        grid: { display: false },
      },
    },
  };

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="text-base font-semibold text-gray-700 mb-2 flex flex-col items-center justify-center">
        <div className="flex items-center">
          <span className="inline-block w-2 h-2 rounded-full   bg-[#146192]"></span>
          <span className="text-[#A3A3A3] text-[12px] ml-2">
            Fees Collections
          </span>
        </div>
        <p className="text-[#000000] text-[17px] mt-1">{formattedAmount}</p>
      </div>

      <div style={{ height: "94%" }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};
// Accounts Chart

export const IncomeAccountChart = ({ accountsCount }) => {
  if (!accountsCount || accountsCount.length === 0) return null;

  // Sort by date
  const sortedData = [...accountsCount].sort((a, b) => {
    const getDate = (monthYear) => new Date(`${monthYear} 1`);
    return getDate(a.monthYear) - getDate(b.monthYear);
  });

  const labels = sortedData.map((item) => item.monthYear);
  const amounts = sortedData.map((item) => item.totalIncome / 1000);

  const data = {
    labels,
    datasets: [
      {
        label: "Total Income (K)",
        data: amounts,
        fill: true,
        borderColor: "#4745A4",
        backgroundColor: "rgba(71, 69, 164, 0.1)",
        tension: 0.4,
        pointRadius: 6,
        pointBackgroundColor: "#4745A4",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: { font: { family: "Inter", size: 12 } },
      },
      tooltip: {
        callbacks: {
          label: (context) => `₹${context.parsed.y}K`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `${value}K`,
          font: { family: "Inter" },
        },
        grid: { color: "#f0f0f0" },
      },
      x: {
        ticks: { font: { family: "Inter" } },
        grid: { display: false },
      },
    },
  };

  return <Line data={data} options={options} height={400} />;
};
export const ExpenseAccountChart = ({ accountsCount }) => {
  if (!accountsCount || accountsCount.length === 0) return null;

  const barColors = ["#4FE397", "#2139DE", "#F22829"];

  // Sort accountsCount based on monthYear (e.g., "May 2025", "June 2025")
  const sortedAccounts = [...accountsCount].sort((a, b) => {
    const [aMonth, aYear] = a.monthYear.split(" ");
    const [bMonth, bYear] = b.monthYear.split(" ");

    const monthOrder = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const aIndex = monthOrder.indexOf(aMonth) + parseInt(aYear) * 12;
    const bIndex = monthOrder.indexOf(bMonth) + parseInt(bYear) * 12;

    return aIndex - bIndex;
  });

  const labels = sortedAccounts.map((item) => item.monthYear);
  const amounts = sortedAccounts.map((item) => item.totalExpenses);
  const backgroundColors = amounts.map(
    (_, i) => barColors[i % barColors.length]
  );

  const data = {
    labels,
    datasets: [
      {
        label: "Total Expenses (K)",
        data: amounts.map((val) => val / 1000),
        backgroundColor: backgroundColors,
        borderRadius: 6,
        barThickness: 40,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `₹${context.parsed.y}K`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `${value}K`,
          font: { family: "Inter" },
        },
        grid: { color: "#f0f0f0" },
      },
      x: {
        ticks: { font: { family: "Inter" } },
        grid: { display: false },
      },
    },
  };

  return (
    <div>
      {/* Header with Month Labels & Amounts */}
      <div className="flex justify-between items-center mb-4">
        {sortedAccounts.map((item, index) => (
          <div key={index} className="text-center">
            <p className="text-xs text-gray-500">{item.monthYear}</p>
            <p className="text-sm font-semibold">
              ₹{item.totalExpenses.toLocaleString("en-IN")}
            </p>
            <div
              className="h-1 w-12 mx-auto mt-1 rounded"
              style={{ backgroundColor: barColors[index % barColors.length] }}
            />
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="h-[300px]">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};
