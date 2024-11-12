
import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);

  const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const startDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.setMonth(currentDate.getMonth() - 1))
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.setMonth(currentDate.getMonth() + 1))
    );
  };

  const addEvent = (day) => {
    const event = prompt("Ingrese el evento");
    if (event) {
      const newEvent = { date: new Date(currentDate.getFullYear(), currentDate.getMonth(), day), event };
      setEvents([...events, newEvent]);
    }
  };

  const getEventsForDay = (day) => {
    return events.filter(event => 
      event.date.toDateString() === 
      new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString()
    );
  };

  const renderDays = () => {
    const days = [];
    const daysInCurrentMonth = daysInMonth(currentDate.getMonth(), currentDate.getFullYear());
    const startDay = startDayOfMonth(currentDate.getMonth(), currentDate.getFullYear());

    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="empty-day" />);
    }

    for (let day = 1; day <= daysInCurrentMonth; day++) {
      days.push(
        <div key={day} className="day" onClick={() => addEvent(day)}>
          <div>{day}</div>
          <div className="events">
            {getEventsForDay(day).map((event, index) => (
              <div key={index} className="event">
                {event.event}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="calendar">
      <header className="calendar-header">
        <button onClick={prevMonth}><FaChevronLeft /></button>
        <h2>{currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}</h2>
        <button onClick={nextMonth}><FaChevronRight /></button>
      </header>
      <div className="calendar-grid">
        {renderDays()}
      </div>
      <style jsx>{`
        .calendar {
          border: 1px solid #ccc;
          border-radius: 10px;
          overflow: hidden;
          background-color: #f0f0f0;
        }
        .calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #6A0DAD; /* Color borravino */
          color: white;
          padding: 10px;
        }
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 5px;
          padding: 10px;
        }
        .day, .empty-day {
          background-color: white;
          padding: 10px;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .day:hover {
          background-color: #6A0DAD22;
        }
        .events {
          margin-top: 5px;
        }
        .event {
          background-color: #b565a7;
          color: white;
          padding: 2px 5px;
          border-radius: 3px;
          margin-top: 2px;
          font-size: 12px;
        }
      `}</style>
    </div>
  );
};

export default Calendar;
