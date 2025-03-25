import React, { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

const Calendar = ({ events, onEventAdded }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date: '',
    displayTo: []
  });                                                                                                                                                                                                                     

  // Get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get day of week for first day of month
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // Get events for a specific date
  const getEventsForDate = (dateString) => {
    if (!Array.isArray(events)) return [];
    return events.filter(event => {
      const eventDate = new Date(event.date);
      const adjustedDateString = eventDate.toISOString().split('T')[0];
      return adjustedDateString === dateString;
    });
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: '', isEmpty: true });
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      // Create date at noon to avoid timezone issues
      const date = new Date(year, month, day, 12, 0, 0);
      const dateString = date.toISOString().split('T')[0];
      const dayEvents = getEventsForDate(dateString);
      
      days.push({
        day,
        date: dateString,
        hasEvent: dayEvents.length > 0,
        events: dayEvents,
        isEmpty: false
      });
    }
    
    return days;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (date) => {
    if (date) {
      // Create date object at noon to avoid timezone issues
      const selectedDate = new Date(date);
      const exactDate = date; // Keep the exact date string for the form
      
      setSelectedDate(exactDate);
      setEventData({
        title: '',
        description: '',
        date: exactDate,
        displayTo: []
      });
      setIsModalOpen(true);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    
    if (!eventData.title || !eventData.description || eventData.displayTo.length === 0) {
      toast.error('Please fill all required fields');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://sikshamitra.onrender.com/api/admin/calendar',
        eventData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data) {
        toast.success('Event added successfully');
        onEventAdded();
        setIsModalOpen(false);
        setEventData({
          title: '',
          description: '',
          date: '',
          displayTo: []
        });
      }
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event');
    }
  };

  const handleCheckboxChange = (role) => {
    const updatedDisplayTo = [...eventData.displayTo];
    
    if (updatedDisplayTo.includes(role)) {
      const index = updatedDisplayTo.indexOf(role);
      updatedDisplayTo.splice(index, 1);
    } else {
      updatedDisplayTo.push(role);
    }
    
    setEventData({
      ...eventData,
      displayTo: updatedDisplayTo
    });
  };

  const formatEventTitles = (events) => {
    if (!events || events.length === 0) return '';
    return events.map(event => event.title).join('\n');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#146192]">
          {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
        </h2>
        <div className="flex space-x-2">
          <button 
            onClick={handlePrevMonth}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            &lt;
          </button>
          <button 
            onClick={handleNextMonth}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            &gt;
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-medium text-gray-500 text-sm py-1">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {generateCalendarDays().map((day, index) => (
          <div 
            key={index} 
            className={`
              h-10 flex items-center justify-center relative
              ${day.isEmpty ? 'text-gray-300' : 'cursor-pointer hover:bg-gray-100'}
              ${day.hasEvent ? 'bg-blue-100' : ''}
              ${selectedDate === day.date ? 'ring-2 ring-blue-500' : ''}
              rounded-md
            `}
            onClick={() => !day.isEmpty && handleDateClick(day.date)}
            title={day.events ? formatEventTitles(day.events) : ''}
          >
            {day.day}
            {day.hasEvent && (
              <div className="absolute bottom-1 flex gap-0.5 justify-center">
                {day.events.slice(0, 3).map((_, i) => (
                  <span key={i} className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Event Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md overflow-hidden mx-4">
            <div className="bg-[#146192] text-white p-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Fill the details to upload the dynamic calendar</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleCreateEvent}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={eventData.date}
                    readOnly
                    className="w-full p-2 border rounded-md bg-gray-100"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={eventData.title}
                    onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={eventData.description}
                    onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                    className="w-full p-2 border rounded-md h-24 resize-none"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display to *
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={eventData.displayTo.includes('admin')}
                        onChange={() => handleCheckboxChange('admin')}
                        className="mr-2"
                      />
                      Admin
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={eventData.displayTo.includes('teacher')}
                        onChange={() => handleCheckboxChange('teacher')}
                        className="mr-2"
                      />
                      Teacher
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={eventData.displayTo.includes('student')}
                        onChange={() => handleCheckboxChange('student')}
                        className="mr-2"
                      />
                      Student
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={eventData.displayTo.includes('parent')}
                        onChange={() => handleCheckboxChange('parent')}
                        className="mr-2"
                      />
                      Parent
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="w-[200px] bg-[#146192] text-white py-2 rounded-md hover:bg-[#146192]/90 transition-colors"
                  >
                    Upload
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;