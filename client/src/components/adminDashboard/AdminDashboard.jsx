import React, { useState, useEffect, useCallback } from "react";
import { User, CircleUserRound, X } from "lucide-react";
import { IoPeople } from "react-icons/io5";
import { TbMoneybag } from "react-icons/tb";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { useNavigate } from "react-router-dom";
import Calendar from './Calendar';
import { GenderRatioChart, ActiveInactiveChart } from "./Charts";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import {
  fetchActiveStudents,
  fetchStudentsByGender,
  fetchNotices,
  deleteNotice,
  fetchCounts,
  createNotice,
  fetchAccounts,
  fetchCalendar,
  createCalendarEvent,
} from "../../redux/dashboard";
import { Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const eventColors = [
  "bg-blue-300",
  "bg-green-300",
  "bg-yellow-300",
  "bg-red-300",
  "bg-purple-300",
  "bg-pink-300",
  "bg-orange-300",
  "bg-teal-300",
  "bg-indigo-300",
];

const AdminDashboard = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [noticeData, setNoticeData] = useState({
    title: "",
    date: "",
    noticeMessage: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const dashboard = useSelector((state) => state.dashboard);
  const {
    activeStudents,
    studentsByGender,
    notices,
    counts,
    accounts,
    calendar,
    loading,
    error,
  } = dashboard;

  const fetchDashboardData = useCallback(async () => {
    try {
      await Promise.all([
        dispatch(fetchActiveStudents()),
        dispatch(fetchStudentsByGender()),
        dispatch(fetchNotices()),
        dispatch(fetchCounts()),
        dispatch(fetchAccounts()),
        dispatch(fetchCalendar()),
      ]);
    } catch (error) {
      toast.error("Error fetching dashboard data:", error);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleCreateNotice = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createNotice(noticeData)).unwrap();
      setIsModalOpen(false);
      setNoticeData({ title: "", date: "", noticeMessage: "" });
      dispatch(fetchNotices());
      toast.success("Notice created successfully");
    } catch (error) {
      console.error("Error creating notice:", error);
      toast.error("Failed to create notice");
    }
  };

  const handleDeleteNotice = async (noticeId) => {
    try {
      await dispatch(deleteNotice(noticeId)).unwrap();
      dispatch(fetchNotices());
      toast.success("Notice deleted successfully");
    } catch (error) {
      console.error("Error deleting notice:", error);
      toast.error("Failed to delete notice");
    }
  };

  const handleCalendarEventAdded = () => {
    dispatch(fetchCalendar());
    dispatch(fetchNotices());
  };

  // Financial Charts Data
  const chartData = React.useMemo(() => {
    if (!accounts?.accounts || accounts.accounts.length === 0) return null;

    const months = accounts.accounts.map((account) => account.monthYear);
    const incomeData = accounts.accounts.map(
      (account) => account.totalIncome / 1000
    ); // Convert to K
    const expensesData = accounts.accounts.map(
      (account) => account.totalExpenses / 1000
    ); // Convert to K

    return {
      income: {
        labels: months,
        datasets: [
          {
            label: "Total Income",
            data: incomeData,
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
      },
      expenses: {
        labels: months,
        datasets: [
          {
            label: "Total Expenses",
            data: expensesData,
            backgroundColor: "#FCA311",
            borderRadius: 6,
            barThickness: 40,
          },
        ],
      },
    };
  }, [accounts]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            family: "Inter",
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#000",
        bodyColor: "#666",
        bodyFont: {
          family: "Inter",
        },
        titleFont: {
          family: "Inter",
          weight: "bold",
        },
        padding: 12,
        borderColor: "#e1e1e1",
        borderWidth: 1,
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.parsed.y}K`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "#f0f0f0",
        },
        ticks: {
          font: {
            family: "Inter",
          },
          callback: (value) => `${value}K`, // Display values in K format
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: "Inter",
          },
        },
      },
    },
  };

  // Show loading state only if all data is loading
  const isFullyLoading =
    loading.counts && loading.activeStudents && loading.studentsByGender;

  if (isFullyLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-blue-200"></div>
          <div className="text-xl text-gray-500">Loading dashboard data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full overflow-x-hidden">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* Create Notice Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md overflow-hidden mx-4">
            <div className="bg-[#146192] text-white p-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Create Notice</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleCreateNotice}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={noticeData.title}
                      onChange={(e) =>
                        setNoticeData({ ...noticeData, title: e.target.value })
                      }
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={noticeData.date}
                      onChange={(e) =>
                        setNoticeData({ ...noticeData, date: e.target.value })
                      }
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notice Message
                  </label>
                  <textarea
                    value={noticeData.noticeMessage}
                    onChange={(e) =>
                      setNoticeData({
                        ...noticeData,
                        noticeMessage: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded-md h-32 resize-none"
                    required
                  />
                </div>
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="w-[200px] bg-[#146192] text-white py-2 rounded-md hover:bg-[#146192]/90 transition-colors"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 w-full gap-6 mx-4">
        <div className="md:col-span-3 lg:py-14">
          {/* Stats Cards */}
          <div className="bg-white max-w-5xl md:py-4 md:mt-6 xl:mx-auto rounded-lg grid grid-cols-2 lg:flex lg:justify-around p-4 mb-4 md:mb-0 md:mx-2">
            <div className="lg:flex gap-2">
              <div className="flex justify-center items-center">
                <div className="bg-[#4D44B5] rounded-full p-2 text-white">
                  <CircleUserRound className="md:h-4 md:w-4 lg:h-8 lg:w-8" />
                </div>
              </div>
              <div className="grid justify-center items-center">
                <div
                  className="text-[#A098AE]"
                  style={{ fontFamily: "Poppins" }}
                >
                  Students
                </div>
                <div className="text-center xl:text-[25px] text-[#303972] font-bold">
                  {studentsByGender?.totalStudents || "0"}
                </div>
              </div>
            </div>

            <div className="lg:flex gap-2">
              <div className="flex justify-center items-center">
                <div className="bg-[#FB7D5B] rounded-full p-2 text-white">
                  <LiaChalkboardTeacherSolid className="lg:h-8 lg:w-8" />
                </div>
              </div>
              <div className="grid justify-center items-center">
                <div
                  className="text-[#A098AE]"
                  style={{ fontFamily: "Poppins" }}
                >
                  Teachers
                </div>
                <div className="text-center xl:text-[25px] text-[#303972] font-bold">
                  {counts?.teachers || "0"}
                </div>
              </div>
            </div>

            <div className="lg:flex gap-2">
              <div className="flex justify-center items-center">
                <div className="bg-[#FCC43E] rounded-full p-2 text-white">
                  <IoPeople className="lg:h-8 lg:w-8" />
                </div>
              </div>
              <div className="grid justify-center items-center">
                <div
                  className="text-[#A098AE]"
                  style={{ fontFamily: "Poppins" }}
                >
                  Parents
                </div>
                <div className="text-center xl:text-[25px] text-[#303972] font-bold">
                  {counts?.parents || "0"}
                </div>
              </div>
            </div>

            <div className="lg:flex gap-2">
              <div className="flex justify-center items-center">
                <div className="bg-[#303972] rounded-full p-2 text-white">
                  <TbMoneybag className="lg:h-8 lg:w-8" />
                </div>
              </div>
              <div className="grid justify-center items-center">
                <div
                  className="text-[#A098AE]"
                  style={{ fontFamily: "Poppins" }}
                >
                  Earnings
                </div>
                <div className="text-center xl:text-[25px] text-[#303972] font-bold">
                  {counts?.earnings || "0"}
                </div>
              </div>
            </div>
          </div>

          {/* Financial Charts Section */}
          <div className="max-w-5xl md:py-4 md:mt-6 xl:mx-auto md:mx-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Income Chart */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h2
                  className="text-xl font-semibold mb-4"
                  style={{ fontFamily: "Inter" }}
                >
                  Income
                </h2>
                <div className="h-[400px]">
                  {chartData ? (
                    <Line
                      data={chartData.income}
                      options={chartOptions}
                      height={400}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full bg-gray-50 rounded-lg">
                      <TbMoneybag size={40} className="text-gray-400 mb-2" />
                      <p className="text-gray-600 font-medium">
                        No income data available
                      </p>
                      <p className="text-gray-400 text-sm">
                        Income trends will be shown here
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Expenses Chart */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h2
                  className="text-xl font-semibold mb-4"
                  style={{ fontFamily: "Inter" }}
                >
                  Expenses
                </h2>
                <div className="h-[400px]">
                  {chartData ? (
                    <Bar
                      data={chartData.expenses}
                      options={chartOptions}
                      height={400}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full bg-gray-50 rounded-lg">
                      <TbMoneybag size={40} className="text-gray-400 mb-2" />
                      <p className="text-gray-600 font-medium">
                        No expenses data available
                      </p>
                      <p className="text-gray-400 text-sm">
                        Monthly expenses will be shown here
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Notices Section */}
          <div className="max-w-5xl md:py-4 md:mt-6 xl:mx-auto rounded-lg md:mx-2">
            <div className="bg-white p-6 rounded-lg shadow mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2
                  className="text-xl font-semibold"
                  style={{ fontFamily: "Inter" }}
                >
                  Notices
                </h2>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-[#1982c4] rounded-md text-white px-4 py-2 hover:bg-[#1982c4]/90 transition-colors"
                >
                  Create Notice
                </button>
              </div>
              {Array.isArray(notices) && notices.length > 0 ? (
                <div className="space-y-4">
                  {notices.map((notice) => (
                    <div
                      key={notice._id}
                      className="flex justify-between items-start p-4 border rounded hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <h3 className="font-semibold">{notice.title}</h3>
                        <p className="text-gray-600">{notice.noticeMessage}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(notice.date).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteNotice(notice._id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 font-medium">
                    No notices available
                  </p>
                  <p className="text-gray-400 text-sm">
                    Click 'Create Notice' to add your first notice
                  </p>
                </div>
              )}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h1
                  className="text-[#000000] text-center mb-4"
                  style={{ fontFamily: "Inter" }}
                >
                  Student Gender Ratio
                </h1>
                {studentsByGender &&
                (studentsByGender.male > 0 || studentsByGender.female > 0) ? (
                  <GenderRatioChart
                    male={studentsByGender.male || 0}
                    female={studentsByGender.female || 0}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg">
                    <User size={40} className="text-gray-400 mb-2" />
                    <p className="text-gray-600 font-medium">
                      No student data available
                    </p>
                    <p className="text-gray-400 text-sm">
                      Add students to see gender distribution
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h1
                  className="text-[#000000] text-center mb-4"
                  style={{ fontFamily: "Inter" }}
                >
                  Active-Inactive Students
                </h1>
                {activeStudents &&
                (activeStudents.activeCount > 0 ||
                  activeStudents.inactiveCount > 0) ? (
                  <ActiveInactiveChart
                    active={activeStudents.activeCount || 0}
                    inactive={activeStudents.inactiveCount || 0}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg">
                    <IoPeople size={40} className="text-gray-400 mb-2" />
                    <p className="text-gray-600 font-medium">
                      No activity data available
                    </p>
                    <p className="text-gray-400 text-sm">
                      Student activity will be shown here
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:py-14 px-2 lg:mt-6">
          <div className="space-y-6">
            {/* Calendar Component */}
            <div className="bg-white rounded-lg shadow">
              <Calendar 
                events={calendar || []} 
                onEventAdded={handleCalendarEventAdded} 
              />
            </div>
            
            {/* Upcoming Events */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-[#146192]">
                Upcoming Events
              </h2>
              {Array.isArray(calendar) &&
                calendar.filter(cal => {
                  const eventDate = new Date(cal.date);
                  const now = new Date();
                  return (
                    eventDate > now &&
                    eventDate.getMonth() === now.getMonth() &&
                    eventDate.getFullYear() === now.getFullYear()
                  );
                }).length > 0 ? (
                calendar
                  .filter(cal => {
                    const eventDate = new Date(cal.date);
                    const now = new Date();
                    return (
                      eventDate > now &&
                      eventDate.getMonth() === now.getMonth() &&
                      eventDate.getFullYear() === now.getFullYear()
                    );
                  })
                  .sort((a, b) => new Date(a.date) - new Date(b.date))
                  .map((cal, index) => {
                    const backgroundColor = eventColors[index % eventColors.length];
                    return (
                      <div
                        key={cal._id}
                        className={`p-4 rounded-lg shadow-md mb-2 ${backgroundColor}`}
                      >
                        <h3 className="text-md font-medium">{cal.title}</h3>
                        <p className="text-sm flex justify-end mt-2">
                          {new Date(cal.date).toLocaleDateString()}
                        </p>
                      </div>
                    );
                  })
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 font-medium">No upcoming events</p>
                  <p className="text-gray-400 text-sm">Add events using the calendar</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;