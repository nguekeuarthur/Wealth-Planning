import React, { useState } from "react";
import moment from "moment";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const ProjectCalendar = ({ startDate, endDate }) => {
  const [currentDate, setCurrentDate] = useState(moment());

  // Get the first day of the month and the number of days
  const startOfMonth = currentDate.clone().startOf("month");
  const endOfMonth = currentDate.clone().endOf("month");
  const daysInMonth = currentDate.daysInMonth();
  const firstDayOfWeek = startOfMonth.day(); // 0 = Sunday, 1 = Monday, etc.

  // Convert startDate and endDate to moment objects
  const projectStart = startDate ? moment(startDate) : null;
  const projectEnd = endDate ? moment(endDate) : null;

  // Check if a date is within the project period
  const isInProjectPeriod = (date) => {
    if (!projectStart || !projectEnd) return false;
    return date.isSameOrAfter(projectStart, "day") && date.isSameOrBefore(projectEnd, "day");
  };

  // Check if a date is the start date
  const isStartDate = (date) => {
    if (!projectStart) return false;
    return date.isSame(projectStart, "day");
  };

  // Check if a date is the end date
  const isEndDate = (date) => {
    if (!projectEnd) return false;
    return date.isSame(projectEnd, "day");
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(currentDate.clone().subtract(1, "month"));
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(currentDate.clone().add(1, "month"));
  };

  // Go to today
  const goToToday = () => {
    setCurrentDate(moment());
  };

  // Generate calendar days
  const calendarDays = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = startOfMonth.clone().add(day - 1, "days");
    calendarDays.push(date);
  }

  const weekDays = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={goToPreviousMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h3 className="text-lg font-semibold text-gray-900">
            {currentDate.format("MMMM YYYY")}
          </h3>
          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <button
          onClick={goToToday}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Aujourd'hui
        </button>
      </div>

      {/* Week Days Header */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-600 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const isInPeriod = isInProjectPeriod(date);
          const isStart = isStartDate(date);
          const isEnd = isEndDate(date);
          const isToday = date.isSame(moment(), "day");
          const isCurrentMonth = date.isSame(currentDate, "month");

          return (
            <div
              key={date.format("YYYY-MM-DD")}
              className={`aspect-square flex items-center justify-center text-sm rounded-lg transition-all ${
                !isCurrentMonth
                  ? "text-gray-300"
                  : isInPeriod
                  ? "bg-gray-200 text-gray-700 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              } ${
                isStart
                  ? "bg-[#1e4029] text-white font-semibold rounded-l-lg"
                  : ""
              } ${
                isEnd
                  ? "bg-[#1e4029] text-white font-semibold rounded-r-lg"
                  : ""
              } ${
                isToday && !isInPeriod
                  ? "border-2 border-[#1e4029] font-semibold"
                  : ""
              } ${
                isToday && isInPeriod
                  ? "ring-2 ring-[#1e4029] ring-offset-2"
                  : ""
              }`}
            >
              {date.date()}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
          <span className="text-gray-600">Période du projet</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#1e4029] rounded"></div>
          <span className="text-gray-600">Date de début/fin</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-[#1e4029] rounded"></div>
          <span className="text-gray-600">Aujourd'hui</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCalendar;

