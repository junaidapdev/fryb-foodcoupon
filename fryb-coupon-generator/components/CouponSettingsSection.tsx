"use client";

import React, { useState, useEffect } from 'react';
import { getCouponSettings, setCouponSettings, getEmployees } from '@/lib/storage';
import { generateCoupons } from '@/lib/coupons';
import { EmployeeSheetGroup, CouponSettings } from '@/types';

type Props = {
  onCouponsGenerated: (groups: EmployeeSheetGroup[]) => void;
};

const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

export default function CouponSettingsSection({ onCouponsGenerated }: Props) {
  const currentDate = new Date();
  
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState(currentDate.getFullYear());
  const [tier1Copies, setTier1Copies] = useState(11);
  const [tier2Copies, setTier2Copies] = useState(15);
  
  const [error, setError] = useState('');
  const [summary, setSummary] = useState<{ 
    employees: number; 
    tier1Total: number; 
    tier2Total: number; 
    totalSheets: number; 
  } | null>(null);

  useEffect(() => {
    const savedSettings = getCouponSettings();
    if (savedSettings) {
      setMonth(savedSettings.month);
      setYear(savedSettings.year);
      setTier1Copies(savedSettings.tier1_copies);
      setTier2Copies(savedSettings.tier2_copies);
    }
    
    const handleUpdate = () => {
      const s = getCouponSettings();
      if (!s) {
        setMonth(new Date().getMonth() + 1);
        setYear(new Date().getFullYear());
        setTier1Copies(11);
        setTier2Copies(15);
        setSummary(null);
        onCouponsGenerated([]);
      }
    }
    window.addEventListener('settingsUpdated', handleUpdate);
    return () => window.removeEventListener('settingsUpdated', handleUpdate);
  }, []);

  const handleGenerate = () => {
    setError('');
    
    if (tier1Copies < 0 || tier2Copies < 0) {
      setError('Copies per employee cannot be negative.');
      return;
    }

    if (tier1Copies === 0 && tier2Copies === 0) {
      setError('You must generate at least 1 coupon per employee in total.');
      return;
    }
    
    const employees = getEmployees();
    
    if (employees.length === 0) {
      setError('No employees found. Please add employees first.');
      onCouponsGenerated([]);
      setSummary(null);
      return;
    }
    
    const settings: CouponSettings = {
      month,
      year,
      tier1_copies: tier1Copies,
      tier2_copies: tier2Copies
    };
    
    setCouponSettings(settings);
    
    const groups = generateCoupons(employees, settings);
    onCouponsGenerated(groups);
    
    setSummary({
      employees: employees.length,
      tier1Total: tier1Copies,
      tier2Total: tier2Copies,
      totalSheets: employees.length * 2
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-inner grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 items-end">
        
        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-gray-700">Month</label>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
          >
            {MONTHS.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-gray-700">Year</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
            min={2000}
            max={2100}
          />
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-gray-700">5 SAR Coupons per employee</label>
          <input
            type="number"
            value={tier1Copies}
            onChange={(e) => setTier1Copies(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
            min={0}
          />
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-gray-700">3 SAR Coupons per employee</label>
          <input
            type="number"
            value={tier2Copies}
            onChange={(e) => setTier2Copies(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
            min={0}
          />
        </div>

        <div className="md:col-span-4 mt-2">
          <button
            onClick={handleGenerate}
            className="w-full sm:w-auto bg-green-600 text-white font-medium py-2.5 px-6 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-sm transition-colors shadow-sm"
          >
            Generate Coupons
          </button>
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm flex items-center bg-red-50 p-4 rounded-md border border-red-100">
          <span className="mr-2 text-lg">⚠</span> {error}
        </div>
      )}

      {summary && !error && (
        <div className="bg-blue-50 border border-blue-100 rounded-md p-5 text-sm text-blue-900 shadow-sm animate-fade-in-down">
          <h4 className="font-semibold text-base mb-3 border-b border-blue-200 pb-2">Generation Summary</h4>
          <ul className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <li className="flex flex-col">
              <span className="text-blue-700/80 text-xs uppercase tracking-wider">Total Employees</span>
              <span className="font-bold text-lg">{summary.employees}</span>
            </li>
            <li className="flex flex-col">
              <span className="text-blue-700/80 text-xs uppercase tracking-wider">5 SAR Coupons / Emp</span>
              <span className="font-bold text-lg">{summary.tier1Total}</span>
            </li>
            <li className="flex flex-col">
              <span className="text-blue-700/80 text-xs uppercase tracking-wider">3 SAR Coupons / Emp</span>
              <span className="font-bold text-lg">{summary.tier2Total}</span>
            </li>
            <li className="flex flex-col">
              <span className="text-blue-700/80 text-xs uppercase tracking-wider">Total Sheets (A4)</span>
              <span className="font-bold text-lg">{summary.totalSheets}</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
