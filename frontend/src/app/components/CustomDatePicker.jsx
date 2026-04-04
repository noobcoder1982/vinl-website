import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function CustomDatePicker({ value, onChange, label, disabled }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Parse current value or default to today
  const initialDate = value ? new Date(value) : new Date();
  const [viewDate, setViewDate] = useState(initialDate);
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null);

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleDateSelect = (day) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    setSelectedDate(newDate);
    onChange(newDate.toISOString().split('T')[0]);
    setIsOpen(false);
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const years = [];
  const currentYear = new Date().getFullYear();
  for (let i = currentYear; i >= currentYear - 100; i--) {
    years.push(i);
  }

  return (
    <div className={`flex flex-col gap-2 relative w-full ${isOpen ? 'z-[100]' : 'z-10'}`} ref={containerRef}>
      {label && <label className="text-white/40 text-[10px] font-black uppercase tracking-wider ml-1">{label}</label>}
      
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 flex items-center justify-between hover:bg-white/[0.08] transition-all group ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <div className="flex items-center gap-3">
          <CalendarIcon size={16} className={`transition-colors ${selectedDate ? 'text-indigo-400' : 'text-white/20 group-hover:text-white/60'}`} />
          <span className={`text-sm ${selectedDate ? 'text-white font-bold' : 'text-white/30'}`}>
            {selectedDate ? selectedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "Select Birthday"}
          </span>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="absolute top-full mt-4 left-0 right-0 md:left-auto md:w-[320px] bg-[#121212]/98 backdrop-blur-3xl border border-white/10 rounded-[28px] shadow-2xl z-[200] p-6 overflow-hidden shadow-indigo-950/40"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex flex-col">
                <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[2px]">{viewDate.getFullYear()}</span>
                <span className="text-white text-lg font-black tracking-tight">{months[viewDate.getMonth()]}</span>
              </div>
              <div className="flex gap-1">
                <button onClick={handlePrevMonth} className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <ChevronLeft size={18} className="text-white" />
                </button>
                <button onClick={handleNextMonth} className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <ChevronRight size={18} className="text-white" />
                </button>
              </div>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 mb-2">
              {weekdays.map(d => (
                <div key={d} className="text-center text-[10px] font-black text-white/20 uppercase py-2">{d}</div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth()) }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth(viewDate.getFullYear(), viewDate.getMonth()) }).map((_, i) => {
                const day = i + 1;
                const isSelected = selectedDate?.getDate() === day && 
                                   selectedDate?.getMonth() === viewDate.getMonth() && 
                                   selectedDate?.getFullYear() === viewDate.getFullYear();
                const isToday = new Date().getDate() === day && 
                                new Date().getMonth() === viewDate.getMonth() && 
                                new Date().getFullYear() === viewDate.getFullYear();

                return (
                  <button
                    key={day}
                    onClick={() => handleDateSelect(day)}
                    className={`aspect-square w-full rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                      isSelected ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 
                      isToday ? 'bg-white/10 text-indigo-400' : 'text-white/80 hover:bg-white/10'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Year Selector Hint */}
            <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-center">
               <select 
                 value={viewDate.getFullYear()} 
                 onChange={(e) => setViewDate(new Date(parseInt(e.target.value), viewDate.getMonth(), 1))}
                 className="bg-transparent text-white/40 text-[11px] font-black uppercase tracking-widest outline-none cursor-pointer hover:text-white transition-colors"
               >
                 {years.map(y => <option key={y} value={y} className="bg-[#121212]">{y}</option>)}
               </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
