import { useRef, useEffect, useState } from 'react';
import { BellIcon, Cog6ToothIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import FloatingLabelInput from './FloatingLabelInput';
import Image from 'next/image';
import Papa from 'papaparse';
import { supabase } from '../lib/supabase';
import DownloadOverlay from './DownloadOverlay';


type Props = {
    search: string;
    setSearch: (val: string) => void;
    type: string;
    setType: (val: string) => void;
    birthday: string;
    setBirthday: (val: string) => void;
    onSearch: () => void;
    onAddClient: () => void;
  };

export default function SearchBar({
  search,
  setSearch,
  type,
  setType,
  birthday,
  setBirthday,
  onSearch,
  onAddClient
}: Props) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const [downloadStatus, setDownloadStatus] = useState<string | null>(null);


  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!notifRef.current?.contains(e.target as Node)) setShowNotifications(false);
      if (!settingsRef.current?.contains(e.target as Node)) setShowSettings(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const handleDownloadCSV = async () => {
    setDownloadStatus('Preparing download...');
  
    await new Promise((res) => setTimeout(res, 700)); // Fake delay
  
    const { data, error } = await supabase.from('clients').select('*');
  
    if (error || !data) {
      console.error('CSV download failed:', error?.message);
      setDownloadStatus(null);
      return;
    }
  
    setDownloadStatus('Downloading...');
  
    await new Promise((res) => setTimeout(res, 700)); // Another brief delay
  
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'client_list.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  
    setDownloadStatus('Download complete');
  
    // Auto close after delay
    setTimeout(() => setDownloadStatus(null), 1500);
  };
  
  

  return (
    <div className="bg-white rounded-xl shadow-md px-6 py-6 sm:px-8 my-6">
    <h2 className="text-xl font-bold text-red-900 mb-4">Client Directory</h2>

    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        {/* Form Section */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 w-full max-w-4xl">
        <div className="flex-[2] min-w-[200px]">
            <FloatingLabelInput
            label="Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            />
        </div>

        <div className="flex-[1.2] min-w-[160px]">
            <FloatingLabelInput
            label="Birthday"
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            />
        </div>

        <div className="flex-[1.2] min-w-[160px] relative group">
            <label className="absolute -top-2 left-4 bg-white px-1 text-sm text-gray-900 z-10 group-hover:text-red-900 group-hover:font-semibold group-focus-within:text-red-900 transition-colors">
            Account Type
            </label>
            <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border-2 border-gray-500 rounded-xl px-4 py-[0.65rem] bg-white text-gray-700 focus:outline-none focus:ring-1 group-focus:border-2 group-hover:border-2 focus:ring-red-900 group-hover:border-red-900 transition-all"
            >
            <option value="Checking">Checking</option>
            <option value="Savings">Savings</option>
            <option value="All">All</option>
            </select>
        </div>

        {/* Search Button */}
        <button
            onClick={onSearch}
            className="flex items-center justify-center border-1 border-gray-900 gap-2 bg-red-900 text-white px-4 py-3 rounded-xl hover:bg-red-800 transition w-full sm:w-auto"
        >
            <MagnifyingGlassIcon className="h-5 w-5" />
        </button>
        </div>

        {/* Icons Section */}
        <div className="flex items-center gap-4 justify-end">
        <div ref={notifRef} className="relative">
            <button onClick={() => setShowNotifications(!showNotifications)}>
            <BellIcon className="h-6 w-6 text-gray-400 hover:text-red-800" />
            </button>
            {showNotifications && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-md border border-gray-300 rounded-md z-50 p-3 text-sm text-gray-500">
                No new notifications
            </div>
            )}
        </div>

        <div ref={settingsRef} className="relative">
            <button onClick={() => setShowSettings(!showSettings)}>
            <Cog6ToothIcon className="h-6 w-6 text-gray-400 hover:text-red-800" />
            </button>
            {showSettings && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-md border border-gray-300 rounded-md z-50 text-sm">
                <button
                onClick={onAddClient}
                className="block w-full text-left text-gray-500 px-4 py-2 hover:bg-gray-100"
                >
                Add New Client
                </button>
                <button
                    onClick={handleDownloadCSV}
                    className="block w-full text-left text-gray-500 px-4 py-2 hover:bg-gray-100"
                >
                    Download Client List
                </button>
            </div>
            )}
        </div>

        <Image
            src="/avatar.jpg"
            alt="User"
            width={40}
            height={40}
            className="rounded-full object-cover border border-red-900"
        />
        </div>
    </div>
    {downloadStatus && <DownloadOverlay status={downloadStatus} />}
    </div>


  );
}
