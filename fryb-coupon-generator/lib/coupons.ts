import { Employee, CouponSettings, EmployeeSheetGroup, Coupon } from '../types';

const MONTH_ABBR = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
];

export const generateCoupons = (
  employees: Employee[],
  settings: CouponSettings
): EmployeeSheetGroup[] => {
  const groups: EmployeeSheetGroup[] = [];

  const monthAbbr = MONTH_ABBR[settings.month - 1];
  const year2 = settings.year.toString().slice(-2);
  
  for (const emp of employees) {
    let localCounter = 1;
    const coupons: Coupon[] = [];

    // Generate Tier 1 (5 SAR)
    if (settings.tier1_copies > 0) {
      for (let i = 0; i < settings.tier1_copies; i++) {
        const coupon_code = `${monthAbbr}${year2}-T${localCounter}`;
        localCounter++;
        
        coupons.push({
          id: crypto.randomUUID(),
          employee_id: emp.id,
          employee_name: emp.name,
          employee_code: emp.employee_code,
          coupon_code,
          coupon_value: 5,
          copy_number: i + 1,
          month: settings.month,
          year: settings.year
        });
      }
    }

    // Generate Tier 2 (3 SAR)
    if (settings.tier2_copies > 0) {
      for (let i = 0; i < settings.tier2_copies; i++) {
        const coupon_code = `${monthAbbr}${year2}-T${localCounter}`;
        localCounter++;
        
        coupons.push({
          id: crypto.randomUUID(),
          employee_id: emp.id,
          employee_name: emp.name,
          employee_code: emp.employee_code,
          coupon_code,
          coupon_value: 3,
          copy_number: i + 1,
          month: settings.month,
          year: settings.year
        });
      }
    }
    
    groups.push({
      employee: emp,
      coupons
    });
  }

  return groups;
};
