import React, { useState } from 'react';
import { ChevronRight, Plus, Clock, MapPin, CheckCircle, X } from 'lucide-react';

export const ScheduleCard = ({ initialSchedules }) => {
  const [schedules, setSchedules] = useState(initialSchedules);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAllModalOpen, setIsAllModalOpen] = useState(false);

  // New item form state
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newColor, setNewColor] = useState('#9BDD7C');

  const handleToggleComplete = (id) => {
    setSchedules((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleAddSchedule = (e) => {
    e.preventDefault();
    if (!newTitle) return;

    const newItem = {
      id: 'sch-' + Date.now(),
      title: newTitle,
      time: newTime || '10.00-11.00',
      location: newLocation || 'Virtual Conference Room',
      color: newColor,
      completed: false,
    };

    setSchedules([...schedules, newItem]);
    setNewTitle('');
    setNewTime('');
    setNewLocation('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-2xs border border-slate-100/80 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-montserrat font-bold text-lg text-black">Today&apos;s schedule</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="p-1 rounded-full text-slate-400 hover:text-black hover:bg-slate-100 transition-colors"
            title="Add schedule item"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsAllModalOpen(true)}
            className="flex items-center gap-0.5 text-xs text-[#858585] hover:text-black font-medium transition-colors"
          >
            <span>See All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Schedule Items List */}
      <div className="space-y-4">
        {schedules.slice(0, 3).map((item) => (
          <div
            key={item.id}
            onClick={() => handleToggleComplete(item.id)}
            style={{ borderLeftColor: item.color }}
            className={`border-l-4 pl-3.5 py-0.5 cursor-pointer group transition-opacity ${
              item.completed ? 'opacity-50' : 'opacity-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <h4
                className={`font-montserrat font-bold text-xs sm:text-sm text-[#4B4B4B] group-hover:text-black transition-colors ${
                  item.completed ? 'line-through' : ''
                }`}
              >
                {item.title}
              </h4>
              {item.completed && (
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-2" />
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#999999] font-lato mt-0.5">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{item.time}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#999999] font-lato mt-0.5">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>{item.location}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Add Schedule Item */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-montserrat font-bold text-sm text-black">New Schedule Item</h4>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-black p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddSchedule} className="mt-4 space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q3 Roadmap Review"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Time Slot
                </label>
                <input
                  type="text"
                  placeholder="e.g. 15.00-16.30"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. at Conference Hall B"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Accent Color
                </label>
                <div className="flex gap-3">
                  {['#9BDD7C', '#6972C3', '#EE8484', '#F6DC7D'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewColor(c)}
                      className={`w-6 h-6 rounded-full transition-transform ${
                        newColor === c ? 'scale-125 ring-2 ring-black' : ''
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-semibold text-white bg-black hover:bg-neutral-800 rounded-xl transition-colors"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: See All Schedules */}
      {isAllModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-montserrat font-bold text-base text-black">All Schedules</h4>
              <button
                onClick={() => setIsAllModalOpen(false)}
                className="text-slate-400 hover:text-black p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4 space-y-3.5 max-h-80 overflow-y-auto pr-1">
              {schedules.map((item) => (
                <div
                  key={item.id}
                  style={{ borderLeftColor: item.color }}
                  className={`border-l-4 pl-3.5 py-1 ${item.completed ? 'opacity-50' : ''}`}
                >
                  <div className="font-montserrat font-bold text-xs sm:text-sm text-[#4B4B4B]">
                    {item.title}
                  </div>
                  <div className="text-xs text-[#999999]">{item.time}</div>
                  <div className="text-xs text-[#999999]">{item.location}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
