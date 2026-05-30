"use client";

import React, { useRef, useState } from 'react';
import { getEmployees, setEmployees } from '@/lib/storage';
import { parseCSV, exportCSV } from '@/lib/csv';

export default function Header() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState('');

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const csvString = event.target?.result as string;
      if (csvString) {
        const existing = getEmployees();
        const { imported, skipped } = parseCSV(csvString, existing);
        
        if (imported.length > 0) {
          setEmployees([...existing, ...imported]);
          window.dispatchEvent(new Event('employeesUpdated'));
        }
        
        setMessage(`Imported ${imported.length} employees. Skipped ${skipped} duplicates/invalid.`);
        setTimeout(() => setMessage(''), 5000);
      }
    };
    reader.readAsText(file);
  };

  const handleExport = () => {
    const employees = getEmployees();
    exportCSV(employees);
  };

  const handleClearData = () => {
    if (window.confirm("This will delete all employee data. Are you sure?")) {
      localStorage.removeItem('fryb_employees');
      localStorage.removeItem('fryb_coupon_settings');
      window.dispatchEvent(new Event('employeesUpdated'));
      window.dispatchEvent(new Event('settingsUpdated'));
      setMessage("All data cleared successfully.");
      setTimeout(() => setMessage(''), 4000);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b shadow-sm z-50 flex items-center justify-between px-4 sm:px-6 overflow-x-auto no-print whitespace-nowrap">
      <div className="font-bold text-base sm:text-xl text-gray-800 flex items-center gap-4 flex-shrink-0">
        FRYB Food Coupon
        {message && (
          <span className="text-xs sm:text-sm font-medium text-blue-700 bg-blue-50 px-2 sm:px-3 py-1 rounded-full animate-fade-in-down">
            {message}
          </span>
        )}
      </div>
      <div className="flex gap-2 sm:gap-4 flex-shrink-0 ml-4">
        <input
          type="file"
          accept=".csv,text/csv,application/vnd.ms-excel,text/plain"
          ref={fileInputRef}
          onChange={handleFileChange}
          onClick={(e) => { (e.target as HTMLInputElement).value = ''; }}
          className="hidden"
        />
        <button
          onClick={handleImportClick}
          className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
        >
          Import CSV
        </button>
        <button
          onClick={handleExport}
          className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
        >
          Export CSV
        </button>
        <button
          onClick={handleClearData}
          className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
        >
          Clear Data
        </button>
      </div>
    </header>
  );
}
