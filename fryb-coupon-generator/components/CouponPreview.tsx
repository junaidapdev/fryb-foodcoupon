import React from 'react';
import { EmployeeSheetGroup } from '@/types';

type Props = {
  groups: EmployeeSheetGroup[];
};

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const formatCouponDate = (day: number, monthIndex: number, year: number) => {
  const dayStr = day.toString().padStart(2, '0');
  const monthAbbr = MONTHS[monthIndex - 1].substring(0, 3);
  return `${dayStr} ${monthAbbr} ${year}`;
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
          <span className="text-green-600 font-bold">{totalCoupons}</span> coupons ready across <span className="text-green-600 font-bold">{groups.length}</span> pages
        </span>
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 sm:mt-0">
          <div className="text-xs text-gray-500 max-w-[200px] text-right">
            Tip: In the print dialog, set <strong className="font-semibold">Margins to None</strong> and uncheck <strong className="font-semibold">Headers and Footers</strong> for the cleanest output.
          </div>
          <button
            onClick={handlePrint}
            className="bg-gray-900 text-white font-medium py-2.5 px-6 rounded-md hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 text-sm transition-all shadow-md flex items-center gap-2 hover:shadow-lg transform hover:-translate-y-0.5 whitespace-nowrap"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
            Print / Save as PDF
          </button>
        </div>
      </div>

      <div className="sheets-wrapper flex flex-col space-y-12">
        {groups.map((group) => {
          const firstCoupon = group.coupons[0];
          const monthName = firstCoupon ? MONTHS[firstCoupon.month - 1] : '';
          const year = firstCoupon ? firstCoupon.year : new Date().getFullYear();
          
          const title = `${group.employee.name} — ${monthName} ${year}`;
          const sheetCoupons = [...group.coupons];
          while (sheetCoupons.length < 30) {
            sheetCoupons.push(null as any);
          }

          return (
             <div key={group.employee.id} className="w-full overflow-x-auto pb-8 print:pb-0 print:overflow-visible flex flex-col items-center print:block">
               <div className="sheet-label text-center text-[#888] text-[13px] font-medium mb-[6px] w-full no-print">{title}</div>
               
               <div 
                 className="coupon-sheet bg-white shadow-[0_2px_12px_rgba(0,0,0,0.12)] rounded-[4px] mx-auto w-[794px] min-w-[794px] h-[1123px] min-h-[1123px] max-h-[1123px] grid grid-cols-5 grid-rows-6 box-border print:shadow-none print:rounded-none print:mb-0 mb-[32px] border-t border-l border-[#999] print:border-[#ccc]"
               >
                 {sheetCoupons.map((coupon, index) => {
                    if (!coupon) {
                      return (
                        <div key={`empty-${index}`} className="coupon-card coupon-card--empty border-r border-b border-[#ccc]" />
                      );
                    }

                    const dateFormatted = formatCouponDate(coupon.copy_number, coupon.month, coupon.year);
                    
                    return (
                    <div 
                      key={`${coupon.id}-${index}`} 
                      className="coupon-card border-r border-b border-[#ccc] flex flex-col break-inside-avoid box-border bg-white"
                    >
                      {/* Title */}
                      <div className="bg-[#111] text-white text-center font-bold text-[6.5pt] tracking-[0.5px] py-[3px] uppercase flex-shrink-0">
                        FOOD COUPON
                      </div>
                      
                      <div className="flex flex-row items-center flex-grow p-[4px_5px] gap-[5px] h-full min-h-0">
                        {/* Left side: Logo */}
                        <div className="flex-shrink-0 w-[48px] h-[48px] flex items-center justify-center">
                          <img 
                            src="/fryb-logo.png" 
                            alt="FryB Logo" 
                            className="w-full h-full object-contain" 
                            onError={(e) => { e.currentTarget.style.display = 'none'; }} 
                          />
                        </div>

                        {/* Right side: Details */}
                        <div className="flex-grow flex flex-col justify-center leading-[1.4] text-black min-w-0">
                          <div className="flex flex-row gap-[3px]">
                            <span className="font-semibold text-[6pt] text-[#555]">Name:</span>
                            <span className="font-normal text-[6pt] text-[#000]">{coupon.employee_name}</span>
                          </div>
                          <div className="flex flex-row gap-[3px]">
                            <span className="font-semibold text-[6pt] text-[#555]">Code:</span>
                            <span className="font-normal text-[5.5pt] text-[#000]">{coupon.coupon_code}</span>
                          </div>
                          <div className="flex flex-row gap-[3px]">
                            <span className="font-semibold text-[6pt] text-[#555]">Value:</span>
                            <span className="font-normal text-[6pt] text-[#000]">{coupon.coupon_value} SAR</span>
                          </div>
                          <div className="flex flex-row gap-[3px]">
                            <span className="font-semibold text-[6pt] text-[#555]">Date:</span>
                            <span className="font-normal text-[6pt] text-[#000]">{dateFormatted}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                 )})}
               </div>
             </div>
          );
        })}
      </div>
    </div>
  );
}
