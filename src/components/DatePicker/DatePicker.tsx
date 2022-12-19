import { useState } from "react";

export function DatePicker() {
  const [date, setDate] = useState(new Date());

  const formattedDate = date.toISOString().split("T")[0];
  const month = date.getMonth();
  const year = date.getFullYear();
  const firstDate = new Date(year, month, 1);
  const lastDate = new Date(year, month + 1, 0);
  const numOfDays = lastDate.getDate();

  return (
    <div>
      <input type="date" value={formattedDate} onChange={(e) => setDate(new Date(e.target.value))} />
      <p>Month: {month}</p>
      <p>Year: {year}</p>
      <p>Number of days in month: {numOfDays}</p>
      <p>First date: {firstDate.toLocaleDateString()}</p>
      <p>First day: {firstDate.getDay()}</p>

      <p className="mt-4">Calendar</p>
      <div className="mt-4 grid grid-cols-7 bg-cyan-200">
        {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => {
          return <p key={day}>{day}</p>;
        })}

        {Array.from<number, JSX.Element>({ length: firstDate.getDay() }, (_, i) => {
          return <button key={`pastmonth-${i}`}></button>;
        })}

        {Array.from<number, JSX.Element>({ length: numOfDays }, (_, i) => {
          return (
            <button key={i} className="w-6 h-6">
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}
