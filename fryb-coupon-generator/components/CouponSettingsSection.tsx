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
  const [couponValue, setCouponValue] = useState(5);
  
  const [error, setError] = useState('');
  const [summary, setSummary] = useState<{ 
    employees: number; 
    totalCoupons: number; 
    totalSheets: number; 
  } | null>(null);

  useEffect(() => {
    const savedSettings = getCouponSettings();
    if (savedSettings) {
      setMonth(savedSettings.month);
      setYear(savedSettings.year);
      if (savedSettings.coupon_value !== undefined) {
        setCouponValue(savedSettings.coupon_value);
      }
    }
    
    const handleUpdate = () => {
      const s = getCouponSettings();
      if (!s) {
        setMonth(new Date().getMonth() + 1);
        setYear(new Date().getFullYear());
        setCouponValue(5);
        setSummary(null);
        onCouponsGenerated([]);
      }
    }
    window.addEventListener('settingsUpdated', handleUpdate);
    return () => window.removeEventListener('settingsUpdated', handleUpdate);
  }, []);

  const handleGenerate = () => {
    setError('');
    
    if (couponValue <= 0) {
      setError('Coupon value must be greater than 0.');
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
      coupon_value: couponValue
    };
    
    setCouponSettings(settings);
    
    const groups = generateCoupons(employees, settings);
    onCouponsGenerated(groups);
    
    setSummary({
      employees: employees.length,
      totalCoupons: employees.length * 30,
      totalSheets: employees.length
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
          <label className="text-sm font-medium text-gray-700">Value per coupon (SAR)</label>
          <input
            type="number"
            value={couponValue}
            onChange={(e) => setCouponValue(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
            min={1}
          />
        </div>

        <div className="md:col-span-1 mt-2">
          <button
            onClick={handleGenerate}
            className="w-full bg-green-600 text-white font-medium py-2.5 px-6 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-sm transition-colors shadow-sm"
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
              <span className="text-blue-700/80 text-xs uppercase tracking-wider">Coupons / Emp</span>
              <span className="font-bold text-lg">30</span>
            </li>
            <li className="flex flex-col">
              <span className="text-blue-700/80 text-xs uppercase tracking-wider">Total Coupons</span>
              <span className="font-bold text-lg">{summary.totalCoupons}</span>
            </li>
            <li className="flex flex-col">
              <span className="text-blue-700/80 text-xs uppercase tracking-wider">Total A4 Pages</span>
              <span className="font-bold text-lg">{summary.totalSheets}</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
