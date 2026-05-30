import React from 'react';
import { EmployeeSheetGroup } from '@/types';

type Props = {
  groups: EmployeeSheetGroup[];
};

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const getLastDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 0).getDate();
};

export default function CouponPreview({ groups }: Props) {
  if (!groups || groups.length === 0) {
    return (
      <div className="h-32 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg text-gray-500 no-print bg-gray-50/50">
        No coupons generated yet. Configure settings above to generate.
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const totalCoupons = groups.reduce((acc, g) => acc + g.coupons.length, 0);

  return (
    <div className="space-y-6 print:space-y-0">
      <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-inner no-print">
        <span className="font-medium text-gray-700 text-lg">
          <span className="text-green-600 font-bold">{totalCoupons}</span> coupons ready across <span className="text-green-600 font-bold">{groups.length * 2}</span> sheets
        </span>
        <button
          onClick={handlePrint}
          className="mt-4 sm:mt-0 bg-gray-900 text-white font-medium py-2.5 px-6 rounded-md hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 text-sm transition-all shadow-md flex items-center gap-2 hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
          Print / Save as PDF
        </button>
      </div>

      <div className="print:block flex flex-col space-y-12 print:space-y-0 print:bg-white">
        {groups.map((group) => {
          const firstCoupon = group.coupons[0];
          const monthName = firstCoupon ? MONTHS[firstCoupon.month - 1] : '';
          const year = firstCoupon ? firstCoupon.year : new Date().getFullYear();
          const lastDay = firstCoupon ? getLastDayOfMonth(year, firstCoupon.month) : 30;
          
          const getOrdinal = (n: number) => {
            const s = ["th", "st", "nd", "rd"];
            const v = n % 100;
            return n + (s[(v - 20) % 10] || s[v] || s[0]);
          };

          const sheetsData = [
            { id: `${group.employee.id}-1`, title: `1st – 15th ${monthName} ${year}` },
            { id: `${group.employee.id}-2`, title: `16th – ${getOrdinal(lastDay)} ${monthName} ${year}` }
          ];

          return sheetsData.map((sheet) => {
             // to guarantee at least 28 cells, pad coupons with nulls
             const cells = [...group.coupons];
             while (cells.length < 28) {
               cells.push(null as any);
             }
             const finalCells = cells.slice(0, 28);

             return (
               <div 
                 key={sheet.id}
                 className="sheet-container print:break-after-always bg-white shadow-xl mx-auto w-full max-w-[210mm] min-h-[297mm] p-[8mm] print:shadow-none print:w-full print:h-full print:min-h-0 print:p-0 flex flex-col box-border"
               >
                 <div className="text-center font-bold text-gray-500 text-sm no-print mb-2">{sheet.title} - {group.employee.name}</div>
                 
                 {/* The actual grid area for printing */}
                 <div className="grid grid-cols-4 grid-rows-7 h-full flex-grow gap-0 box-border print:w-full print:h-[281mm]">
                   {finalCells.map((coupon, index) => {
                     if (!coupon) {
                       return (
                         <div key={`empty-${index}`} className="border-[0.5px] border-black border-dashed flex-1 box-border" />
                       );
                     }
                     
                     return (
                        <div 
                          key={`${coupon.id}-${index}`} 
                          className="border border-black p-1 flex flex-col break-inside-avoid overflow-hidden relative box-border bg-white"
                        >
                          {/* Title */}
                          <div className="text-center border-b border-black pb-[1px] mb-1 flex-shrink-0 mx-2">
                            <div className="font-bold text-[10px] tracking-widest uppercase text-black leading-tight">Food Coupon</div>
                          </div>
                          
                          <div className="flex flex-row items-center h-full px-1">
                            {/* Left side: Logo */}
                            <div className="flex-shrink-0 w-[70px] h-[70px] flex items-center justify-center">
                              <img 
                                src="/fryb-logo.png" 
                                alt="FryB Logo" 
                                className="w-full h-full object-contain" 
                                onError={(e) => { e.currentTarget.style.display = 'none'; }} 
                              />
                            </div>

                            {/* Right side: Details */}
                            <div className="flex-grow pl-2 space-y-0.5 text-[9px] leading-tight text-black min-w-0">
                              <div className="flex flex-row">
                                <span className="font-semibold w-9 flex-shrink-0">Name:</span>
                                <span className="font-bold truncate">{coupon.employee_name}</span>
                              </div>
                              <div className="flex flex-row">
                                <span className="font-semibold w-9 flex-shrink-0">Code:</span>
                                <span className="font-bold tracking-tight truncate">{coupon.coupon_code}</span>
                              </div>
                              <div className="flex flex-row">
                                <span className="font-semibold w-9 flex-shrink-0">Value:</span>
                                <span className="font-bold truncate">{coupon.coupon_value} SAR</span>
                              </div>
                            </div>
                          </div>
                        </div>
                     );
                   })}
                 </div>
               </div>
             );
          });
        })}
      </div>
    </div>
  );
}
