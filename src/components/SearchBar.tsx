import { useRef, useEffect, useState } from 'react';
import { BellIcon, Cog6ToothIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import FloatingLabelInput from './FloatingLabelInput';

type Props = {
  search: string;
  setSearch: (val: string) => void;
  type: string;
  setType: (val: string) => void;
  birthday: string;
  setBirthday: (val: string) => void;
  onSearch: () => void;
};

export default function SearchBar({
  search,
  setSearch,
  type,
  setType,
  birthday,
  setBirthday,
  onSearch
}: Props) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!notifRef.current?.contains(e.target as Node)) setShowNotifications(false);
      if (!settingsRef.current?.contains(e.target as Node)) setShowSettings(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 my-6">
      <h2 className="text-xl font-bold text-red-900 mb-4">Client Directory</h2>
      <div className="flex items-center justify-between gap-4">
        {/* Input fields */}
        <div className="flex gap-4 w-full max-w-4xl items-end">
          <div className="flex-[2]">
            <FloatingLabelInput
              label="Name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex-[1.2]">
            <FloatingLabelInput
              label="Birthday"
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
            />
          </div>

          <div className="flex-[1.2] relative w-full group">
            <label className="absolute -top-2 left-4 bg-white px-1 text-sm text-gray-900 z-10 group-hover:text-red-900 group-hover:font-semibold group-focus:font-semibold group-focus-within:text-red-900 transition-colors">
              Account Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border-2 border-gray-500 rounded-xl px-4 py-[0.65rem] appearance-none bg-white text-gray-700 focus:outline-none focus:ring-1 group-focus:border-2 group-hover:border-2 focus:ring-red-900 group-hover:border-red-900 transition-all"
            >
              <option className="bg-white" value="Checking">Checking</option>
              <option className="bg-white" value="Savings">Savings</option>
              <option className="bg-white" value="All">All</option>
            </select>
          </div>

          <button
            onClick={onSearch}
            className="bg-red-900 text-white p-3 rounded-lg shadow hover:bg-red-800"
          >
            <MagnifyingGlassIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Notifications, Settings, Avatar */}
        <div className="relative flex items-center gap-4">
          <div ref={notifRef} className="relative">
            <button onClick={() => setShowNotifications(!showNotifications)}>
              <BellIcon className="h-6 w-6 text-gray-400 hover:text-red-800" />
            </button>
            {showNotifications && (
              <div className="absolute left-0 mt-2 w-48 bg-white shadow-md border border-gray-500 rounded-md z-50 p-3 text-sm text-gray-500">
                No new notifications
              </div>
            )}
          </div>

          <div ref={settingsRef} className="relative">
            <button onClick={() => setShowSettings(!showSettings)}>
              <Cog6ToothIcon className="h-6 w-6 text-gray-400 hover:text-red-800" />
            </button>
            {showSettings && (
              <div className="absolute left-0 mt-2 w-48 bg-white shadow-md border border-gray-500 rounded-md z-50 text-sm">
                <button className="block w-full text-gray-500 text-left px-4 py-2 hover:bg-gray-100">
                  Add New Client
                </button>
              </div>
            )}
          </div>

          <img
            src="/avatar.jpg"
            alt="User"
            className="h-10 w-10 rounded-full object-cover border border-red-900"
          />
        </div>
      </div>
    </div>
  );
}
