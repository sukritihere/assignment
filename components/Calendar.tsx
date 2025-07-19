"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import {
  addEvent,
  setSelectedDate,
  setShowModal,
} from "@/store/slices/calendarSlice";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
} from "date-fns";

export default function Calendar() {
  const dispatch = useDispatch();
  const { events, selectedDate, showModal } = useSelector(
    (state: RootState) => state.calendar
  );
  const [currentDate, setCurrentDate] = useState(new Date());
  const [eventTitle, setEventTitle] = useState("");
  const [eventType, setEventType] = useState<"event" | "reminder">("event");

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handleDateClick = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    dispatch(setSelectedDate(dateStr));
    dispatch(setShowModal(true));
  };

  const handleAddEvent = () => {
    if (eventTitle && selectedDate) {
      dispatch(
        addEvent({
          date: selectedDate,
          title: eventTitle,
          type: eventType,
        })
      );
      setEventTitle("");
      dispatch(setShowModal(false));
    }
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return events.filter((event) => event.date === dateStr);
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  return (
    <>
      <div className="flex items-center space-x-4">
        <div className="flex flex-col pl-4">
          <h1 className="text-xl font-semibold text-gray-900 py-3">Calendar</h1>
          <div className="h-1 bg-teal-500 w-full rounded-lg" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateMonth("prev")}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigateMonth("next")}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="p-2 text-center text-sm font-medium text-gray-700"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {monthDays.map((date) => {
            const dayEvents = getEventsForDate(date);
            const isToday = isSameDay(date, new Date());

            return (
              <div
                key={date.toString()}
                onClick={() => handleDateClick(date)}
                className={`p-2 min-h-[80px] border border-gray-200 cursor-pointer hover:bg-gray-50 ${
                  isToday ? "bg-blue-50 border-blue-300" : ""
                }`}
              >
                <div className="text-sm font-medium text-gray-900 mb-1">
                  {format(date, "d")}
                </div>
                <div className="space-y-1">
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`text-xs px-2 py-1 rounded-full truncate ${
                        event.type === "event"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Add Event/Reminder</h3>
                <button
                  onClick={() => dispatch(setShowModal(false))}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setEventType("event")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        eventType === "event"
                          ? "btn-teal text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      Add Event
                    </button>
                    <button
                      onClick={() => setEventType("reminder")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        eventType === "reminder"
                          ? "btn-teal text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      Add Reminder
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter title..."
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleAddEvent}
                    className="flex-1 btn-teal text-white py-2 px-4 rounded-lg hover:btn-teal-dark transition-colors"
                  >
                    Add {eventType === "event" ? "Event" : "Reminder"}
                  </button>
                  <button
                    onClick={() => dispatch(setShowModal(false))}
                    className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
