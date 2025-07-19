
import React, { useState, useEffect } from 'react';
import Header from '../adminDashboard/layout/Header';
import {
  FaGraduationCap,
  FaClipboardList,
  FaEdit,
  FaTrash,
  FaCalendarAlt,
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTeacherDashboard,
  fetchTeacherNotices,
  fetchTeacherCalendar,
  fetchTeacherCalendarByDate,
  createTeacherNotice,
  updateTeacherNotice,
  deleteTeacherNotice,
  editTeacherCalendarEvent,
  deleteTeacherCalendarEvent,
  fetchTeacherClassAccounts,
  fetchTeacherRequests,
  createTeacherRequest,
  editTeacherExpenseRequest,
} from '../../redux/teacher/teacherDashboardSlice';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import { useNavigate } from 'react-router-dom';

// ✅ Chart.js and react-chartjs-2
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
} from 'chart.js';

// ✅ Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);


function TeacherDashboard() {
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editNoticeId, setEditNoticeId] = useState(null);
  const [notice, setNotice] = useState({ title: '', date: '', noticeMessage: '' });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPopup, setShowPopup] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  // ✅ Helper to format date as YYYY-MM-DD
const formatDate = (date) => {
  if (!date) return '';
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

  
  
  

  const dispatch = useDispatch();
  const navigate = useNavigate();

  

  const {
    dashboardData,
    loading,
    error,
    notices,
    calendarData,
    calendarByDateData,
    noticeLoading,
    noticeError,
    createNoticeLoading,
    createNoticeError,
    createNoticeSuccess,
    updateNoticeSuccess,
    deleteNoticeSuccess,
  } = useSelector((state) => state.teacherDashboard);

    const { classAccounts, teacherRequests } = useSelector((state) => state.teacherDashboard);
    const expenseRequests = teacherRequests?.teacherRequests || [];
    const [selectedItemFilter, setSelectedItemFilter] = useState('');
    const [editData, setEditData] = useState({ id: '', item: '', purpose: '' });



    
  const token = localStorage.getItem('token');
  

 useEffect(() => {
  if (token) {
    dispatch(fetchTeacherDashboard(token));
    dispatch(fetchTeacherNotices(token));
    dispatch(fetchTeacherCalendar(token));
    dispatch(fetchTeacherClassAccounts(token));
    dispatch(fetchTeacherRequests(token));
  }
}, [dispatch, token]);

useEffect(() => {
  if (selectedDate && token) {
    const formattedDate = formatDate(selectedDate);
    if (formattedDate) {
      dispatch(fetchTeacherCalendarByDate({ token, calendarDate: formattedDate }));

    } else {
      console.error('Invalid selectedDate:', selectedDate);
    }
  }
}, [selectedDate, token, dispatch]);

  useEffect(() => {
    if (selectedDate && token) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      dispatch(fetchTeacherCalendarByDate({ token, calendarDate: formattedDate }));

    }
  }, [dispatch, token, selectedDate]);

  useEffect(() => {
    if (createNoticeSuccess || updateNoticeSuccess || deleteNoticeSuccess) {
      dispatch(fetchTeacherNotices(token));
      resetForm();
    }
  }, [createNoticeSuccess, updateNoticeSuccess, deleteNoticeSuccess, dispatch, token]);

  // Filter upcoming events for the current month and current date (>= today)
  useEffect(() => {
    if (calendarData?.calendars) {
      const today = new Date();
      const currentMonth = today.getMonth(); // Get the current month (0 = January, 1 = February, etc.)

      // Filter events that are within the current month and greater than or equal to today's date
      const upcomingEventsForCurrentMonth = calendarData.calendars.filter((event) => {
        const eventDate = new Date(event.date);
        return (
          eventDate.getMonth() === currentMonth && eventDate >= today
        );
      });

      // Sort events by date (ascending)
      upcomingEventsForCurrentMonth.sort((a, b) => new Date(a.date) - new Date(b.date));

      setUpcomingEvents(upcomingEventsForCurrentMonth);
    }
  }, [calendarData]); // This will run when calendarData is updated

  const resetForm = () => {
    setShowModal(false);
    setNotice({ title: '', date: '', noticeMessage: '' });
    setIsEdit(false);
    setEditNoticeId(null);
  };

  const handleChange = (e) => {
    setNotice({ ...notice, [e.target.name]: e.target.value });
  };

  
  const handleCreateNotice = async () => {
    if (!notice.title || !notice.date || !notice.noticeMessage) {
      toast.error("All fields are required.");
      return;
    }

    try {
      if (isEdit && editNoticeId) {
        await dispatch(updateTeacherNotice({ token, id: editNoticeId, updatedData: notice })).unwrap();
        toast.success("Notice updated successfully.");
      } else {
        await dispatch(createTeacherNotice({ token, noticeData: notice })).unwrap();
        toast.success("Notice created successfully.");
      }
    } catch (err) {
      toast.error(isEdit ? "Failed to update notice." : "Failed to create notice.");
    }
  };

  const handleEditClick = (item) => {
    setNotice({
      title: item.title,
      date: item.date.slice(0, 10),
      noticeMessage: item.noticeMessage,
    });
    setEditNoticeId(item._id);
    setIsEdit(true);
    setShowModal(true);
  };
  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this notice?")) {
      try {
        await dispatch(deleteTeacherNotice({ token, id })).unwrap();
        toast.success("Notice deleted successfully.");
      } catch (err) {
        toast.error("Failed to delete notice.");
      }
    }
  };


  const handleDateClick = (date) => {
    const eventOnDate = calendarData?.calendars?.some(
      (event) => new Date(event.date).toDateString() === date.toDateString()
    );

    setSelectedDate(date);

    if (!eventOnDate) {
      const formattedDate = date.toISOString().split('T')[0];
      navigate(`/teacher/createdynamiccalendar?date=${formattedDate}`);
    } else {
      const event = calendarData?.calendars?.find(
        (e) => new Date(e.date).toDateString() === date.toDateString()
      );
      setSelectedEvent(event);
      setShowPopup(true);
    }
  };


  const closePopup = () => {
    setShowPopup(false);
    setSelectedEvent(null);
  };
  const handleEventUpdate = async () => {
    try {
      // Dispatch the action to update the event
      await dispatch(editTeacherCalendarEvent({ token, eventData: editCalendarData })).unwrap();
      toast.success("Event updated successfully.");
      closePopup(); // Close the popup after update
    } catch (error) {
      toast.error("Failed to update event.");
    }
  };

   // Handle Event Deletion
  const handleDeleteEvent = async (eventId) => {
    try {
      // Dispatch the delete action (this assumes you pass the necessary token)
      await dispatch(deleteTeacherCalendarEvent({ token: 'your_token_here', calendarId: eventId }));

      // After successful deletion, close the popup and update UI if necessary
      closePopup();
      alert("Event deleted successfully!");
    } catch (error) {
      alert("Error deleting the event: " + error.message); // Display any errors that occur during deletion
    }
  };

  const [editCalendarModal, setEditCalendarModal] = useState(false);
  const [editCalendarData, setEditCalendarData] = useState({
    title: '',
    date: '',
    description: '',
    displayTo: [],
  });

  
   // Chart Data Integration
  const months = Array.isArray(classAccounts?.accounts) 
    ? classAccounts.accounts.map(account => account.monthYear) 
    : ['Jan', 'Feb', 'Mar'];

  const income = Array.isArray(classAccounts?.accounts) 
    ? classAccounts.accounts.map(account => account.classIncome) 
    : [0, 0, 0];

  const data = {
    labels: months,
    datasets: [
      {
        label: 'Income over Time',
        data: income,
        borderColor: '#146192',
        backgroundColor: 'rgba(20, 97, 146, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

 const options = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'Income Over Time',
      font: {
        size: 18,
      },
    },
    legend: {
      display: true,
      position: 'top',
    },
  },
  scales: {
    x: {
      display: true,
      title: {
        display: true,
        text: 'Months',
        font: {
          size: 14,
        },
      },
      grid: {
        display: true,
        color: '#e0e0e0',
      },
    },
    y: {
      display: true,
      title: {
        display: true,
        text: 'Income (₹)',
        font: {
          size: 14,
        },
      },
      beginAtZero: true,
      grid: {
        display: true,
        color: '#e0e0e0',
      },
    },
  },
};
 
const [isModalOpen, setIsModalOpen] = useState(false);
const [itemName, setItemName] = useState('');
const [purpose, setPurpose] = useState('');
const [requestData, setRequestData] = useState([]); // stores submitted requests
const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
const [isEditModalOpen, setIsEditModalOpen] = useState(false);




const closeModal = () => {
  setIsModalOpen(false);
};


 const handleRequestSubmit = async () => {
  if (!itemName.trim() || !purpose.trim()) {
    alert('Please fill in all fields');
    return;
  }

  console.log('➡️ Submitting request with:', { token, item: itemName, purpose });

  try {
    const res = await dispatch(
      createTeacherRequest({
        token,
        item: itemName,
        purpose,
      })
    ).unwrap();

    console.log('✅ Request submitted successfully:', res);

    toast.success("Request submitted successfully.");
    dispatch(fetchTeacherRequests(token)); // reload the list
    setItemName('');
    setPurpose('');
    setIsRequestModalOpen(false);
  } catch (error) {
    console.error('❌ Error submitting request:', error);
    toast.error("Failed to submit request.");
  }
};

const handleEditClickExpense = (item) => {
  if (item.status.toLowerCase() !== 'pending') {
    toast.error("Only pending requests can be edited.");
    return;
  }

  setEditData({
    id: item._id || item.id,  // your unique identifier
    item: item.item,
    purpose: item.purpose,
  });
  setIsEditModalOpen(true);
};



const handleEditSubmit = async () => {
  if (!editData.item || !editData.purpose) {
    alert("Please fill all fields.");
    return;
  }

  try {
    console.log("Submitting edit request with data:", editData); // debug
    await dispatch(
      editTeacherExpenseRequest({
        token,
        id: editData.id,
        updateData: {
          item: editData.item,
          purpose: editData.purpose,
        },
      })
    ).unwrap();

    toast.success("Request updated successfully.");
    setIsEditModalOpen(false);
    dispatch(fetchTeacherRequests(token));
  } catch (err) {
    console.error("Edit request failed:", err); // debug
    toast.error("Failed to update request.");
  }
};



  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-16 md:ml-56 mt-10">
      <Header />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mx-4 md:mx-8 pt-6">
        <div className="mb-4 md:mb-0">
          <h1 className="text-xl sm:text-2xl xl:text-[38px] font-light text-black">Dashboard</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[120px] sm:w-[150px]" />
          <h1 className="mt-2 text-base sm:text-lg">
            <span>Home</span> {">"} <span className="font-medium text-[#146192]">Dashboard</span>
          </h1>
        </div>
      </div>

      {(loading || noticeLoading || createNoticeLoading) && (
        <p className="text-blue-500 text-center mt-4">Loading...</p>
      )}
      {(error || noticeError || createNoticeError) && (
        <p className="text-red-500 text-center mt-4">Error: {error || noticeError || createNoticeError}</p>
      )}

      <div className="flex flex-col lg:flex-row justify-between gap-6 mx-4 md:mx-8 mt-8">
        {/* Left Section - Stats and Notices */}
        <div className="flex-1 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-4 bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-400">
              <FaGraduationCap className="text-yellow-500 text-3xl" />
              <div>
                <p className="text-sm text-gray-500">Total Students</p>
                <h2 className="text-xl font-bold">{dashboardData?.totalStudents ?? '—'}</h2>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
              <FaClipboardList className="text-green-600 text-3xl" />
              <div>
                <p className="text-sm text-gray-500">Total Exams</p>
                <h2 className="text-xl font-bold">{dashboardData?.totalExams ?? '—'}</h2>
              </div>
            </div>
          </div>

          {/* Notices */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#146192]">Notices</h3>
              <button
                className="bg-[#146192] text-white px-4 py-2 text-sm rounded hover:bg-[#0f4a6f]"
                onClick={() => setShowModal(true)}
              >
                Create Notice
              </button>
            </div>
            {Array.isArray(notices?.Notices) && notices.Notices.length === 0 ? (
              <p className="text-gray-500">No notices available</p>
            ) : (
              notices?.Notices?.map((item, idx) => (
                <div key={item._id} className="mb-6">
                  <div className="flex items-start justify-between">
                    <h4 className="text-base font-semibold bg-gray-100 px-2 py-1 rounded">
                      {idx + 1}. {item.title}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <FaEdit className="text-blue-500 cursor-pointer" onClick={() => handleEditClick(item)} />
                      <FaTrash className="text-red-500 cursor-pointer" onClick={() => handleDeleteClick(item._id)} />
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mt-2">{item.noticeMessage}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Date: {new Date(item.date).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-400">{item.createdByText}</p>
                </div>
              ))
            )}
          </div>

        {/* Combined Container for Income Chart and Expenses */}
<div className="flex flex-col md:flex-row gap-6 mt-6">
{/* Income Chart Section - Left Side */}
<div className="bg-white p-6 rounded-lg shadow-md w-full md:w-1/2">
  <h3 className="text-lg font-semibold text-[#146192]">Income Chart</h3>

  {/* Monthly Income Summary */}
  <div className="mt-6 flex gap-6 justify-start items-center">
    {months.slice(-3).map((month, idx) => (
      <div key={month} className="text-sm font-semibold text-center w-full md:w-1/3">
        <p>{month}</p>
        <h3 className="font-semibold text-xl">₹ {income[income.length - 3 + idx] || 0}</h3>
      </div>
    ))}
  </div>

  {/* Classic Line Graph with Axes */}
  <div className="mt-6">
    <Line data={data} options={options} />
  </div>
</div>


{/* Expenses Section - Right Side */}
<div className="bg-white p-6 rounded-lg shadow-md w-full md:w-1/2 mt-6">
  <div className="flex justify-between items-center mb-4">
    <h3 className="text-lg font-semibold text-[#146192] ">Expenses</h3>
  <button
  onClick={() => setIsRequestModalOpen(true)}
  className="bg-[#146192] text-white px-4 py-2 rounded-md hover:bg-blue-600"
>
  Request Item
</button>

  </div>

  {/* Month & Values Display */}
  <div className="flex justify-between mb-6">
    {Array.isArray(classAccounts?.accounts) &&
      classAccounts.accounts
        .slice(-3)
        .map((item, idx) => (
          <div key={idx} className="text-center">
            <p className="text-sm text-gray-600">{item.monthYear}</p>
            <h4 className="font-semibold text-lg text-[#146192]">₹ {item.classExpenses}</h4>
          </div>
        ))}
  </div>

  {/* Bar Chart */}
  <div className="mt-4 overflow-x-hidden">
    <div className="w-full max-w-full">
      <Bar
        data={{
          labels: classAccounts?.accounts?.map((item) => item.monthYear),
          datasets: [
            {
              label: 'Monthly Expenses',
              data: classAccounts?.accounts?.map((item) => item.classExpenses),
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#8E44AD'],
              borderRadius: 6,
              barThickness: 30,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: 'Expenses Overview',
              font: { size: 18 },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Amount (₹)',
              },
              ticks: {
                stepSize: 5000,
                maxTicksLimit: 5,
              },
            },
            x: {
              title: {
                display: true,
                text: 'Month',
              },
              ticks: {
                autoSkip: false,
                padding: 5,
              },
              grid: {
                display: false,
              },
              maxBarThickness: 40,
            },
          },
        }}
      />
    </div>
  </div>

   {/* Request Modal */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-semibold text-[#146192] mb-4">Request Item</h2>

            <label className="block text-sm mb-1">Item Name</label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md"
              placeholder="Enter item name"
            />

            <label className="block text-sm mb-1">Purpose</label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md"
              placeholder="Enter purpose"
            />

            <div className="flex justify-between mt-4">
              <button
                onClick={handleRequestSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Request
              </button>
              <button
                onClick={() => setIsRequestModalOpen(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
</div>

{/* Expense Requests Table */}
<div className="mt-8">
  <div className="flex justify-between items-center mb-4">
    <h3 className="text-lg font-semibold text-[#146192]">Expense Requests</h3>
    <select
  className="border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-700 shadow-sm"
  value={selectedItemFilter}
  onChange={(e) => setSelectedItemFilter(e.target.value)}
>
  <option value="">Items Name</option>
  {[
    ...new Set(expenseRequests.map((req) => req.item))  // get unique item names
  ].map((itemName, index) => (
    <option key={index} value={itemName}>
      {itemName}
    </option>
  ))}
</select>

  </div>

  {/* 🔽 ADD FILTER LOGIC HERE */}
  {(() => {
    const filteredRequests = selectedItemFilter
      ? expenseRequests.filter((req) => req.item === selectedItemFilter)
      : expenseRequests;

    return (
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white border border-gray-200 text-sm text-left text-gray-700">
          <thead className="bg-[#F9FAFB] border-b text-[#146192]">
            <tr>
              <th className="px-4 py-3 border-r">ITEM NAME</th>
              <th className="px-4 py-3 border-r">PURPOSE</th>
              <th className="px-4 py-3 border-r">AMOUNT</th>
              <th className="px-4 py-3 border-r">STATUS</th>
              <th className="px-4 py-3">EDIT</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No matching requests found.
                </td>
              </tr>
            ) : (
              filteredRequests.map((item, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 border-r">{item.item}</td>
                  <td className="px-4 py-3 border-r">{item.purpose}</td>
                 <td className="px-4 py-3 border-r">
  {item.amount ? `₹ ${item.amount}` : '-'}
</td>

                <td className="px-4 py-3 border-r">
  <span
    className={`${
      item.status?.toLowerCase() === 'success'
        ? 'text-green-600'
        : item.status?.toLowerCase() === 'failed'
        ? 'text-red-600'
        : 'text-yellow-600'
    } font-medium`}
  >
    {item.status?.charAt(0).toUpperCase() + item.status?.slice(1)}
  </span>
  {item.status?.toLowerCase() === 'failed' && item.remark && (
    <div className="text-xs text-red-500 mt-1 italic">
      Remark: {item.remark}
    </div>
  )}
</td>

          <td
  className={`cursor-pointer ${item.status.toLowerCase() !== 'pending' ? 'opacity-50 pointer-events-none' : ''}`}
  onClick={() => handleEditClickExpense(item)}
>
  <FaEdit />
</td>


                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  })()}

</div>

{isEditModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
      <h2 className="text-lg font-semibold mb-4 text-[#146192]">Edit Expense Request</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
        <input
          type="text"
          value={editData.item}
          onChange={(e) => setEditData({ ...editData, item: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
        <textarea
          value={editData.purpose}
          onChange={(e) => setEditData({ ...editData, purpose: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => setIsEditModalOpen(false)}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-gray-800"
        >
          Cancel
        </button>
        <button
          onClick={handleEditSubmit}
          className="px-4 py-2 bg-[#146192] text-white rounded hover:bg-[#0e4a72]"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}




<div className="w-full max-w-full overflow-hidden">
  <div className="flex flex-wrap -mx-2">
    {/* Gender Ratio Box */}
    <div className="w-full md:w-1/2 px-2">
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h3 className="text-lg font-semibold text-[#000000] mb-4 text-center">Student Gender Ratio</h3>
        <div className="flex flex-col items-center">
          {/* Check if dashboardData is not null and has male/female properties */}
          {dashboardData ? (
            <>
              <div className="w-40 h-40 mb-4">
                <Pie
                  data={{
                    labels: ['Male', 'Female'],
                    datasets: [
                      {
                        data: [dashboardData.male, dashboardData.female],
                        backgroundColor: ['#2139DE', '#F22829'],
                        hoverOffset: 6,
                        borderWidth: 0,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { display: false },
                    },
                    cutout: '60%',
                  }}
                />
              </div>
              <div className="flex justify-between w-full px-6 text-sm">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-1 bg-[#2139DE] mb-1" />
                  <p className="text-gray-700">Male</p>
                  <p className="font-semibold text-[#2139DE]">{dashboardData.male}</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-4 h-1 bg-[#F22829] mb-1" />
                  <p className="text-gray-700">Female</p>
                  <p className="font-semibold text-[#F22829]">{dashboardData.female}</p>
                </div>
              </div>
            </>
          ) : (
            <p>Loading...</p>  
          )}
        </div>
      </div>
    </div>

    {/* Active/Inactive Ratio Box */}
    <div className="w-full md:w-1/2 px-2">
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h3 className="text-lg font-semibold text-[#000000] mb-4 text-center">Active / Inactive Students</h3>
        <div className="flex flex-col items-center">
          {/* Check if dashboardData is not null and has active/inactive properties */}
          {dashboardData ? (
            <>
              <div className="w-40 h-40 mb-4">
                <Pie
                  data={{
                    labels: ['Active', 'Inactive'],
                    datasets: [
                      {
                        data: [dashboardData.active, dashboardData.inactive],
                        backgroundColor: ['#2139DE', '#F22829'],
                        hoverOffset: 6,
                        borderWidth: 0,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { display: false },
                    },
                    cutout: '60%',
                  }}
                />
              </div>
              <div className="flex justify-between w-full px-6 text-sm">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-1 bg-[#2139DE] mb-1" />
                  <p className="text-gray-700">Active</p>
                  <p className="font-semibold text-[#2139DE]">{dashboardData.active}</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-4 h-1 bg-[#F22829] mb-1" />
                  <p className="text-gray-700">Inactive</p>
                  <p className="font-semibold text-[#F22829]">{dashboardData.inactive}</p>
                </div>
              </div>
            </>
          ) : (
            <p>Loading...</p>  
          )}
        </div>
      </div>
    </div>
  </div>


</div>

</div>


        {/* Calendar */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-lg shadow-xl p-6 border min-h-[300px] relative w-full">
            <h2 className="text-xl font-bold text-[#303972] mb-3 flex items-center gap-2">
              <FaCalendarAlt /> School Dynamic Calendar
            </h2>

            <div className={showPopup ? 'blur-sm pointer-events-none' : ''}>
              <div className="w-full flex justify-center">
                <Calendar
                  onClickDay={handleDateClick}
                  value={selectedDate}
                  tileClassName={({ date }) => {
                    const eventOnDate = calendarData?.calendars?.some(
                      (event) => new Date(event.date).toDateString() === date.toDateString()
                    );
                    return eventOnDate ? 'bg-[#FFE082] rounded-md text-black font-bold' : '';
                  }}
                />
              </div>
            </div>

            {showPopup && selectedEvent && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-80 relative">
                  <h3 className="text-lg font-bold mb-2">Event Details</h3>

                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button
                      onClick={() => {
                        setEditCalendarData({
                          title: selectedEvent.title,
                          date: selectedEvent.date.slice(0, 10),
                          description: selectedEvent.description,
                          displayTo: selectedEvent.displayTo || [],
                        });
                        setEditCalendarModal(true);
                        setShowPopup(false);
                      }}
                      className="text-gray-500 hover:text-blue-600"
                      title="Edit Event"
                    >
                      <FaEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(selectedEvent._id)}
                      className="text-gray-500 hover:text-red-600"
                      title="Delete Event"
                    >
                      <FaTrash size={18} />
                    </button>
                  </div>

                  <p><strong>Title:</strong> {selectedEvent.title}</p>
                  <p><strong>Date:</strong> {new Date(selectedEvent.date).toLocaleDateString()}</p>
                  <p><strong>Description:</strong> {selectedEvent.description}</p>
                  <button
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={closePopup}
                  >
                    Close
                  </button>
                </div>
              </div>

            )}
          </div>


          {/* Upcoming Events Section */}
          <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-[#146192] mb-4">Upcoming Events</h3>
            <div className="space-y-4">
              {upcomingEvents.length === 0 ? (
                <p className="text-gray-500">No upcoming events this month.</p>
              ) : (
                upcomingEvents.map((event, index) => {
                  const bgColors = [
                    '#BF156C47', // Light Yellow
                    '#FF9F1C80', // Light Blue
                    '#7A7A7A6B', // Light Green
                    '#6600FF24', // Light Red
                    '#E1BEE7', // Light Purple
                    '#FFF9C4', // Light Lemon
                  ];
                  const bgColor = bgColors[index % bgColors.length];

                  return (
                    <div
                      key={event._id}
                      className="p-4 rounded-lg shadow-sm"
                      style={{ backgroundColor: bgColor }}
                    >
                      <h4 className="font-semibold text-black">{event.title}</h4>
                      <p className="text-sm text-gray-800">{new Date(event.date).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-700">{event.description}</p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Notice Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">{isEdit ? 'Edit' : 'Create'} Notice</h3>
            <div>
              <input
                type="text"
                name="title"
                value={notice.title}
                onChange={handleChange}
                placeholder="Title"
                className="w-full px-4 py-2 border rounded mb-4"
              />
              <textarea
                name="noticeMessage"
                value={notice.noticeMessage}
                onChange={handleChange}
                placeholder="Notice Message"
                className="w-full px-4 py-2 border rounded mb-4"
              />
              <input
                type="date"
                name="date"
                value={notice.date}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded mb-4"
              />
            </div>
            <div className="mt-4 flex justify-between">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded"
                onClick={resetForm}
              >
                Cancel
              </button>
              <button
                className="bg-[#146192] text-white px-4 py-2 rounded"
                onClick={handleCreateNotice}
              >
                {isEdit ? 'Update' : 'Create'} Notice
              </button>
            </div>
          </div>
        </div>
      )}
      {editCalendarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Edit Calendar Event</h3>
            <div>
              <input
                type="text"
                name="title"
                value={editCalendarData.title}
                onChange={(e) =>
                  setEditCalendarData({ ...editCalendarData, title: e.target.value })
                }
                placeholder="Title"
                className="w-full px-4 py-2 border rounded mb-4"
              />
              <textarea
                name="description"
                value={editCalendarData.description}
                onChange={(e) =>
                  setEditCalendarData({ ...editCalendarData, description: e.target.value })
                }
                placeholder="Description"
                className="w-full px-4 py-2 border rounded mb-4"
              />
              <input
                type="date"
                name="date"
                value={editCalendarData.date}
                onChange={(e) =>
                  setEditCalendarData({ ...editCalendarData, date: e.target.value })
                }
                className="w-full px-4 py-2 border rounded mb-4"
              />
              <input
                type="text"
                name="displayTo"
                value={editCalendarData.displayTo.join(',')}
                onChange={(e) =>
                  setEditCalendarData({
                    ...editCalendarData,
                    displayTo: e.target.value.split(',').map((item) => item.trim()),
                  })
                }
                placeholder="Display To (comma-separated roles)"
                className="w-full px-4 py-2 border rounded mb-4"
              />
            </div>
            <div className="mt-4 flex justify-between">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded"
                onClick={() => {
                  setEditCalendarModal(false);
                  setEditCalendarData({
                    title: '',
                    date: '',
                    description: '',
                    displayTo: [],
                  });
                  setSelectedEvent(null);
                }}
              >
                Cancel
              </button>

              <button
                className="bg-[#146192] text-white px-4 py-2 rounded"
                onClick={async () => {
                  try {
                    await dispatch(
                      editTeacherCalendarEvent({
                        token,
                        calendarId: selectedEvent._id,
                        updatedData: editCalendarData,
                      })
                    ).unwrap();

                    toast.success('Event updated successfully.');
                    setEditCalendarModal(false); // Close modal
                    dispatch(fetchTeacherCalendar(token)); // Optional: refresh all calendar data
                    dispatch(fetchTeacherCalendarByDate({ // ✅ Refresh events of selected date only
                      token,
                      date: selectedDate.toISOString().split('T')[0],
                    }));
                  } catch (err) {
                    toast.error('Failed to update event.');
                  }
                }}
              >
                Update Event
              </button>


            </div>
          </div>
        </div>
      )}


      <ToastContainer />
    </div>
  );
}

export default TeacherDashboard;