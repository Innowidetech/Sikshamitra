import React, { useState } from 'react';

const Calendar = ({ events }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

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
              relative h-12 flex flex-col items-center justify-center
              ${day.isEmpty ? 'text-gray-300' : 'cursor-pointer hover:bg-gray-50'}
              ${day.hasEvent ? 'bg-blue-50' : ''}
              rounded-md transition-colors duration-200
              group
            `}
          >
            <span className="mb-2">{day.day}</span>
            {day.hasEvent && (
              <>
                <div className="absolute bottom-1 flex gap-1 justify-center">
                  {day.events.slice(0, 3).map((_, i) => (
                    <span key={i} className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  ))}
                </div>
                <div className="absolute invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 bottom-full mb-2 z-10 w-max max-w-[200px]">
                  {day.events.map((event, i) => (
                    <div key={i} className="whitespace-nowrap overflow-hidden text-ellipsis">
                      {event.title}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;